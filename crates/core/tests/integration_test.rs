#[cfg(test)]
mod tests {
    use mejiro_core::{bookmarks::Bookmarks, data::NodeType, error::CoreError};

    #[test]
    fn test_default() -> anyhow::Result<()> {
        let bookmarks = Bookmarks::default();
        assert_eq!(bookmarks.count(), 2);

        let root = bookmarks
            .find_node_by_index(1)
            .ok_or(CoreError::NodeNotFound(1))?;
        let root_data = root.get();
        assert_eq!(root_data.title, "All Bookmarks");
        assert_eq!(root_data.node_type, NodeType::Root);
        assert_eq!(root_data.url, None);
        assert_eq!(root_data.host, None);
        assert!(root_data.is_open);

        let toolbar = bookmarks
            .find_node_by_index(2)
            .ok_or(CoreError::NodeNotFound(2))?;
        let toolbar_data = toolbar.get();
        assert_eq!(toolbar_data.title, "Toolbar");
        assert_eq!(toolbar_data.node_type, NodeType::Folder);
        assert_eq!(toolbar_data.url, None);
        assert_eq!(toolbar_data.host, None);
        assert!(toolbar_data.is_open);

        Ok(())
    }
}
