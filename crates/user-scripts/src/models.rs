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
    pub script: String,
    #[allow(unused)]
    pub name: Option<String>,
    #[allow(unused)]
    pub description: Option<String>,
    #[allow(unused)]
    pub version: Option<String>,
    #[allow(unused)]
    pub author: Option<String>,
    #[allow(unused)]
    pub match_patterns: Vec<String>,
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

        Self {
            script: script.to_string(),
            name: metadata.get("name"),
            description: metadata.get("description"),
            version: metadata.get("version"),
            author: metadata.get("author"),
            match_patterns: metadata.find_all("match"),
        }
    }
}

#[cfg(test)]
mod tests {
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
}
