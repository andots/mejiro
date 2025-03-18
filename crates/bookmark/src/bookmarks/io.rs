use std::{fs::File, io::BufReader, path::Path};

use indextree::Arena;

use crate::{data::BookmarkData, error::CoreError};

use super::Bookmarks;

/// File I/O
impl Bookmarks {
    /// Load Arena from file (JSON format)
    pub fn load_from_file<P>(path: P) -> Result<Self, CoreError>
    where
        P: AsRef<Path>,
    {
        let file = File::open(path)?;
        let reader = BufReader::new(file);
        let arena: Arena<BookmarkData> = serde_json::from_reader(reader)?;
        Ok(Self::new(arena))
    }

    /// Save Arena to file (JSON format)
    pub fn save_to_file<P>(&self, path: P) -> Result<(), CoreError>
    where
        P: AsRef<Path>,
    {
        let file = File::create(path)?;
        serde_json::to_writer(file, &self.arena)?;
        Ok(())
    }
}
