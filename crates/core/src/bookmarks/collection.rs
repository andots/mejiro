use crate::{
    data::{BookmarkData, FolderData, NodeType, ToolbarBookmarkData},
    error::CoreError,
};

use super::Bookmarks;

impl Bookmarks {
    /// Get root children as Vec<BookmarkData>
    pub fn get_root_children(&self) -> Result<Vec<BookmarkData>, CoreError> {
        let root_id = self.get_root_node_id()?;
        let root_children = root_id
            .children(&self.arena)
            .filter_map(|node_id| self.find_node_by_node_id(node_id).ok())
            .map(|n| n.get().clone())
            .collect::<Vec<_>>();
        Ok(root_children)
    }

    /// Get root and children folders as Vec<FolderData>
    pub fn get_root_and_children_folders(&self) -> Result<Vec<FolderData>, CoreError> {
        let mut vec: Vec<FolderData> = Vec::new();
        // push root folder at first
        let root_id = self.get_root_node_id()?;
        let root = self.find_node_by_node_id(root_id)?;
        let root_data = root.get();
        vec.push(FolderData::new(root_id.into(), root_data.title.clone()));

        for node_id in root_id.children(&self.arena) {
            if let Ok(node) = self.find_node_by_node_id(node_id) {
                let data = node.get();
                // only push if the node is folder
                if data.node_type == NodeType::Folder {
                    vec.push(FolderData::new(node_id.into(), data.title.clone()));
                }
            }
        }
        Ok(vec)
    }

    /// Get toolbar bookmarks as Vec<ToolbarBookmarkData>
    pub fn get_toolbar_bookmarks(&self) -> Vec<ToolbarBookmarkData> {
        if let Ok(toolbar_id) = self.get_toolbar_node_id() {
            let bookmarks = toolbar_id
                .children(&self.arena)
                .filter_map(|node_id| {
                    self.find_node_by_node_id(node_id).ok().and_then(|node| {
                        if node.is_removed() {
                            return None;
                        }

                        let data = node.get();
                        match (&data.node_type, &data.url, &data.host) {
                            (NodeType::Bookmark, Some(url), Some(host)) => {
                                Some(ToolbarBookmarkData {
                                    index: node_id.into(),
                                    title: data.title.clone(),
                                    url: url.to_string(),
                                    host: host.clone(),
                                })
                            }
                            _ => None,
                        }
                    })
                })
                .collect::<Vec<_>>();
            bookmarks
        } else {
            Vec::new()
        }
    }
}
