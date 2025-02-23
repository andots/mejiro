use serde::{Deserialize, Serialize};
use url::Url;

use crate::{error::CoreError, utils::get_unix_timestamp};

/// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNodeType
#[derive(Debug, PartialEq, Clone, Serialize, Deserialize)]
pub enum NodeType {
    Root,
    Bookmark,
    Folder,
    Separator,
}

/// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BookmarkData {
    /// Title
    pub title: String,
    /// URL this field will be None if the node type is a folder or separator node
    pub url: Option<Url>,
    /// URL host name for convenience
    pub host: Option<String>,
    /// Node type (Bookmark, Folder, Separator)
    pub node_type: NodeType,
    /// Unix timestamp in milliseconds
    pub date_added: Option<u64>,
    /// Whether bookmark is open
    #[serde(default = "default_is_open")]
    pub is_open: bool,
}

fn default_is_open() -> bool {
    true
}

impl BookmarkData {
    fn new(title: &str, url: Option<Url>, node_type: NodeType) -> Self {
        Self {
            title: title.to_string(),
            url: url.clone(),
            host: url.and_then(|u| u.host_str().map(|s| s.to_string())),
            node_type,
            date_added: get_unix_timestamp(),
            is_open: default_is_open(),
        }
    }

    pub fn new_root() -> Self {
        Self::new("All Bookmarks", None, NodeType::Root)
    }

    pub fn new_folder(title: &str) -> Self {
        Self::new(title, None, NodeType::Folder)
    }

    pub fn try_new_bookmark(title: &str, url: &str) -> Result<Self, CoreError> {
        let parsed_url = Url::parse(url)?;
        if parsed_url.scheme() == "http" || parsed_url.scheme() == "https" {
            Ok(Self::new(title, Some(parsed_url), NodeType::Bookmark))
        } else {
            Err(CoreError::NotWebUrl(parsed_url.to_string()))
        }
    }
}

#[derive(Debug, Serialize)]
pub struct FolderData {
    pub index: usize,
    pub title: String,
}

impl FolderData {
    pub fn new(index: usize, title: impl Into<String>) -> Self {
        Self {
            index,
            title: title.into(),
        }
    }
}

#[derive(Debug, Serialize)]
pub struct ToolbarBookmarkData {
    pub index: usize,
    pub title: String,
    pub url: String,
    pub host: String,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_url() {
        let url = Url::parse("https://abc.example.com").unwrap();
        assert_eq!(url.host_str(), Some("abc.example.com"));
    }

    #[test]
    fn test_try_new() {
        let url = "https://abc.example.com";
        // normal case
        let bookmark = BookmarkData::try_new_bookmark("test", url).unwrap();
        assert_eq!(bookmark.url, Some(Url::parse(url).unwrap()));

        // folder case
        let folder = BookmarkData::new_folder("test");
        assert_eq!(folder.url, None);
        assert_eq!(folder.node_type, NodeType::Folder);

        // invalid url case
        let url = "ftp://abc.example.com";
        let err = BookmarkData::try_new_bookmark("test", url).unwrap_err();
        assert_eq!(err.to_string(), "Not Web URL: ftp://abc.example.com/");

        // no scheme case
        let url = "abc.example.com";
        let result = BookmarkData::try_new_bookmark("test", url);
        assert!(result.is_err());

        // not url case
        let url = "abc";
        let result = BookmarkData::try_new_bookmark("test", url);
        assert!(result.is_err());
    }
}
