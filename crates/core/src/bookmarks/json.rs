use crate::error::CoreError;

use super::Bookmarks;
use super::NestedBookmarks;

/// Converting to JSON
impl Bookmarks {
    /// Arena to JSON string
    pub fn to_json(&self) -> Result<String, CoreError> {
        Ok(serde_json::to_string(&self.arena)?)
    }

    /// Arena to NestedBookmarks
    pub fn to_nested(&self, index: usize) -> Result<NestedBookmarks, CoreError> {
        let node_id = self.find_node_id_by_index(index)?;
        NestedBookmarks::try_new(&self.arena, node_id)
    }

    /// Arena to nested JSON string (frontend friendly)
    pub fn to_nested_json(&self, index: usize) -> Result<String, CoreError> {
        let value = self.to_nested(index)?;
        Ok(serde_json::to_string(&value)?)
    }

    /// Arena to nested JSON string (frontend friendly) with pretty format
    pub fn to_nested_json_pretty(&self, index: usize) -> Result<String, CoreError> {
        let value = self.to_nested(index)?;
        Ok(serde_json::to_string_pretty(&value)?)
    }
}

#[cfg(test)]
mod tests {
    use crate::data::BookmarkData;

    use super::*;

    use indextree::{macros::tree, Arena};

    fn create_simple_bookmarks() -> Bookmarks {
        let mut arena = Arena::new();
        let n_1 = BookmarkData::new_root();
        let n_2 = BookmarkData::try_new_bookmark("n_2", "https://docs.rs/abc").unwrap();
        let n_3 = BookmarkData::try_new_bookmark("n_3", "https://docs.rs/xyz").unwrap();
        let n_4 = BookmarkData::try_new_bookmark("n_4", "https://docs.rs/123").unwrap();
        let n_5 = BookmarkData::try_new_bookmark("n_5", "https://docs.rs/456").unwrap();
        let n_6 = BookmarkData::try_new_bookmark("n_6", "https://docs.rs/789").unwrap();
        let n_7 = BookmarkData::try_new_bookmark("n_7", "https://docs.rs/000").unwrap();
        tree!(&mut arena,
            n_1 => {
                n_2,
                n_3 => {
                    n_4,
                },
                n_5 => {
                    n_6 => {
                        n_7,
                    },
                },
            }
        );
        Bookmarks::new(arena)
    }

    #[test]
    fn test_serialize() {
        let bookmarks = create_simple_bookmarks();
        let node_id = bookmarks.find_node_id_by_index(1).unwrap();
        let nested = NestedBookmarks::try_new(&bookmarks.arena, node_id).unwrap();
        let json = serde_json::to_string_pretty(&nested).unwrap();
        println!("{}", json);
    }

    #[test]
    fn test_to_nested() {
        let bookmarks = create_simple_bookmarks();

        let index = 1;
        let nested = bookmarks.to_nested(index).unwrap();
        let a = serde_json::to_string(&nested).unwrap();
        let b = bookmarks.to_nested_json(index).unwrap();
        assert_eq!(a, b);

        let index = 5;
        let nested = bookmarks.to_nested(index).unwrap();
        let a = serde_json::to_string(&nested).unwrap();
        let b = bookmarks.to_nested_json(index).unwrap();
        assert_eq!(a, b);
    }
}
