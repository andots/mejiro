use indextree::{Arena, NodeId};
use serde::Serialize;

use crate::data::BookmarkData;
use crate::error::CoreError;

#[derive(Serialize)]
pub struct NestedBookmarks {
    index: usize,
    #[serde(flatten)]
    data: BookmarkData,
    children: Vec<NestedBookmarks>,
}

impl NestedBookmarks {
    pub(crate) fn try_new(arena: &Arena<BookmarkData>, node_id: NodeId) -> Result<Self, CoreError> {
        let node = arena
            .get(node_id)
            .ok_or(CoreError::NestedNode(node_id.into()))?;
        Ok(NestedBookmarks {
            index: node_id.into(),
            data: node.get().clone(),
            children: node_id
                .children(arena)
                .filter_map(|child| NestedBookmarks::try_new(arena, child).ok())
                .collect::<Vec<_>>(),
        })
    }
}
