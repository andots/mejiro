mod common;

#[cfg(test)]
mod tests {
    use indextree::{macros::tree, Arena};
    use parus_bookmark::{
        bookmarks::Bookmarks,
        data::{BookmarkData, NodeType},
        error::CoreError,
    };

    use crate::common::{
        create_realistic_bookmarks, create_simple_bookmarks, create_test_bookmarks,
    };

    #[test]
    fn test_default() -> anyhow::Result<()> {
        let bookmarks = Bookmarks::default();
        assert_eq!(bookmarks.count_all_nodes(), 2);
        assert_eq!(bookmarks.count_bookmarks(), 0);

        let root = bookmarks.find_node_by_index(1)?;
        let root_data = root.get();
        assert_eq!(root_data.title, "All Bookmarks");
        assert_eq!(root_data.node_type, NodeType::Root);
        assert_eq!(root_data.url, None);
        assert_eq!(root_data.host, None);
        assert!(root_data.is_open);

        let toolbar = bookmarks.find_node_by_index(2)?;
        let toolbar_data = toolbar.get();
        assert_eq!(toolbar_data.title, "Toolbar");
        assert_eq!(toolbar_data.node_type, NodeType::Folder);
        assert_eq!(toolbar_data.url, None);
        assert_eq!(toolbar_data.host, None);
        assert!(toolbar_data.is_open);

        Ok(())
    }

    #[test]
    fn test_append_to_child() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        bookmarks.append_to_child(4, 2)?;
        // tree is like
        // root
        //  |- n_2
        //  |    |- n_4
        //  |       |- n_5
        //  |       |- n_6
        //  |           |- n_7
        //  |           |- n_8
        //  |- n_3
        let root = bookmarks.get_root_node_id()?;
        let vec: Vec<usize> = vec![1, 2, 4, 5, 6, 7, 8, 3];
        for (i, node_id) in root.descendants(bookmarks.arena()).enumerate() {
            let id: usize = node_id.into();
            assert_eq!(id, vec[i]);
        }

