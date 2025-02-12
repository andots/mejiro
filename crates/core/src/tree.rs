use std::{fs::File, io::BufReader, num::NonZeroUsize, path::Path};

use indextree::{macros::tree, Arena, NodeId};
use url::Url;

use crate::{
    data::{BookmarkData, NodeType},
    error::CoreError,
    serialize::NestedNode,
};

pub struct BookmarkArena {
    pub arena: Arena<BookmarkData>,
}

impl Default for BookmarkArena {
    fn default() -> Self {
        let mut arena: Arena<BookmarkData> = Arena::new();
        let root = BookmarkData::new("Root", None, NodeType::Folder);
        tree!(&mut arena, root);
        Self { arena }
    }
}

impl BookmarkArena {
    pub fn new(arena: Arena<BookmarkData>) -> Self {
        Self { arena }
    }

    pub fn create_arena_from_file<P>(path: P) -> Result<Self, CoreError>
    where
        P: AsRef<Path>,
    {
        let file = File::open(path)?;
        let reader = BufReader::new(file);
        let arena: Arena<BookmarkData> = serde_json::from_reader(reader)?;
        Ok(Self::new(arena))
    }

    fn root_id(&self) -> Result<NodeId, CoreError> {
        let index = NonZeroUsize::new(1).ok_or(CoreError::Other())?;
        self.arena
            .get_node_id_at(index)
            .ok_or(CoreError::NodeNotFound(index))
    }

    /// To Arena to JSON
    pub fn to_json(&self) -> Result<String, CoreError> {
        Ok(serde_json::to_string(&self.arena)?)
    }

    /// To Arena to JSON (pretty)
    pub fn to_json_pretty(&self) -> Result<String, CoreError> {
        Ok(serde_json::to_string_pretty(&self.arena)?)
    }

    /// Generate JSON for frontend
    pub fn to_nested_json(&self) -> Result<String, CoreError> {
        let root_id = self.root_id()?;
        let value = NestedNode::try_new(&self.arena, root_id)?;
        Ok(serde_json::to_string(&value)?)
    }

    /// Generate JSON for frontend (pretty)
    pub fn to_nested_json_pretty(&self) -> Result<String, CoreError> {
        let root_id = self.root_id()?;
        let value = NestedNode::try_new(&self.arena, root_id)?;
        Ok(serde_json::to_string_pretty(&value)?)
    }

    /// Generate JSON the given node and its descendants
    pub fn to_nested_json_with_node_id(&self, node_id: &NodeId) -> Result<String, CoreError> {
        let value = NestedNode::try_new(&self.arena, *node_id)?;
        Ok(serde_json::to_string_pretty(&value)?)
    }

    pub fn add_bookmark(&mut self, url: String, title: Option<String>) -> Result<(), CoreError> {
        // if title is None, use url as title
        let title = title.unwrap_or(url.clone());
        let parsed_url = Url::parse(&url)?;
        let bookmark = BookmarkData::new(title.as_str(), Some(parsed_url), NodeType::Bookmark);
        // TODO: とりあえずrootに追加
        let root_id = self.root_id()?;
        let node = self.arena.new_node(bookmark);
        root_id.checked_append(node, &mut self.arena)?;
        Ok(())
    }
}
