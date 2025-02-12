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
    /// URL host name for convenience
    pub host: Option<String>,
    /// Node type (Bookmark, Folder, Separator)
    pub node_type: BookmarkNodeType,
    /// Unix timestamp in milliseconds
    pub date_added: Option<u64>,
}

impl BookmarkData {
    pub fn new(title: &str, url: Option<Url>, node_type: BookmarkNodeType) -> Self {
        Self {
            title: title.to_string(),
            url: url.clone(),
            host: url.and_then(|u| u.host_str().map(|s| s.to_string())),
            node_type,
            date_added: get_unix_timestamp(),
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_url() {
        let url = Url::parse("https://abc.example.com").unwrap();
        assert_eq!(url.host_str(), Some("abc.example.com"));
    }
}
