use std::{fs::File, io::BufReader, num::NonZeroUsize, path::Path};

use indextree::{macros::tree, Arena, Node, NodeId};

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
        let root_data = BookmarkData::new("Root", None, NodeType::Folder);
        tree!(&mut arena, root_data);
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

    fn get_node_id_at(&self, index: usize) -> Option<NodeId> {
        match NonZeroUsize::new(index) {
            Some(index) => self.arena.get_node_id_at(index),
            None => None,
        }
    }

    #[allow(dead_code)]
    fn get_node_at(&self, index: usize) -> Option<&Node<BookmarkData>> {
        match self.get_node_id_at(index) {
            Some(node_id) => self.arena.get(node_id),
            None => None,
        }
    }

    /// To Arena to JSON
    pub fn to_json(&self) -> Result<String, CoreError> {
        Ok(serde_json::to_string(&self.arena)?)
    }

    /// Generate JSON for frontend
    pub fn to_nested_json(&self, index: usize) -> Result<String, CoreError> {
        let root_id = self.get_node_id_at(index).ok_or(CoreError::Other())?;
        let value = NestedNode::try_new(&self.arena, root_id)?;
        Ok(serde_json::to_string(&value)?)
    }

    /// Generate JSON for frontend with node_id
    pub fn to_nested_json_with_node_id(&self, node_id: &NodeId) -> Result<String, CoreError> {
        let value = NestedNode::try_new(&self.arena, *node_id)?;
        Ok(serde_json::to_string_pretty(&value)?)
    }

    pub fn add_bookmark(&mut self, url: String, title: Option<String>) -> Result<(), CoreError> {
        // if title is None, use url as title
        let title = title.unwrap_or(url.clone());
        let bookmark = BookmarkData::try_new(title.as_str(), Some(&url), NodeType::Bookmark)?;
        // TODO: for now, just add to root
        let root_id = self.get_node_id_at(1).ok_or(CoreError::Other())?;
        let node = self.arena.new_node(bookmark);
        root_id.checked_append(node, &mut self.arena)?;
        Ok(())
    }
}

// fn get_root_node_id(&self) -> Result<NodeId, CoreError> {
//     let index = NonZeroUsize::new(1).ok_or(CoreError::Other())?;
//     self.arena
//         .get_node_id_at(index)
//         .ok_or(CoreError::NodeNotFound(index))
// }

// fn get_root_node(&self) -> Result<&Node<BookmarkData>, CoreError> {
//     let root_id = self.get_root_node_id()?;
//     let root = self
//         .arena
//         .get(root_id)
//         .ok_or(CoreError::NodeNotFound(root_id.into()))?;
//     Ok(root)
// }

// pub fn add_folder(&mut self, title: String) -> Result<(), CoreError> {
//     let folder = BookmarkData::new(title.as_str(), None, NodeType::Folder);
//     // TODO: for now, just add to root
//     let root_id = self.get_root_node_id().ok_or(CoreError::Other())?;
//     let node = self.arena.new_node(folder);
//     root_id.checked_append(node, &mut self.arena)?;
//     Ok(())
// }

// To Arena to JSON (pretty)
// pub fn to_json_pretty(&self) -> Result<String, CoreError> {
//     Ok(serde_json::to_string_pretty(&self.arena)?)
// }

// Generate JSON for frontend (pretty)
// pub fn to_nested_json_pretty(&self) -> Result<String, CoreError> {
//     let root_id = self.get_root_node_id().ok_or(CoreError::Other())?;
//     let value = NestedNode::try_new(&self.arena, root_id)?;
//     Ok(serde_json::to_string_pretty(&value)?)
// }
