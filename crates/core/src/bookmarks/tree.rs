use std::num::NonZeroUsize;

use indextree::{Arena, Node, NodeId};

use crate::{
    data::{BookmarkData, NodeType},
    error::CoreError,
};

use super::Bookmarks;

/// Wrapper for indextree::Arena
impl Bookmarks {
    /// Get immutable arena
    pub fn arena(&self) -> &Arena<BookmarkData> {
        &self.arena
    }

    /// Count all nodes including folders, bookmarks, and removed nodes in arena
    pub fn count_all_nodes(&self) -> usize {
        self.arena.count()
    }

    /// Count all bookmarks in arena
    pub fn count_bookmarks(&self) -> usize {
        // filter removed nodes, then filter bookmark nodes, and count them
        self.arena
            .iter()
            .filter(|node| !node.is_removed())
            .filter(|node| node.get().node_type == NodeType::Bookmark)
            .count()
    }

    /// Find NodeId by index
    pub fn find_node_id_by_index(&self, index: usize) -> Result<NodeId, CoreError> {
        let id = NonZeroUsize::new(index).ok_or(CoreError::NoneZeroUsize())?;
        self.arena
            .get_node_id_at(id)
            .ok_or(CoreError::NodeIdNotFound(index))
    }

    /// Find Node by NodeId
    pub fn find_node_by_node_id(&self, node_id: NodeId) -> Result<&Node<BookmarkData>, CoreError> {
        self.arena
            .get(node_id)
            .ok_or(CoreError::NodeNotFound(node_id.into()))
    }

    /// Find immutable Node by index
    pub fn find_node_by_index(&self, index: usize) -> Result<&Node<BookmarkData>, CoreError> {
        let node_id = self.find_node_id_by_index(index)?;
        self.arena
            .get(node_id)
            .ok_or(CoreError::NodeNotFound(index))
    }

    /// Get mutable Node by index
    pub(crate) fn get_mut_node_by_index(
        &mut self,
        index: usize,
    ) -> Result<&mut Node<BookmarkData>, CoreError> {
        let node_id = self.find_node_id_by_index(index)?;
        self.arena
            .get_mut(node_id)
            .ok_or(CoreError::NodeNotFound(index))
    }

    /// Get root node id (root node is always index 1)
    pub fn get_root_node_id(&self) -> Result<NodeId, CoreError> {
        self.find_node_id_by_index(1)
    }
}
