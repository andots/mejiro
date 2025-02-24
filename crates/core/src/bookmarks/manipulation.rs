use url::Url;

use crate::{data::BookmarkData, error::CoreError};

use super::Bookmarks;

impl Bookmarks {
    /// Set is_open flag
    pub fn set_is_open(&mut self, index: usize, is_open: bool) -> Result<(), CoreError> {
        let node = self.get_mut_node_by_index(index)?;
        let data = node.get_mut();
        data.is_open = is_open;
        Ok(())
    }

    /// Toggle is_open flag
    pub fn toggle_is_open(&mut self, index: usize) -> Result<(), CoreError> {
        let node = self.get_mut_node_by_index(index)?;
        let data = node.get_mut();
        data.is_open = !data.is_open;
        Ok(())
    }

    /// Update title
    pub fn update_title(&mut self, index: usize, title: String) -> Result<(), CoreError> {
        let node = self.get_mut_node_by_index(index)?;
        let data = node.get_mut();
        data.title = title;
        Ok(())
    }

    /// Remove subtree
    pub fn remove_subtree(&mut self, index: usize) -> Result<(), CoreError> {
        if index == 1 {
            return Err(CoreError::CannotRemoveRoot());
        }
        let node_id = self.find_node_id_by_index(index)?;
        node_id.remove_subtree(&mut self.arena);
        Ok(())
    }

    /// Add folder
    pub fn add_folder(&mut self, parent_index: usize, title: &str) -> Result<(), CoreError> {
        let parent_node_id = self.find_node_id_by_index(parent_index)?;
        let new_folder = BookmarkData::new_folder(title);
        let new_node = self.arena.new_node(new_folder);
        parent_node_id.checked_append(new_node, &mut self.arena)?;
        Ok(())
    }

    /// Adds a new bookmark by comparing paths between the given URL and existing URLs
    /// If no matching URL is found, adds a new node to the top node
    pub fn add_bookmark(
        &mut self,
        url: String,
        title: Option<String>,
        top_level_index: usize,
    ) -> Result<(), CoreError> {
        // if title is None, use url as title
        let title = title.unwrap_or(url.clone());

        // get the URL of one level above the given URL as base_url_str
        // https://docs.rs/tauri/latest/tauri/webview/struct.Color.html
        // -> https://docs.rs/tauri/latest/tauri/webview/
        let parsed_url = Url::parse(&url)?;
        let mut base_url = parsed_url.clone();
        base_url
            .path_segments_mut()
            .map_err(|_| CoreError::CannotBeBase())?
            .pop_if_empty()
            .pop();
        let base_url_str = base_url.as_str();

        let top_node_id = self.find_node_id_by_index(top_level_index)?;
        let target = top_node_id.descendants(&self.arena).find(|node_id| {
            if let Ok(node) = self.find_node_by_node_id(*node_id) {
                if let Some(node_url) = &node.get().url {
                    if node_url.as_str().starts_with(base_url_str) {
                        return true;
                    }
                }
            }
            false
        });

        let bookmark = BookmarkData::try_new_bookmark(&title, &url)?;
        if let Some(target) = target {
            // if found target, append new node to the target node
            let new_node = self.arena.new_node(bookmark);
            target.checked_append(new_node, &mut self.arena)?;
        } else {
            // if not found target, append new node to the top node
            let new_node = self.arena.new_node(bookmark);
            top_node_id.checked_append(new_node, &mut self.arena)?;
        }

        Ok(())
    }

    /// Insert after the source node to the destination node
    pub fn insert_after(
        &mut self,
        source_index: usize,
        destination_index: usize,
    ) -> Result<(), CoreError> {
        // if origin node is root, return error
        if source_index == 1 {
            return Err(CoreError::CannotMoveRoot());
        }

        // if source and destination is same, return error
        if source_index == destination_index {
            return Err(CoreError::SameSourceAndDestination());
        }

        let source_node_id = self.find_node_id_by_index(source_index)?;
        let dest_node_id = self.find_node_id_by_index(destination_index)?;

        // check that dest_node_id is not a descendant of source_node_id
        if source_node_id
            .descendants(&self.arena)
            .any(|node_id| node_id == dest_node_id)
        {
            return Err(CoreError::CannotMoveToDescendant());
        }

        if destination_index == 1 {
            // if destination is root, prepend source node under the root
            dest_node_id.checked_prepend(source_node_id, &mut self.arena)?;
        } else {
            // insert after target node
            dest_node_id.checked_insert_after(source_node_id, &mut self.arena)?;
        }

        Ok(())
    }

    /// Append the source node to the destination node
    pub fn append_to_child(
        &mut self,
        source_index: usize,
        destination_index: usize,
    ) -> Result<(), CoreError> {
        // if source node is root, return error
        if source_index == 1 {
            return Err(CoreError::CannotMoveRoot());
        }

        // if source and destination is same, return error
        if source_index == destination_index {
            return Err(CoreError::SameSourceAndDestination());
        }

        let source_node_id = self.find_node_id_by_index(source_index)?;
        let dest_node_id = self.find_node_id_by_index(destination_index)?;

        // check that dest_node_id is not a descendant of source_node_id
        if source_node_id
            .descendants(&self.arena)
            .any(|node_id| node_id == dest_node_id)
        {
            return Err(CoreError::CannotMoveToDescendant());
        }

        // move to the dest children (append - to the end)
        dest_node_id.checked_append(source_node_id, &mut self.arena)?;

        Ok(())
    }

    pub fn prepend_to_child(
        &mut self,
        source_index: usize,
        destination_index: usize,
    ) -> Result<(), CoreError> {
        // if source node is root, return error
        if source_index == 1 {
            return Err(CoreError::CannotMoveRoot());
        }

        // if source and destination is same, return error
        if source_index == destination_index {
            return Err(CoreError::SameSourceAndDestination());
        }

        let source_node_id = self.find_node_id_by_index(source_index)?;
        let dest_node_id = self.find_node_id_by_index(destination_index)?;

        // check that dest_node_id is not a descendant of source_node_id
        if source_node_id
            .descendants(&self.arena)
            .any(|node_id| node_id == dest_node_id)
        {
            return Err(CoreError::CannotMoveToDescendant());
        }

        // move to the dest children (prepend - to the front)
        dest_node_id.checked_prepend(source_node_id, &mut self.arena)?;

        Ok(())
    }

    /// Add bookmark to Toolbar folder
    pub fn append_bookmark_to_toolbar(&mut self, title: &str, url: &str) -> Result<(), CoreError> {
        let toolbar_id = self.get_toolbar_node_id()?;
        let bookmark = BookmarkData::try_new_bookmark(title, url)?;
        let new_node = self.arena.new_node(bookmark);
        toolbar_id.checked_append(new_node, &mut self.arena)?;
        Ok(())
    }
}
