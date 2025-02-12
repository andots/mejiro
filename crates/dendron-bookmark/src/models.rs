use serde::{ser::SerializeStruct, Serialize};

use crate::id::Id;

#[derive(Debug, PartialEq, Clone)]
pub struct BookmarkData {
    /// Unique identifier (ULID)
    pub id: Id<NodeData>,
    /// title of the bookmark
    pub title: String,
    /// url of the bookmark
    pub url: String,
}

impl BookmarkData {
    pub fn new<S: Into<String>>(title: S, url: S) -> Self {
        Self {
            id: Id::generate(),
            title: title.into(),
            url: url.into(),
        }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub struct FolderData {
    /// unique identifier (ULID)
    pub id: Id<NodeData>,
    /// title of the folder
    pub title: String,
}

impl FolderData {
    pub fn new<S: Into<String>>(title: S) -> Self {
        Self {
            id: Id::generate(),
            title: title.into(),
        }
    }
}

#[derive(Debug, PartialEq, Clone)]
pub enum NodeData {
    /// Folder node
    Folder(FolderData),
    /// Bookmark node
    Bookmark(BookmarkData),
}

impl NodeData {
    pub fn new_folder(id: &str, title: &str) -> Self {
        // TODO don't unwrap
        let i: Id<NodeData> = Id::try_from(id).unwrap();
        Self::Folder(FolderData {
            id: i,
            title: title.to_string(),
        })
    }

    pub fn new_bookmark(id: &str, title: &str, url: &str) -> Self {
        // TODO don't unwrap
        let i: Id<NodeData> = Id::try_from(id).unwrap();
        Self::Bookmark(BookmarkData {
            id: i,
            title: title.to_string(),
            url: url.to_string(),
        })
    }

    /// return ULID of the node
    pub fn id(&self) -> &Id<NodeData> {
        match self {
            NodeData::Bookmark(data) => &data.id,
            NodeData::Folder(data) => &data.id,
        }
    }

    /// return the title of the node
    pub fn title(&self) -> &str {
        match self {
            NodeData::Bookmark(data) => &data.title,
            NodeData::Folder(data) => &data.title,
        }
    }

    /// return the url if the node is a bookmark
    pub fn url(&self) -> Option<String> {
        match self {
            NodeData::Bookmark(data) => Some(data.url.clone()),
            _ => None,
        }
    }
    /// return true if the node is a bookmark
    pub fn is_bookmark(&self) -> bool {
        matches!(self, NodeData::Bookmark(_))
    }

    /// return true if the node is a folder
    pub fn is_folder(&self) -> bool {
        matches!(self, NodeData::Folder(_))
    }

    /// Set title
    pub fn set_title(&mut self, title: String) {
        match self {
            NodeData::Bookmark(data) => data.title = title,
            NodeData::Folder(data) => data.title = title,
        }
    }
}

const FIELDS: &[&str] = &["id", "title"];

impl Serialize for NodeData {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: serde::Serializer,
    {
        let mut state = serializer.serialize_struct("NodeData", FIELDS.len())?;
        state.serialize_field("id", &self.id().to_string())?;
        state.serialize_field("title", &self.title().to_string())?;
        state.end()
    }
}
