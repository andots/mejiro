use indextree::{Arena, NodeId};
use serde::Serialize;

use crate::data::BookmarkData;
use crate::error::CoreError;

#[derive(Serialize)]
pub struct NestedBookmark {
    index: usize,
    #[serde(flatten)]
    data: BookmarkData,
    children: Vec<NestedBookmark>,
}

impl NestedBookmark {
    pub(crate) fn try_new(arena: &Arena<BookmarkData>, node_id: NodeId) -> Result<Self, CoreError> {
        let node = arena
            .get(node_id)
            .ok_or(CoreError::NestedNode(node_id.into()))?;
        Ok(Self {
            index: node_id.into(),
            data: node.get().clone(),
            children: node_id
                .children(arena)
                .filter_map(|child| Self::try_new(arena, child).ok())
                .collect::<Vec<_>>(),
        })
    }
}
