use std::num::NonZeroUsize;

use indextree::{Arena, Node, NodeId};

use crate::{
    data::{BookmarkData, FolderData, NodeType},
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
        self.arena
            .iter()
            .filter(|node| node.get().node_type == NodeType::Bookmark && !node.is_removed())
            .count()
    }

    /// Find NodeId by index
    pub fn find_node_id_by_index(&self, index: usize) -> Result<NodeId, CoreError> {
        let id = NonZeroUsize::new(index).ok_or(CoreError::NoneZeroUsize())?;
        self.arena
            .get_node_id_at(id)
            .ok_or(CoreError::NodeNotFound(index))
    }

    /// Find Node by NodeId
    pub fn find_node_by_node_id(&self, node_id: NodeId) -> Option<&Node<BookmarkData>> {
        self.arena.get(node_id)
    }

    /// Find immutable Node by index
    pub fn find_node_by_index(&self, index: usize) -> Option<&Node<BookmarkData>> {
        match self.find_node_id_by_index(index) {
            Ok(node_id) => self.arena.get(node_id),
            Err(_) => None,
        }
    }

    /// Get mutable Node by index
    pub(crate) fn get_mut_node_by_index(
        &mut self,
        index: usize,
    ) -> Option<&mut Node<BookmarkData>> {
        match self.find_node_id_by_index(index) {
            Ok(node_id) => self.arena.get_mut(node_id),
            Err(_) => None,
        }
    }
}

/// Root related functions
impl Bookmarks {
    /// Get root node id (root node is always index 1)
    pub fn get_root_node_id(&self) -> Result<NodeId, CoreError> {
        self.find_node_id_by_index(1)
    }

    /// Get root children as Vec<BookmarkData>
    pub fn get_root_children(&self) -> Result<Vec<BookmarkData>, CoreError> {
        let root_id = self.get_root_node_id()?;
        let root_children = root_id
            .children(&self.arena)
            .filter_map(|node_id| self.find_node_by_node_id(node_id))
            .map(|n| n.get().clone())
            .collect::<Vec<_>>();
        Ok(root_children)
    }

    /// Get root and children folders as Vec<FolderData>
    pub fn get_root_and_children_folders(&self) -> Result<Vec<FolderData>, CoreError> {
        let root_id = self.get_root_node_id()?;
        let mut vec: Vec<FolderData> = Vec::new();
        // push root folder at first
        let root = self
            .find_node_by_node_id(root_id)
            .ok_or(CoreError::NodeNotFound(1))?;
        let root_data = root.get();
        vec.push(FolderData::new(root_id.into(), root_data.title.clone()));

        for node_id in root_id.children(&self.arena) {
            if let Some(node) = self.find_node_by_node_id(node_id) {
                let data = node.get();
                // only push if the node is folder
                if data.node_type == NodeType::Folder {
                    vec.push(FolderData::new(node_id.into(), data.title.clone()));
                }
            }
        }
        Ok(vec)
    }
}

// pub fn find_node_id_by_index(&self, index: usize) -> Option<NodeId> {
//     match NonZeroUsize::new(index) {
//         Some(index) => self.arena.get_node_id_at(index),
//         None => None,
//     }
// }
