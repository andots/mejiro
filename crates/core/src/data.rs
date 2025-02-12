use serde::{Deserialize, Serialize};
use url::Url;

use crate::utils::get_unix_timestamp;

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
    /// Title
    pub title: String,
    /// URL this field will be None if the node type is a folder or separator node
    pub url: Option<Url>,
    /// Node type (Bookmark, Folder, Separator)
    pub node_type: BookmarkNodeType,
    /// Unix timestamp in milliseconds
    pub date_added: Option<u64>,
}

impl BookmarkData {
    pub fn new(title: &str, url: Option<Url>, node_type: BookmarkNodeType) -> Self {
        Self {
            title: title.to_string(),
            url,
            node_type,
            date_added: get_unix_timestamp(),
        }
    }
}
