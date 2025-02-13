use std::{fs::File, io::BufReader, num::NonZeroUsize, path::Path};

use indextree::{macros::tree, Arena, Node, NodeId};

use crate::{data::BookmarkData, error::CoreError, serialize::NestedNode};

pub struct BookmarkArena {
    pub arena: Arena<BookmarkData>,
}

impl Default for BookmarkArena {
    fn default() -> Self {
        let mut arena: Arena<BookmarkData> = Arena::new();
        let root = BookmarkData::new_root();
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
        let node_id = self.get_node_id_at(index).ok_or(CoreError::Other())?;
        let value = NestedNode::try_new(&self.arena, node_id)?;
        Ok(serde_json::to_string(&value)?)
    }

    pub fn add_bookmark(&mut self, url: String, title: Option<String>) -> Result<(), CoreError> {
        // if title is None, use url as title
        let title = title.unwrap_or(url.clone());
        let bookmark = BookmarkData::try_new_bookmark(&title, &url)?;
        // TODO: for now, just add to root
        let root_id = self.get_node_id_at(1).ok_or(CoreError::Other())?;
        let node = self.arena.new_node(bookmark);
        root_id.checked_append(node, &mut self.arena)?;
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

    #[test]
    fn test_create_realistic_arena() -> anyhow::Result<()> {
        let arena = create_realistic_arena();
        let bookmark_arena = BookmarkArena::new(arena.clone());

        let path = get_outs_path().join("bookmarks.json");
        let mut file = fs::File::create(path)?;
        let json = bookmark_arena.to_json()?;
        file.write_all(json.as_bytes())?;

        let path = get_outs_path().join("nested_bookmarks.json");
        let mut file = fs::File::create(path)?;
        let json = bookmark_arena.to_nested_json(1)?;
        file.write_all(json.as_bytes())?;

        assert_eq!(arena.count(), 16);

        Ok(())
    }
}
