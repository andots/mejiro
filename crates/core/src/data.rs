use serde::{Deserialize, Serialize};
use url::Url;

/// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNodeType
#[derive(Debug, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub enum BookmarkNodeType {
    Bookmark,
    Folder,
    Separator,
}

/// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
#[derive(Debug, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub struct BookmarkData {
    // pub id: u128,
    /// Title
    pub title: String,
    /// URL if the node type is a folder or separator this field will be None
    pub url: Option<Url>,
    /// Node type (Bookmark, Folder, Separator)
    pub node_type: BookmarkNodeType,
    /// Unix timestamp in milliseconds
    pub date_added: Option<u64>,
}
