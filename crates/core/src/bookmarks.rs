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
