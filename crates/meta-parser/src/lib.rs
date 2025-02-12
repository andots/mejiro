//! This crate is based on MetaScraper to get title and favicon from a html.
//!
//! [crate]: https://crates.io/crates/metascraper
//! [github]: https://github.com/mehmetcansahin/metascraper

use tl::{ParseError, ParserOptions, VDom};

#[derive(Debug)]
pub struct Metatag {
    pub name: String,
    pub content: String,
}

#[derive(Debug)]
pub struct MetaData {
    pub title: Option<String>,
}

pub struct MetaScraper<'a> {
    dom: VDom<'a>,
}

impl MetaScraper<'_> {
    /// Parse input
    pub fn parse(input: &str) -> Result<MetaScraper, ParseError> {
        match tl::parse(input, ParserOptions::default()) {
            Ok(dom) => Ok(MetaScraper { dom }),
            Err(err) => Err(err),
        }
    }

    /// Returns the inner text of the given selector.
    pub fn inner_text(&self, selector: &str) -> Option<String> {
        self.dom
            .query_selector(selector)
            .and_then(|mut iter| iter.next())
            .and_then(|node_handle| node_handle.get(self.dom.parser()))
            .map(|node| node.inner_text(self.dom.parser()).to_string())
    }

    /// Returns the value of the given attribute of the given selector.
    pub fn attribute(&self, selector: &str, attr: &str) -> Option<String> {
        self.dom
            .query_selector(selector)
            .and_then(|mut iter| iter.next())
            .and_then(|node_handle| node_handle.get(self.dom.parser()))
            .and_then(|node| node.as_tag())
            .and_then(|html_tag| html_tag.attributes().get(attr).flatten())
            .map(|bytes| bytes.as_utf8_str().to_string())
    }

    /// Metatags return in vector.
    pub fn metatags(&self) -> Option<Vec<Metatag>> {
        let mut metatags: Vec<Metatag> = Vec::new();
        let query_sellector_iter = self.dom.query_selector(r#"meta"#)?;
        for node_handle in query_sellector_iter {
            let node = node_handle.get(self.dom.parser())?;
            if let Some(tag) = node.as_tag() {
                let name = tag
                    .attributes()
                    .get("name")
                    .or_else(|| tag.attributes().get("property"))
                    .or_else(|| tag.attributes().get("itemprop"))
                    .or_else(|| tag.attributes().get("http-equiv"))
                    .flatten()
                    .map(|x| x.as_utf8_str().to_string());

                let content = tag
                    .attributes()
                    .get("content")
                    .or_else(|| tag.attributes().get("description"))
                    .flatten()
                    .map(|x| x.as_utf8_str().to_string());

                if name.is_some() && content.is_some() {
                    let nt = Metatag {
                        name: name?,
                        content: content?,
                    };
                    metatags.push(nt);
                }
            }
        }
        Some(metatags)
    }

    /// Returns the title
    pub fn title(&self) -> Option<String> {
        self.inner_text("title")
            .or_else(|| self.attribute("meta[property*=title]", "content"))
            .or_else(|| self.inner_text(".post-title"))
            .or_else(|| self.inner_text(".entry-title"))
            .or_else(|| self.inner_text("h1[class*=title] a"))
            .or_else(|| self.inner_text("h1[class*=title]"))
    }

    /// Returns the metadata
    pub fn metadata(&self) -> MetaData {
        MetaData {
            title: self.title(),
        }
    }
}

#[cfg(test)]
mod tests {
    use std::time::Duration;

    use crate::MetaScraper;

    #[test]
    fn test_page() {
        let input = include_str!("test.html");
        let metascraper = MetaScraper::parse(input).unwrap();
        let metadata = metascraper.metadata();
        assert_eq!(metadata.title, Some("Title".to_string()));
    }

    #[test]
    fn test_reqwest() {
        const BROWSER_USER_AGENT: &str =
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36";
        let client = reqwest::blocking::Client::builder()
            .timeout(Duration::from_secs(10))
            .user_agent(BROWSER_USER_AGENT)
            .build()
            .unwrap();
        let input = client
            .get("https://www.electronjs.org/docs/latest/tutorial/process-model")
            .send()
            .unwrap()
            .text()
            .unwrap();
        let metascraper = MetaScraper::parse(&input).unwrap();
        let metadata = metascraper.metadata();
        println!("{:?}", metadata);
        println!("{:?}", metascraper.metatags());
        // println!("{}", input);
        // assert_eq!(metadata.title, Some("Rust Programming Language".to_string()));
    }
}
