use std::path::Path;

use once_cell::sync::Lazy;
use regex::Regex;

#[derive(Debug)]
struct Data {
    key: String,
    value: String,
}

impl Data {
    pub fn new(key: impl Into<String>, value: impl Into<String>) -> Self {
        Self {
            key: key.into(),
            value: value.into(),
        }
    }
}

type Metadata = Vec<Data>;

trait Finder {
    fn get(&self, key: &str) -> Option<String>;
    #[allow(unused)]
    fn has_key(&self, key: &str) -> bool;
    fn find_all(&self, key: &str) -> Vec<String>;
}

impl Finder for Metadata {
    fn get(&self, key: &str) -> Option<String> {
        self.iter().find(|d| d.key == key).map(|d| d.value.clone())
    }
    fn has_key(&self, key: &str) -> bool {
        self.iter().any(|d| d.key == key)
    }
    fn find_all(&self, key: &str) -> Vec<String> {
        self.iter()
            .filter(|d| d.key == key)
            .map(|d| d.value.clone())
            .collect::<Vec<_>>()
    }
}

#[derive(Debug)]
pub struct UserScript {
    /// whole code of user script
    pub code: String,
    /// metadata of @match as Vec<Regex>
    pub match_patterns: Vec<Regex>,
    #[allow(unused)]
    pub name: Option<String>,
    #[allow(unused)]
    pub description: Option<String>,
    #[allow(unused)]
    pub version: Option<String>,
    #[allow(unused)]
    pub author: Option<String>,
}

static METADATA_KEY_VALUE_REGEX: Lazy<Regex> =
    Lazy::new(|| Regex::new(r"@(?<key>[\w-]+)\s+(?<value>.+)").unwrap());

impl UserScript {
    pub fn parse(script: &str) -> Self {
        let mut metadata = vec![];
        let meta_block = script
            .lines()
            .skip_while(|line| !line.trim().starts_with("// ==UserScript=="))
            .skip(1)
            .take_while(|line| !line.trim().starts_with("// ==/UserScript=="))
            .collect::<Vec<&str>>()
            .join("\n");
        for cap in METADATA_KEY_VALUE_REGEX.captures_iter(&meta_block) {
            let data = Data::new(cap["key"].trim(), cap["value"].trim());
            metadata.push(data);
        }

        let mut match_patterns = vec![];
        for match_rule in metadata.find_all("match") {
            match convert_match_to_regex(&match_rule) {
                Ok(regex) => match_patterns.push(regex),
                Err(e) => log::error!("Regex error: {:?}", e.to_string()),
            }
        }

        Self {
            code: script.to_string(),
            name: metadata.get("name"),
            description: metadata.get("description"),
            version: metadata.get("version"),
            author: metadata.get("author"),
            match_patterns,
        }
    }
}

/// Convert @match metadata to rust Regex
/// match pattern should follow chrome extension match-patterns
/// https://developer.chrome.com/docs/extensions/develop/concepts/match-patterns
fn convert_match_to_regex(match_rule: &str) -> Result<Regex, regex::Error> {
    // escape dot and slash, replace wildcard * to .*
    let rule = match_rule
        .replace(".", "\\.")
        .replace("/", "\\/")
        .replace("*", ".*");

    let pattern = format!("^{}$", rule);
    Regex::new(&pattern)
}

pub fn check_path_is_user_js(path: &Path) -> bool {
    if let (Some(stem), Some(extension)) = (path.file_stem(), path.extension()) {
        if let Some(stem_str) = stem.to_str() {
            return stem_str.ends_with(".user") && extension == "js";
        }
    }
    false
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use super::*;

    #[test]
    fn test_parse() {
        let script = r#"
// ==UserScript==
// @author       You
// @name title
// ==/UserScript==
"#;
        let user_script = UserScript::parse(script);
        assert_eq!(user_script.author, Some("You".to_string()));
        assert_eq!(user_script.name, Some("title".to_string()));
        assert_eq!(user_script.description, None);
        assert_eq!(user_script.version, None);
        assert!(user_script.match_patterns.is_empty());
    }

    #[test]
    fn test_convert_match_to_regex() -> anyhow::Result<()> {
        let match_rule = "*://docs.rs/*";
        let regex = convert_match_to_regex(match_rule)?;
        assert!(regex.is_match("https://docs.rs/url/latest/url/"));
        assert!(regex.is_match("https://docs.rs/url/latest/url/#feature-debugger_visualizer"));
        assert!(!regex.is_match("https://crates.io/"));

        let match_rule = "*://*/*";
        let regex = convert_match_to_regex(match_rule)?;
        assert!(regex.is_match("https://docs.rs/url/latest/url/"));
        assert!(regex.is_match("http://example.com/xyz/abc"));

        let match_rule = "https://example.jp/*";
        let regex = convert_match_to_regex(match_rule)?;
        assert!(regex.is_match("https://example.jp/"));
        assert!(regex.is_match("https://example.jp/abc/def"));
        assert!(!regex.is_match("https://example.jp"));
        assert!(!regex.is_match("http://example.jp/"));
        assert!(!regex.is_match("https://example.com/"));
        Ok(())
    }

    #[test]
    fn test_path_end_with_userjs() -> anyhow::Result<()> {
        // should true
        let path = PathBuf::from("a/b/c/d.user.js");
        assert!(check_path_is_user_js(&path));

        // should false because end with user.js but no file name
        let path = PathBuf::from("a/b/c/user.js");
        assert!(!check_path_is_user_js(&path));

        // should false because just a js file
        let path = PathBuf::from("a/b/c/c.js");
        assert!(!check_path_is_user_js(&path));
        Ok(())
    }
}
