#![allow(dead_code)]

use std::{path::PathBuf, sync::OnceLock};

use indextree::{macros::tree, Arena};
use mejiro_core::{bookmarks::Bookmarks, data::BookmarkData};

static OUTS_PATH: OnceLock<PathBuf> = OnceLock::new();

pub fn get_outs_path() -> &'static PathBuf {
    OUTS_PATH.get_or_init(|| {
        let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
            .expect("CARGO_MANIFEST_DIR environment variable is not set");
        let path = PathBuf::from(manifest_dir).join("tests").join("outs");
        if !path.exists() {
            std::fs::create_dir_all(&path).expect("can't create outs directory");
        }
        path
    })
}

pub fn create_simple_bookmarks() -> Bookmarks {
    let mut arena = Arena::new();
    let n_1 = BookmarkData::new_root();
    let n_2 = BookmarkData::try_new_bookmark("n_2", "https://docs.rs/abc").unwrap();
    tree!(&mut arena,
        n_1 => {
            n_2,
        }
    );
    Bookmarks::new(arena)
}

pub fn create_test_bookmarks() -> Bookmarks {
    let mut arena = Arena::new();
    let n_1 = BookmarkData::new_root();
    let n_2 = BookmarkData::try_new_bookmark("n_2", "https://docs.rs/abc").unwrap();
    let n_3 = BookmarkData::try_new_bookmark("n_3", "https://docs.rs/abc").unwrap();
    let n_4 = BookmarkData::try_new_bookmark("n_4", "https://docs.rs/abc").unwrap();
    let n_5 = BookmarkData::try_new_bookmark("n_5", "https://docs.rs/abc").unwrap();
    let n_6 = BookmarkData::try_new_bookmark("n_6", "https://docs.rs/abc").unwrap();
    let n_7 = BookmarkData::try_new_bookmark("n_7", "https://docs.rs/abc").unwrap();
    let n_8 = BookmarkData::try_new_bookmark("n_8", "https://docs.rs/abc").unwrap();
    tree!(&mut arena,
        n_1 => {
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

pub fn create_realistic_bookmarks() -> Bookmarks {
    let mut arena = Arena::new();
    let root = BookmarkData::new_root();
    let tool_bar = BookmarkData::new_folder("Toolbar");
    let rust_folder = BookmarkData::new_folder("Rust");
    let frontend_folder = BookmarkData::new_folder("Frontend");
    tree!(&mut arena,
        root => {
            tool_bar => {
                BookmarkData::try_new_bookmark("Google", "https://www.google.com/").unwrap(),
                BookmarkData::try_new_bookmark("GitHub", "https://github.com/").unwrap(),
                BookmarkData::try_new_bookmark("YouTube", "https://www.youtube.com/").unwrap(),
                BookmarkData::try_new_bookmark("Github Search", "https://github.com/search").unwrap(),
                BookmarkData::new_folder("Inside Toolbar"),
            },
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
