use std::time::Duration;

use base64::{prelude::BASE64_STANDARD, Engine};
use reqwest::Client;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("RequestFailed: {0}")]
    ReqwestError(#[from] reqwest::Error),
    #[error("Invalid Url: {0}")]
    InvalidUrl(String),
}

const BROWSER_USER_AGENT: &str =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0";

const GSTATIC_URL: &str =
    "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL";

pub fn create_client() -> Client {
    reqwest::Client::builder()
        .timeout(Duration::new(30, 0))
        .user_agent(BROWSER_USER_AGENT)
        .build()
        .unwrap()
}

pub async fn fetch_favicon(client: &Client, url: &str, size: i32) -> Result<String, Error> {
    let url = reqwest::Url::parse(url).map_err(|e| Error::InvalidUrl(e.to_string()))?;
    let gstatic_url = format!("{}&size={}&url={}", GSTATIC_URL, size, url);

    let res = client.get(gstatic_url.as_str()).send().await?;
    let img_data = res.bytes().await?;
    let b64 = BASE64_STANDARD.encode(img_data.as_ref());

    Ok(format!("data:image/png;base64,{}", b64))
}

#[cfg(test)]
mod tests {
    use std::{io::Write, path::PathBuf, sync::OnceLock};

    use super::*;

    static OUTS_PATH: OnceLock<PathBuf> = OnceLock::new();

    fn get_outs_path() -> &'static PathBuf {
        OUTS_PATH.get_or_init(|| {
            // プロジェクトのルートディレクトリからの相対パスでassetsディレクトリを指定
            let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
                .expect("CARGO_MANIFEST_DIR environment variable is not set");
            PathBuf::from(manifest_dir).join("outs")
        })
    }

    #[tokio::test]
    async fn test_non_url() {
        let client = create_client();
        let url = "aaa";
        let size = 16;
        let res = fetch_favicon(&client, url, size).await;
        assert!(res.is_err());
        assert!(res.is_err_and(|x| matches!(x, Error::InvalidUrl(_))));
    }

    #[tokio::test]
    async fn test_wrong_url() {
        let client = create_client();
        let url = "https://www.rust-lang.aaaa";
        let size = 16;
        let res = fetch_favicon(&client, url, size).await;
        assert!(res.is_ok());
        println!("{}", res.unwrap());
    }

    #[tokio::test]
    async fn test_fetch_favicon() {
        let client = create_client();
        let url = "https://www.rust-lang.org/";
        let size = 16;
        let res = fetch_favicon(&client, url, size).await;
        assert!(res.is_ok());
        let res = res.unwrap();
        println!("{}", res);
        assert!(res.starts_with("data:image/png;base64,"));
    }

    #[tokio::test]
    async fn test_generate_html() {
        let client = create_client();
        let size = 32;
        let crates_io = fetch_favicon(&client, "https://crates.io/crates/tokio-macros", size)
            .await
            .unwrap();
        let stackoverflow = fetch_favicon(&client, "https://stackoverflow.com/questions", size)
            .await
            .unwrap();
        let github = fetch_favicon(&client, "https://github.com", size)
            .await
            .unwrap();
        let docs_rs = fetch_favicon(&client, "https://docs.rs", size)
            .await
            .unwrap();
        let wrong = fetch_favicon(&client, "https://docs.rsrsrs", size)
            .await
            .unwrap();
        let html = format!(
            r#"
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Test</title>
</head>
<body>
    <img src="{}" alt="Favicon">
    <img src="{}" alt="Favicon">
    <img src="{}" alt="Favicon">
    <img src="{}" alt="Favicon">
    <img src="{}" alt="Favicon">
</body>
</html>
        "#,
            crates_io, stackoverflow, github, docs_rs, wrong
        );
        let path = get_outs_path().join("test.html");
        let mut file = std::fs::File::create(path).unwrap();
        file.write_all(html.as_bytes()).unwrap();
    }
}
