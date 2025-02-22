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
    use std::num::NonZeroUsize;

    use url::Url;

    use crate::error::CoreError;

    use super::*;

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