        // try to move root node must be error
        let err = bookmarks.append_to_child(1, 2);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::CannotMoveRoot().to_string()
        );

        // try to move to non-exist node must be error
        let err = bookmarks.append_to_child(100, 2);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeIdNotFound(100).to_string()
        );

        // try to move from non-exist node must be error
        let err = bookmarks.append_to_child(2, 100);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeIdNotFound(100).to_string()
        );

        // try to move to same node must be error
        let err = bookmarks.append_to_child(2, 2);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::SameSourceAndDestination().to_string()
        );

        Ok(())
    }

    #[test]
    fn test_append_to_child_to_descendant() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        let result = bookmarks.append_to_child(6, 7);
        assert_eq!(
            result.unwrap_err().to_string(),
            "Cannot move to descendant".to_string()
        );
        Ok(())
    }

    #[test]
    fn test_insert_after() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        bookmarks.insert_after(4, 2)?;
        let root = bookmarks.get_root_node_id()?;
        let vec: Vec<usize> = vec![1, 2, 4, 5, 6, 7, 8, 3];
        // tree is like
        // root
        //  |- n_2
        //  |- n_4
        //  |   |- n_5
        //  |   |- n_6
        //  |       |- n_7
        //  |       |- n_8
        //  |- n_3
        for (i, node_id) in root.descendants(bookmarks.arena()).enumerate() {
            let id: usize = node_id.into();
            assert_eq!(id, vec[i]);
        }

        // try to move root node must be error
        let err = bookmarks.insert_after(1, 2);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::CannotMoveRoot().to_string()
        );

        // try to move to non-exist node must be error
        let err = bookmarks.insert_after(100, 2);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeIdNotFound(100).to_string()
        );

        // try to move from non-exist node must be error
        let err = bookmarks.insert_after(2, 100);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeIdNotFound(100).to_string()
        );

        // try to insert same node must be error
        let err = bookmarks.insert_after(4, 4);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::SameSourceAndDestination().to_string()
        );

        Ok(())
    }

    #[test]
    fn test_insert_after_to_root() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        bookmarks.insert_after(6, 1)?;
        let root = bookmarks.get_root_node_id()?;
        let vec: Vec<usize> = vec![1, 6, 7, 8, 2, 3, 4, 5];
        // tree is like
        // root
        //  |- n_6
        //  |   |- n_7
        //  |   |- n_8
        //  |- n_2
        //  |- n_3
        //  |- n_4
        //  |   |- n_5
        for (i, node_id) in root.descendants(bookmarks.arena()).enumerate() {
            let id: usize = node_id.into();
            assert_eq!(id, vec[i]);
        }

        Ok(())
    }

    #[test]
    fn test_insert_after_to_descendant() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();

        let result = bookmarks.insert_after(6, 7);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err().to_string(),
            "Cannot move to descendant".to_string()
        );
        Ok(())
    }

    #[test]
    fn test_insert_before() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        bookmarks.insert_before(4, 2)?;

        let root = bookmarks.get_root_node_id()?;
        let vec: Vec<usize> = vec![1, 4, 5, 6, 7, 8, 2, 3];
        for (i, node_id) in root.descendants(bookmarks.arena()).enumerate() {
            let id: usize = node_id.into();
            assert_eq!(id, vec[i]);
        }

        // try to move root node must be error
        let err = bookmarks.insert_before(1, 2);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::CannotMoveRoot().to_string()
        );

        // try to move to non-exist node must be error
        let err = bookmarks.insert_before(100, 2);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeIdNotFound(100).to_string()
        );

        // try to move from non-exist node must be error
        let err = bookmarks.insert_before(2, 100);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeIdNotFound(100).to_string()
        );

        // try to insert same node must be error
        let err = bookmarks.insert_before(4, 4);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::SameSourceAndDestination().to_string()
        );

        Ok(())
    }

    #[test]
    fn test_insert_before_to_descendant_must_be_err() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        let result = bookmarks.insert_before(6, 7);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err().to_string(),
            "Cannot move to descendant".to_string()
        );
        Ok(())
    }

    #[test]
    fn test_prepend_to_child() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        bookmarks.prepend_to_child(6, 4)?;
        let root = bookmarks.get_root_node_id()?;
        let vec: Vec<usize> = vec![1, 2, 3, 4, 6, 7, 8, 5];
        for (i, node_id) in root.descendants(bookmarks.arena()).enumerate() {
            let id: usize = node_id.into();
            assert_eq!(id, vec[i]);
        }
        Ok(())
    }

    #[test]
    fn test_prepend_to_self_parent() -> anyhow::Result<()> {
        let mut bookmarks = create_simple_bookmarks();
        let result = bookmarks.prepend_to_child(2, 1);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err().to_string(),
            "Cannot prepend as a first child".to_string()
        );
        Ok(())
    }

    #[test]
    fn test_prepend_to_child_to_descendant() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        let result = bookmarks.prepend_to_child(6, 7);
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err().to_string(),
            "Cannot move to descendant".to_string()
        );
        Ok(())
    }

    #[test]
    fn test_remove_subtree() -> anyhow::Result<()> {
        // let arena = create_test_tree();
        let mut bookmarks = create_test_bookmarks();

        // remove wrong index must be error
        assert!(bookmarks.remove_subtree(100).is_err());
        assert_eq!(bookmarks.count_all_nodes(), 8);

        // try to remove root node must be error
        assert!(bookmarks.remove_subtree(1).is_err());

        // remove n_2, then find n_2 must be error
        bookmarks.remove_subtree(2)?;
        let me = bookmarks.find_node_id_by_index(2);
        assert!(me.is_err());

        // remove n_3, n_4
        bookmarks.remove_subtree(3)?;
        bookmarks.remove_subtree(4)?;

        // internal arena count must be still 8
        assert_eq!(bookmarks.count_all_nodes(), 8);

        // bookmarks count must be 0
        assert_eq!(bookmarks.count_bookmarks(), 0);

        println!("{}", bookmarks.to_nested_json_pretty(1)?);

        Ok(())
    }

    #[test]
    fn test_add_bookmark_without_toolbar() -> anyhow::Result<()> {
        let mut arena = Arena::new();
        let root = BookmarkData::new_root();
        tree!(&mut arena,
            root => {
                BookmarkData::try_new_bookmark("abc", "https://docs.rs/abc").unwrap(),
            }
        );
        let mut bookmarks = Bookmarks::new(arena);

        let top_level_index = 1;
        bookmarks.add_bookmark("abc/cdf", "https://docs.rs/abc/cdf", top_level_index)?;
        bookmarks.add_bookmark(
            "abc/cdf/efg",
            "https://docs.rs/abc/cdf/efg",
            top_level_index,
        )?;
        bookmarks.add_bookmark(
            "abc/cdf/aaaa",
            "https://docs.rs/abc/cdf/aaaa",
            top_level_index,
        )?;
        bookmarks.add_bookmark(
            "abc/cdf/bbb#hash",
            "https://docs.rs/abc/cdf/bbbb#hash",
            top_level_index,
        )?;

        println!("{}", bookmarks.to_nested_json_pretty(1)?);

        Ok(())
    }

    #[test]
    fn test_add_bookmark_with_toolbar() -> anyhow::Result<()> {
        let mut bookmarks = Bookmarks::default();
        bookmarks.append_bookmark_to_toolbar("tauri", "https://docs.rs/tauri/latest/tauri/")?;

        let top_level_index = 1;
        bookmarks.add_bookmark(
            "webview",
            "https://docs.rs/tauri/latest/tauri/webview/index.html",
            top_level_index,
        )?;
        bookmarks.add_bookmark(
            "WebviewBuilder",
            "https://docs.rs/tauri/latest/tauri/webview/struct.WebviewBuilder.html",
            top_level_index,
        )?;
        bookmarks.add_bookmark(
            "Color",
            "https://docs.rs/tauri/latest/tauri/webview/struct.Color.html",
            top_level_index,
        )?;
        bookmarks.add_bookmark(
            "Monitor",
            "https://docs.rs/tauri/latest/tauri/window/struct.Monitor.html",
            top_level_index,
        )?;

        println!("{}", bookmarks.to_nested_json_pretty(1)?);

        Ok(())
    }

    #[test]
    fn test_update_title() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        bookmarks.update_title(1, "new root name".to_string())?;
        bookmarks.update_title(2, "new title".to_string())?;
        let node = bookmarks.find_node_by_index(1)?;
        assert_eq!(node.get().title, "new root name");
        let node = bookmarks.find_node_by_index(2)?;
        assert_eq!(node.get().title, "new title");
        // println!("{}", bookmarks.to_nested_json_pretty(1)?);
        // println!("{:?}", bookmarks.get_root_and_children_folders()?);
        Ok(())
    }

    #[test]
    fn test_toggle_is_open() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        let node = bookmarks.find_node_by_index(1)?;
        assert!(node.get().is_open);

        bookmarks.toggle_is_open(1)?;
        let node = bookmarks.find_node_by_index(1)?;
        assert!(!node.get().is_open);

        bookmarks.toggle_is_open(1)?;
        let node = bookmarks.find_node_by_index(1)?;
        assert!(node.get().is_open);

        Ok(())
    }

    #[test]
    fn test_set_is_open() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        let node = bookmarks.find_node_by_index(1)?;
        assert!(node.get().is_open);

        bookmarks.set_is_open(1, false)?;
        let node = bookmarks.find_node_by_index(1)?;
        assert!(!node.get().is_open);

        bookmarks.set_is_open(1, true)?;
        let node = bookmarks.find_node_by_index(1)?;
        assert!(node.get().is_open);

        Ok(())
    }

    #[test]
    fn test_add_folder() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        // add folder to root
        bookmarks.add_folder(1, "new folder 1")?;
        let root_id = bookmarks.find_node_id_by_index(1)?;
        assert_eq!(root_id.children(bookmarks.arena()).count(), 4);

        // add folder to n_2
        let n_2_id = bookmarks.find_node_id_by_index(2)?;
        assert_eq!(n_2_id.children(bookmarks.arena()).count(), 0);
        bookmarks.add_folder(2, "new folder 2")?;
        assert_eq!(n_2_id.children(bookmarks.arena()).count(), 1);

        // add folder to n_6
        let n_6_id = bookmarks.find_node_id_by_index(6)?;
        assert_eq!(n_6_id.children(bookmarks.arena()).count(), 2);
        bookmarks.add_folder(6, "new folder 3")?;
        assert_eq!(n_6_id.children(bookmarks.arena()).count(), 3);

        // add folder to non-exist node must be error
        assert!(bookmarks.add_folder(100, "new folder 4").is_err());

        // println!("{}", bookmarks.to_nested_json_pretty(1)?);
        // println!("{:?}", root_id.debug_pretty_print(&bookmarks.arena));
        Ok(())
    }

    #[test]
    fn test_get_root_and_children_folder() -> anyhow::Result<()> {
        let bookmarks = Bookmarks::default();
        let folders = bookmarks.get_root_and_children_folders()?;
        assert_eq!(folders.len(), 2);
        let root = folders.first().unwrap();
        assert_eq!(root.title, "All Bookmarks");
        let toolbar = folders.last().unwrap();
        assert_eq!(toolbar.title, "Toolbar");
        Ok(())
    }

    #[test]
    fn test_get_toolbar_bookmarks() -> anyhow::Result<()> {
        let mut bookmarks = create_realistic_bookmarks();
        let toolbar_bookmarks = bookmarks.get_toolbar_bookmarks();
        assert_eq!(toolbar_bookmarks.len(), 4);
        let google = toolbar_bookmarks.first().unwrap();
        assert_eq!(google.title, "Google");
        let github = toolbar_bookmarks.get(1).unwrap();
        assert_eq!(github.title, "GitHub");
        let youtube = toolbar_bookmarks.get(2).unwrap();
        assert_eq!(youtube.title, "YouTube");
        let github_search = toolbar_bookmarks.last().unwrap();
        assert_eq!(github_search.title, "Github Search");

        // remove item
        bookmarks.remove_subtree(3)?;
        let toolbar_bookmarks = bookmarks.get_toolbar_bookmarks();
        assert_eq!(toolbar_bookmarks.len(), 3);

        // remove toolbar folder
        bookmarks.remove_subtree(2)?;
        let toolbar_bookmarks = bookmarks.get_toolbar_bookmarks();
        assert_eq!(toolbar_bookmarks.len(), 0);

        println!("{:?}", toolbar_bookmarks);
        Ok(())
    }

    #[test]
    fn test_append_bookmark_to_toolbar() -> anyhow::Result<()> {
        let mut bookmarks = Bookmarks::default();
        let toolbar = bookmarks.get_toolbar_node_id().unwrap();

        // there is Toolbar folder in default
        bookmarks.append_bookmark_to_toolbar("title", "https://docs.rs")?;
        assert_eq!(bookmarks.count_bookmarks(), 1);
        assert_eq!(toolbar.children(bookmarks.arena()).count(), 1);

        bookmarks.append_bookmark_to_toolbar("title2", "https://docs.rs")?;
        assert_eq!(bookmarks.count_bookmarks(), 2);
        assert_eq!(toolbar.children(bookmarks.arena()).count(), 2);

        // remove toolbar folder, index is 2 (root is 1)
        bookmarks.remove_subtree(2)?;

        // then add bookmark to toolbar must be error
        let result = bookmarks.append_bookmark_to_toolbar("title3", "https://docs.rs");
        assert!(result.is_err());
        assert_eq!(
            result.unwrap_err().to_string(),
            "Toolbar Folder Not Found".to_string()
        );

        Ok(())
    }
}
