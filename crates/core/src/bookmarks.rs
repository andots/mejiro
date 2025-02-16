use std::{fs::File, io::BufReader, num::NonZeroUsize, path::Path};

use indextree::{macros::tree, Arena, Node, NodeId};
use url::Url;

use crate::{
    data::{BookmarkData, FolderData, NodeType},
    error::CoreError,
    serialize::NestedNode,
};

pub struct Bookmarks {
    pub arena: Arena<BookmarkData>,
}

impl Default for Bookmarks {
    fn default() -> Self {
        let mut arena: Arena<BookmarkData> = Arena::new();
        let root = BookmarkData::new_root();
        let group1 = BookmarkData::new_folder("Group 1");
        let group2 = BookmarkData::new_folder("Group 2");
        let group3 = BookmarkData::new_folder("Group 3");
        tree!(
            &mut arena,
            root => {
                group1,
                group2,
                group3,
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

/// File I/O
impl Bookmarks {
    pub fn load_from_file<P>(path: P) -> Result<Self, CoreError>
    where
        P: AsRef<Path>,
    {
        let file = File::open(path)?;
        let reader = BufReader::new(file);
        let arena: Arena<BookmarkData> = serde_json::from_reader(reader)?;
        Ok(Self::new(arena))
    }

    pub fn save_to_file<P>(&self, path: P) -> Result<(), CoreError>
    where
        P: AsRef<Path>,
    {
        let file = File::create(path)?;
        serde_json::to_writer(file, &self.arena)?;
        Ok(())
    }
}

/// Wrapper for indextree::Arena
impl Bookmarks {
    fn find_node_id_by_index(&self, index: usize) -> Option<NodeId> {
        match NonZeroUsize::new(index) {
            Some(index) => self.arena.get_node_id_at(index),
            None => None,
        }
    }

    #[allow(dead_code)]
    fn find_node_by_index(&self, index: usize) -> Option<&Node<BookmarkData>> {
        match self.find_node_id_by_index(index) {
            Some(node_id) => self.arena.get(node_id),
            None => None,
        }
    }

    fn find_node_by_node_id(&self, node_id: NodeId) -> Option<&Node<BookmarkData>> {
        self.arena.get(node_id)
    }
}

/// Root node stuff
impl Bookmarks {
    fn get_root_node_id(&self) -> Result<NodeId, CoreError> {
        self.find_node_id_by_index(1)
            .ok_or(CoreError::NodeNotFound(1))
    }

    pub fn get_root_children(&self) -> Result<Vec<BookmarkData>, CoreError> {
        let root_id = self.get_root_node_id()?;
        let root_children = root_id
            .children(&self.arena)
            .filter_map(|node_id| self.find_node_by_node_id(node_id))
            .map(|n| n.get().clone())
            .collect::<Vec<_>>();
        Ok(root_children)
    }

    pub fn get_root_children_folder(&self) -> Result<Vec<FolderData>, CoreError> {
        let root_id = self.get_root_node_id()?;
        let mut vec: Vec<FolderData> = Vec::new();
        // push root folder at first
        vec.push(FolderData {
            index: root_id.into(),
            title: "All Bookmarks".to_string(),
        });
        for node_id in root_id.children(&self.arena) {
            if let Some(node) = self.find_node_by_node_id(node_id) {
                let data = node.get();
                // only push if the node is folder
                if data.node_type == NodeType::Folder {
                    vec.push(FolderData {
                        index: node_id.into(),
                        title: data.title.clone(),
                    });
                }
            }
        }
        Ok(vec)
    }
}

/// Converting to JSON
impl Bookmarks {
    /// Arena to JSON to save file
    pub fn to_json(&self) -> Result<String, CoreError> {
        Ok(serde_json::to_string(&self.arena)?)
    }

    /// Generate nested JSON for frontend
    pub fn to_nested_json(&self, index: usize) -> Result<String, CoreError> {
        let node_id = self
            .find_node_id_by_index(index)
            .ok_or(CoreError::NodeNotFound(index))?;
        let value = NestedNode::try_new(&self.arena, node_id)?;
        Ok(serde_json::to_string(&value)?)
    }

    pub fn to_nested_json_pretty(&self, index: usize) -> Result<String, CoreError> {
        let node_id = self
            .find_node_id_by_index(index)
            .ok_or(CoreError::NodeNotFound(index))?;
        let value = NestedNode::try_new(&self.arena, node_id)?;
        Ok(serde_json::to_string_pretty(&value)?)
    }
}

/// Tree manupulation
impl Bookmarks {
    pub fn remove_subtree(&mut self, index: usize) -> Result<(), CoreError> {
        if index == 1 {
            return Err(CoreError::CannotRemoveRoot());
        }
        let node_id = self
            .find_node_id_by_index(index)
            .ok_or(CoreError::NodeNotFound(index))?;
        node_id.remove_subtree(&mut self.arena);
        Ok(())
    }

    pub fn add_bookmark(
        &mut self,
        url: String,
        title: Option<String>,
        starting_index: usize,
    ) -> Result<(), CoreError> {
        // if title is None, use url as title
        let title = title.unwrap_or(url.clone());
        // 与えられたURLの一つ上の階層のURLを取得
        let parsed_url = Url::parse(&url)?;
        let mut base_url = parsed_url.clone();
        base_url
            .path_segments_mut()
            .map_err(|_| CoreError::CannotBeBase())?
            .pop_if_empty()
            .pop();
        let base_url_str = base_url.as_str();

        let start_node_id = self
            .find_node_id_by_index(starting_index)
            .ok_or(CoreError::NodeNotFound(1))?;
        let target = start_node_id.descendants(&self.arena).find(|node_id| {
            if let Some(node) = self.find_node_by_node_id(*node_id) {
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
            // if not found target, append new node to the starting node
            let new_node = self.arena.new_node(bookmark);
            start_node_id.checked_append(new_node, &mut self.arena)?;
        }

        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use std::{fs, io::Write, path::PathBuf, sync::OnceLock};

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

    fn create_realistic_arena() -> Arena<BookmarkData> {
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
        arena
    }

    fn create_test_bookmarks() -> Bookmarks {
        let mut arena = Arena::new();
        let root = BookmarkData::new_root();
        let n_2 = BookmarkData::try_new_bookmark("n_2", "https://docs.rs/abc").unwrap();
        let n_3 = BookmarkData::try_new_bookmark("n_3", "https://docs.rs/abc").unwrap();
        let n_4 = BookmarkData::try_new_bookmark("n_4", "https://docs.rs/abc").unwrap();
        let n_5 = BookmarkData::try_new_bookmark("n_5", "https://docs.rs/abc").unwrap();
        let n_6 = BookmarkData::try_new_bookmark("n_6", "https://docs.rs/abc").unwrap();
        tree!(&mut arena,
            root => {
                n_2,
                n_3,
                n_4 => {
                    n_5,
                    n_6,
                }
            }
        );
        Bookmarks::new(arena)
    }

    #[test]
    fn test_create_realistic_arena() -> anyhow::Result<()> {
        let arena = create_realistic_arena();
        let bookmarks = Bookmarks::new(arena.clone());

        let path = get_outs_path().join("bookmarks.json");
        let mut file = fs::File::create(path)?;
        let json = bookmarks.to_json()?;
        file.write_all(json.as_bytes())?;

        let path = get_outs_path().join("nested_bookmarks.json");
        let mut file = fs::File::create(path)?;
        let json = bookmarks.to_nested_json(1)?;
        file.write_all(json.as_bytes())?;

        assert_eq!(arena.count(), 16);

        Ok(())
    }

    #[test]
    fn test_remove_subtree() -> anyhow::Result<()> {
        // let arena = create_test_tree();
        let mut bookmarks = create_test_bookmarks();

        // remove wrong index must be error
        assert!(bookmarks.remove_subtree(100).is_err());
        assert_eq!(bookmarks.arena.count(), 6);

        // try to remove root node must be error
        assert!(bookmarks.remove_subtree(1).is_err());

        // remove n_2
        bookmarks.remove_subtree(2)?;
        let me = bookmarks.find_node_id_by_index(2);
        assert!(me.is_none());

        // remove n_4
        bookmarks.remove_subtree(3)?;
        bookmarks.remove_subtree(4)?;

        // internal arena count must be still 6
        assert_eq!(bookmarks.arena.count(), 6);

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
