pub mod io;
pub mod json;
pub mod manipulation;
pub mod tree;

use indextree::{macros::tree, Arena};

use crate::data::BookmarkData;

pub struct Bookmarks {
    arena: Arena<BookmarkData>,
}

impl Default for Bookmarks {
    fn default() -> Self {
        let mut arena: Arena<BookmarkData> = Arena::new();
        let root = BookmarkData::new_root();
        let toolbar = BookmarkData::new_folder("Toolbar");
        tree!(
            &mut arena,
            root => {
                toolbar,
            }
        );
        Self { arena }
    }
}

impl Bookmarks {
    pub fn new(arena: Arena<BookmarkData>) -> Self {
        Self { arena }
    }
}

#[cfg(test)]
mod tests {
    use std::{fs, io::Write, num::NonZeroUsize, path::PathBuf, sync::OnceLock};

    use url::Url;

    use crate::error::CoreError;

    use super::*;
    static OUTS_PATH: OnceLock<PathBuf> = OnceLock::new();

    fn get_outs_path() -> &'static PathBuf {
        OUTS_PATH.get_or_init(|| {
            let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
                .expect("CARGO_MANIFEST_DIR environment variable is not set");
            let path = PathBuf::from(manifest_dir).join("outs");
            if !path.exists() {
                std::fs::create_dir_all(&path).expect("can't create outs directory");
            }
            path
        })
    }

    fn create_realistic_bookmarks() -> Bookmarks {
        let mut arena = Arena::new();
        let root = BookmarkData::new_root();
        let rust_folder = BookmarkData::new_folder("Rust");
        let frontend_folder = BookmarkData::new_folder("Frontend");
        tree!(&mut arena,
            root => {
                rust_folder => {
                    BookmarkData::try_new_bookmark("tauri - Rust", "https://docs.rs/tauri/latest/tauri/").unwrap() => {
                        BookmarkData::try_new_bookmark("App in tauri - Rust", "https://docs.rs/tauri/latest/tauri/struct.App.html").unwrap(),
                        BookmarkData::try_new_bookmark("Webview in tauri - Rust", "https://docs.rs/tauri/latest/tauri/webview/struct.Webview.html").unwrap(),
                        BookmarkData::try_new_bookmark("WebviewBuilder in tauri - Rust", "https://docs.rs/tauri/latest/tauri/webview/struct.WebviewBuilder.html").unwrap(),
                    },
                    BookmarkData::try_new_bookmark("Develop | Tauri", "https://v2.tauri.app/develop/").unwrap() => {
                        BookmarkData::try_new_bookmark("Calling the Frontend from Rust", "https://v2.tauri.app/develop/calling-frontend/").unwrap(),
                        BookmarkData::try_new_bookmark("Calling Rust from the Frontend", "https://v2.tauri.app/develop/calling-rust/").unwrap(),
                    },
                    BookmarkData::try_new_bookmark("indextree - Rust", "https://docs.rs/indextree/latest/indextree/").unwrap() => {
                        BookmarkData::try_new_bookmark("Arena", "https://docs.rs/indextree/latest/indextree/struct.Arena.html").unwrap(),
                        BookmarkData::try_new_bookmark("NodeId", "https://docs.rs/indextree/latest/indextree/struct.NodeId.html").unwrap(),
                    },
                },
                frontend_folder => {
                    BookmarkData::try_new_bookmark("Introduction - Zustand", "https://zustand.docs.pmnd.rs/").unwrap(),
                    BookmarkData::try_new_bookmark("solidui", "https://www.solid-ui.com/docs/introduction").unwrap(),
                    BookmarkData::try_new_bookmark("unplugin/unplugin-icons: 🤹 Access thousands of icons as components on-demand universally", "https://github.com/unplugin/unplugin-icons").unwrap(),
                },
            }
        );
        Bookmarks::new(arena)
    }

    fn create_test_bookmarks() -> Bookmarks {
        let mut arena = Arena::new();
        let root = BookmarkData::new_root();
        let n_2 = BookmarkData::try_new_bookmark("n_2", "https://docs.rs/abc").unwrap();
        let n_3 = BookmarkData::try_new_bookmark("n_3", "https://docs.rs/abc").unwrap();
        let n_4 = BookmarkData::try_new_bookmark("n_4", "https://docs.rs/abc").unwrap();
        let n_5 = BookmarkData::try_new_bookmark("n_5", "https://docs.rs/abc").unwrap();
        let n_6 = BookmarkData::try_new_bookmark("n_6", "https://docs.rs/abc").unwrap();
        let n_7 = BookmarkData::try_new_bookmark("n_7", "https://docs.rs/abc").unwrap();
        let n_8 = BookmarkData::try_new_bookmark("n_8", "https://docs.rs/abc").unwrap();
        tree!(&mut arena,
            root => {
                n_2,
                n_3,
                n_4 => {
                    n_5,
                    n_6 => {
                        n_7,
                        n_8,
                    }
                }
            }
        );
        Bookmarks::new(arena)
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
        for (i, node_id) in root.descendants(&bookmarks.arena).enumerate() {
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
            CoreError::NodeNotFound(100).to_string()
        );

        // try to move from non-exist node must be error
        let err = bookmarks.append_to_child(2, 100);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeNotFound(100).to_string()
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
        for (i, node_id) in root.descendants(&bookmarks.arena).enumerate() {
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
            CoreError::NodeNotFound(100).to_string()
        );

        // try to move from non-exist node must be error
        let err = bookmarks.insert_after(2, 100);
        assert!(err.is_err());
        assert_eq!(
            err.unwrap_err().to_string(),
            CoreError::NodeNotFound(100).to_string()
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
        for (i, node_id) in root.descendants(&bookmarks.arena).enumerate() {
            let id: usize = node_id.into();
            assert_eq!(id, vec[i]);
        }

        // println!("{}", bookmarks.to_nested_json_pretty(1)?);

        Ok(())
    }

    #[test]
    fn test_arena() {
        let mut arena = Arena::new();
        tree!(&mut arena,
            "1" => {
                "2",
                "3",
                "4" => {
                    "5",
                    "6",
                }
            }
        );
        assert_eq!(arena.count(), 6);
        let n_1 = arena.get_node_id_at(NonZeroUsize::new(1).unwrap()).unwrap();
        let n_2 = arena.get_node_id_at(NonZeroUsize::new(2).unwrap()).unwrap();
        println!("{:?}", n_1.debug_pretty_print(&arena));
        let n_4 = arena.get_node_id_at(NonZeroUsize::new(4).unwrap()).unwrap();
        // append n_4 to n_2
        match n_2.checked_append(n_4, &mut arena) {
            Ok(_) => {
                println!("{:?}", n_1.debug_pretty_print(&arena));
            }
            Err(e) => {
                println!("{:?}", e);
            }
        }
    }

    #[test]
    fn test_create_realistic_arena() -> anyhow::Result<()> {
        let bookmarks = create_realistic_bookmarks();

        let path = get_outs_path().join("bookmarks.json");
        let mut file = fs::File::create(path)?;
        let json = bookmarks.to_json()?;
        file.write_all(json.as_bytes())?;

        let path = get_outs_path().join("nested_bookmarks.json");
        let mut file = fs::File::create(path)?;
        let json = bookmarks.to_nested_json(1)?;
        file.write_all(json.as_bytes())?;

        assert_eq!(bookmarks.arena.count(), 16);

        Ok(())
    }

    #[test]
    fn test_remove_subtree() -> anyhow::Result<()> {
        // let arena = create_test_tree();
        let mut bookmarks = create_test_bookmarks();

        // remove wrong index must be error
        assert!(bookmarks.remove_subtree(100).is_err());
        assert_eq!(bookmarks.arena.count(), 8);

        // try to remove root node must be error
        assert!(bookmarks.remove_subtree(1).is_err());

        // remove n_2
        bookmarks.remove_subtree(2)?;
        let me = bookmarks.find_node_id_by_index(2);
        assert!(me.is_none());

        // remove n_4
        bookmarks.remove_subtree(3)?;
        bookmarks.remove_subtree(4)?;

        // internal arena count must be still 8
        assert_eq!(bookmarks.arena.count(), 8);

        println!("{}", bookmarks.to_nested_json_pretty(1)?);

        Ok(())
    }

    #[test]
    fn test_get_root_children() -> anyhow::Result<()> {
        let bookmarks = create_test_bookmarks();
        let root_children = bookmarks.get_root_children()?;
        assert_eq!(root_children.len(), 3);
        let n_2 = root_children.first().unwrap();
        assert_eq!(n_2.title, "n_2");
        let n_3 = root_children.get(1).unwrap();
        assert_eq!(n_3.title, "n_3");
        let n_4 = root_children.last().unwrap();
        assert_eq!(n_4.title, "n_4");
        println!("{}", serde_json::to_string_pretty(&root_children)?);
        Ok(())
    }

    #[test]
    fn test_get_root_and_children_folder() -> anyhow::Result<()> {
        let bookmarks = create_realistic_bookmarks();
        let folders = bookmarks.get_root_and_children_folders()?;
        assert_eq!(folders.len(), 3);
        let root = folders.first().unwrap();
        assert_eq!(root.title, "All Bookmarks");
        let rust = folders.get(1).unwrap();
        assert_eq!(rust.title, "Rust");
        let frontend = folders.last().unwrap();
        assert_eq!(frontend.title, "Frontend");
        Ok(())
    }

    #[test]
    fn test_add_bookmark() -> anyhow::Result<()> {
        let mut arena = Arena::new();
        let root = BookmarkData::new_root();
        tree!(&mut arena,
            root => {
                BookmarkData::try_new_bookmark("a", "https://docs.rs/abc").unwrap(),
            }
        );
        let mut bookmarks = Bookmarks::new(arena);

        bookmarks.add_bookmark(
            "https://docs.rs/abc/cdf".to_string(),
            Some("title".to_string()),
            1,
        )?;
        bookmarks.add_bookmark(
            "https://docs.rs/abc/cdf/efg".to_string(),
            Some("title".to_string()),
            1,
        )?;
        bookmarks.add_bookmark(
            "https://docs.rs/abc/cdf/aaaa".to_string(),
            Some("title".to_string()),
            1,
        )?;
        bookmarks.add_bookmark("https://docs.rs/".to_string(), Some("title".to_string()), 1)?;

        println!("{}", bookmarks.to_nested_json_pretty(1)?);

        Ok(())
    }

    #[test]
    fn test_update_title() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        bookmarks.update_title(1, "new root name".to_string())?;
        bookmarks.update_title(2, "new title".to_string())?;
        let node = bookmarks.find_node_by_index(1).unwrap();
        assert_eq!(node.get().title, "new root name");
        let node = bookmarks.find_node_by_index(2).unwrap();
        assert_eq!(node.get().title, "new title");
        // println!("{}", bookmarks.to_nested_json_pretty(1)?);
        // println!("{:?}", bookmarks.get_root_and_children_folders()?);
        Ok(())
    }

    #[test]
    fn test_toggle_is_open() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        let node = bookmarks.find_node_by_index(1).unwrap();
        assert!(node.get().is_open);

        bookmarks.toggle_is_open(1)?;
        let node = bookmarks.find_node_by_index(1).unwrap();
        assert!(!node.get().is_open);

        bookmarks.toggle_is_open(1)?;
        let node = bookmarks.find_node_by_index(1).unwrap();
        assert!(node.get().is_open);

        Ok(())
    }

    #[test]
    fn test_set_is_open() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        let node = bookmarks.find_node_by_index(1).unwrap();
        assert!(node.get().is_open);

        bookmarks.set_is_open(1, false)?;
        let node = bookmarks.find_node_by_index(1).unwrap();
        assert!(!node.get().is_open);

        bookmarks.set_is_open(1, true)?;
        let node = bookmarks.find_node_by_index(1).unwrap();
        assert!(node.get().is_open);

        Ok(())
    }

    #[test]
    fn test_add_folder() -> anyhow::Result<()> {
        let mut bookmarks = create_test_bookmarks();
        // add folder to root
        bookmarks.add_folder(1, "new folder 1")?;
        let root_id = bookmarks.find_node_id_by_index(1).unwrap();
        assert_eq!(root_id.children(&bookmarks.arena).count(), 4);

        // add folder to n_2
        let n_2_id = bookmarks.find_node_id_by_index(2).unwrap();
        assert_eq!(n_2_id.children(&bookmarks.arena).count(), 0);
        bookmarks.add_folder(2, "new folder 2")?;
        assert_eq!(n_2_id.children(&bookmarks.arena).count(), 1);

        // add folder to n_6
        let n_6_id = bookmarks.find_node_id_by_index(6).unwrap();
        assert_eq!(n_6_id.children(&bookmarks.arena).count(), 2);
        bookmarks.add_folder(6, "new folder 3")?;
        assert_eq!(n_6_id.children(&bookmarks.arena).count(), 3);

        // add folder to non-exist node must be error
        assert!(bookmarks.add_folder(100, "new folder 4").is_err());

        // println!("{}", bookmarks.to_nested_json_pretty(1)?);
        // println!("{:?}", root_id.debug_pretty_print(&bookmarks.arena));
        Ok(())
    }

    #[test]
    fn test_url() -> anyhow::Result<()> {
        let url = Url::parse("https://docs.rs/tauri/latest/tauri/webview/struct.Color.html")?;
        let mut url = url;
        url.path_segments_mut()
            .map_err(|_| CoreError::CannotBeBase())?
            .pop_if_empty()
            .pop();
        println!("{}", url.as_str());
        Ok(())
    }
}
