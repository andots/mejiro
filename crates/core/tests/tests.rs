pub mod test_helper {
    use std::path::PathBuf;
    use std::sync::OnceLock;

    use indextree::{macros::tree, Arena};
    use mejiro_core::{
        data::{BookmarkData, NodeType},
        error::CoreError,
        tree::BookmarkArena,
    };
    use std::{
        fs::File,
        io::{Read, Write},
        path::Path,
    };
    use url::Url;

    pub enum Format {
        Arena,
        ArenaPretty,
        Nested,
        NestedPretty,
    }

    /// Write json to file
    pub fn write_json_to_file<P>(
        path: P,
        arena: &Arena<BookmarkData>,
        format: Format,
    ) -> Result<(), CoreError>
    where
        P: AsRef<Path>,
    {
        // check the file path exists
        let path = path.as_ref();
        // if the parent directory does not exist, create all dir
        if let Some(parent) = path.parent() {
            if !parent.exists() {
                std::fs::create_dir_all(parent)?;
            }
        }
        // create file
        let mut file = File::create(path)?;
        let bookmark_arena = BookmarkArena::new(arena.clone());
        // get json string from arena depends on format
        let data = match format {
            Format::Arena => bookmark_arena.to_json()?,
            Format::Nested => bookmark_arena.to_nested_json()?,
            Format::ArenaPretty => bookmark_arena.to_json_pretty()?,
            Format::NestedPretty => bookmark_arena.to_nested_json_pretty()?,
        };
        file.write_all(data.as_bytes())?;
        Ok(())
    }

    /// Read file to String
    pub fn read_file_to_string<P>(path: P) -> Result<String, CoreError>
    where
        P: AsRef<Path>,
    {
        let mut file = File::open(path)?;
        let mut contents = String::new();
        file.read_to_string(&mut contents)?;
        Ok(contents)
    }

    static ASSETS_PATH: OnceLock<PathBuf> = OnceLock::new();
    static OUTS_PATH: OnceLock<PathBuf> = OnceLock::new();

    pub fn get_assets_path() -> &'static PathBuf {
        ASSETS_PATH.get_or_init(|| {
            let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
                .expect("CARGO_MANIFEST_DIR environment variable is not set");
            PathBuf::from(manifest_dir).join("tests").join("assets")
        })
    }

    pub fn get_outs_path() -> &'static PathBuf {
        OUTS_PATH.get_or_init(|| {
            let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
                .expect("CARGO_MANIFEST_DIR environment variable is not set");
            PathBuf::from(manifest_dir).join("tests").join("outs")
        })
    }

    pub fn create_bookmark_tree() -> Arena<BookmarkData> {
        let mut arena = Arena::new();
        let root_folder = BookmarkData::new("Root", None, NodeType::Folder);
        let folder_search = BookmarkData::new("Search", None, NodeType::Folder);
        let folder_dev = BookmarkData::new("Dev", None, NodeType::Folder);
        let folder_doc = BookmarkData::new("Doc", None, NodeType::Folder);
        let folder_fun = BookmarkData::new("Fun", None, NodeType::Folder);
        let folder_video = BookmarkData::new("Video", None, NodeType::Folder);
        let doc_rs = BookmarkData::new(
            "doc.rs",
            Some(Url::parse("https://docs.rs/").unwrap()),
            NodeType::Bookmark,
        );
        let crate_io = BookmarkData::new(
            "crates.io",
            Some(Url::parse("https://crates.io/").unwrap()),
            NodeType::Bookmark,
        );
        let librs = BookmarkData::new(
            "lib.rs",
            Some(Url::parse("https://lib.rs/").unwrap()),
            NodeType::Bookmark,
        );
        let npm = BookmarkData::new(
            "npm",
            Some(Url::parse("https://www.npmjs.com/").unwrap()),
            NodeType::Bookmark,
        );
        let github_search = BookmarkData::new(
            "Github Search",
            Some(Url::parse("https://github.com/search").unwrap()),
            NodeType::Bookmark,
        );
        let google = BookmarkData::new(
            "Google",
            Some(Url::parse("https://www.google.com/").unwrap()),
            NodeType::Bookmark,
        );
        let stackoverflow = BookmarkData::new(
            "Stack Overflow",
            Some(Url::parse("https://stackoverflow.com/").unwrap()),
            NodeType::Bookmark,
        );
        let youtube = BookmarkData::new(
            "YouTube",
            Some(Url::parse("https://www.youtube.com/").unwrap()),
            NodeType::Bookmark,
        );
        let reddit = BookmarkData::new(
            "Reddit",
            Some(Url::parse("https://www.reddit.com/").unwrap()),
            NodeType::Bookmark,
        );
        let tailwindcss = BookmarkData::new(
            "TailwindCSS",
            Some(Url::parse("https://tailwindcss.com/").unwrap()),
            NodeType::Bookmark,
        );
        let tauri_doc = BookmarkData::new(
            "Tauri Doc",
            Some(Url::parse("https://docs.rs/tauri/latest/tauri/").unwrap()),
            NodeType::Bookmark,
        );
        let solidui_doc = BookmarkData::new(
            "solid-ui",
            Some(Url::parse("https://www.solid-ui.com/docs/introduction").unwrap()),
            NodeType::Bookmark,
        );
        // create the tree
        tree!(
            &mut arena,
            root_folder => {
                folder_search => {
                    doc_rs,
                    crate_io,
                    librs,
                    npm,
                    github_search,
                    google,
                },
                folder_doc => {
                    tauri_doc,
                    solidui_doc,
                    tailwindcss,
                },
                folder_dev => {
                    stackoverflow,
                },
                folder_fun => {
                    reddit,
                    folder_video => {
                        youtube,
                    },
                },
            }
        );
        arena
    }
}

#[cfg(test)]
mod tests {
    use std::num::NonZeroUsize;

    use mejiro_core::tree::BookmarkArena;
    use url::Url;

    use crate::test_helper::*;

    #[test]
    fn test_outs_path() {
        let path = get_outs_path();
        assert!(path.try_exists().expect("Outs directory does not exist"));
        assert!(path.is_dir(), "Outs path is not a directory");
    }

    #[test]
    fn test_write_read_json_file() {
        let arena = create_bookmark_tree();
        let arena_path = get_outs_path().join("bookmarks.json");
        write_json_to_file(&arena_path, &arena, Format::Arena).unwrap();
        let path = get_outs_path().join("nested.json");
        write_json_to_file(&path, &arena, Format::Nested).unwrap();
        let path = get_outs_path().join("bookmarks_pretty.json");
        write_json_to_file(&path, &arena, Format::ArenaPretty).unwrap();
        let path = get_outs_path().join("nested_pretty.json");
        write_json_to_file(&path, &arena, Format::NestedPretty).unwrap();

        let arena_from_file = BookmarkArena::create_arena_from_file(&arena_path).unwrap();
        let arena = arena_from_file.arena;
        assert_eq!(arena.count(), 18);
        let node_id = arena.get_node_id_at(NonZeroUsize::new(8).unwrap()).unwrap();
        let node = arena.get(node_id).unwrap();
        let data = node.get();
        assert_eq!(
            data.url,
            Some(Url::parse("https://www.google.com/").unwrap())
        );
    }
}
