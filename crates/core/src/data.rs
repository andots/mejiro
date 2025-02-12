use serde::{Deserialize, Serialize};
use url::Url;

use crate::{error::CoreError, utils::get_unix_timestamp};

/// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNodeType
#[derive(Debug, PartialEq, Eq, Clone, Serialize, Deserialize)]
pub enum NodeType {
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
    pub node_type: NodeType,
    /// Unix timestamp in milliseconds
    pub date_added: Option<u64>,
}

impl BookmarkData {
    pub fn new(title: &str, url: Option<Url>, node_type: NodeType) -> Self {
        Self {
            title: title.to_string(),
            url: url.clone(),
            host: url.and_then(|u| u.host_str().map(|s| s.to_string())),
            node_type,
            date_added: get_unix_timestamp(),
        }
    }

    pub fn try_new(title: &str, url: Option<&str>, node_type: NodeType) -> Result<Self, CoreError> {
        if url.is_some() {
            let url = Url::parse(url.unwrap())?;
            if url.scheme() == "http" || url.scheme() == "https" {
                Ok(Self {
                    title: title.to_string(),
                    url: Some(url.clone()),
                    host: url.host_str().map(|s| s.to_string()),
                    node_type,
                    date_added: get_unix_timestamp(),
                })
            } else {
                Err(CoreError::NotWebUrl(url.to_string()))
            }
        } else {
            Ok(Self {
                title: title.to_string(),
                url: None,
                host: None,
                node_type,
                date_added: get_unix_timestamp(),
            })
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

    #[test]
    fn test_try_new() {
        let url = "https://abc.example.com";
        // normal case
        let bookmark = BookmarkData::try_new("test", Some(url), NodeType::Bookmark).unwrap();
        assert_eq!(bookmark.url, Some(Url::parse(url).unwrap()));

        // folder case
        let folder = BookmarkData::try_new("test", None, NodeType::Folder).unwrap();
        assert_eq!(folder.url, None);
        assert_eq!(folder.node_type, NodeType::Folder);

        // bookmark && folder case
        let url = "https://abc.example.com";
        let bookmark = BookmarkData::try_new("test", Some(url), NodeType::Folder).unwrap();
        assert_eq!(bookmark.url, Some(Url::parse(url).unwrap()));

        // invalid url case
        let url = "ftp://abc.example.com";
        let err = BookmarkData::try_new("test", Some(url), NodeType::Bookmark).unwrap_err();
        assert_eq!(err.to_string(), "Not Web URL: ftp://abc.example.com/");

        // no scheme case
        let url = "abc.example.com";
        let result = BookmarkData::try_new("test", Some(url), NodeType::Bookmark);
        assert!(result.is_err());
    }
}
