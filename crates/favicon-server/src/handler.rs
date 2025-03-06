use axum::{
    extract::{Query, State},
    response::{IntoResponse, Response},
};
use redb::Database;
use reqwest::Client;
use serde::Deserialize;
use std::sync::Arc;
use url::Url;

use crate::{
    error::{Error, ErrorResponse},
    response::create_image_response,
    AppState, FAVICON_TABLE,
};

const GSTATIC_URL: &str =
    "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL";

#[derive(Deserialize)]
pub struct UrlQuery {
    url: String,
}

async fn fetch_favicon(client: &Client, url: &Url, size: u8) -> Result<Vec<u8>, Error> {
    let favicon_url = format!("{GSTATIC_URL}&size={size}&url={}", url.as_str());
    println!("Fetching favicon from: {}", favicon_url);

    let res = client.get(&favicon_url).send().await?;
    if res.status().is_success() {
        let bytes = res.bytes().await?;
        Ok(bytes.to_vec())
    } else {
        Err(Error::Other("Failed to fetch favicon from API".to_string()))
    }
}

async fn get(
    db: &Database,
    key: &str,
) -> Result<Option<redb::AccessGuard<'static, &'static [u8]>>, Error> {
    let read_txn = db.begin_read()?;
    let table = read_txn.open_table(FAVICON_TABLE)?;
    let value = table.get(key)?;
    Ok(value)
}

async fn insert(db: &Database, key: &str, value: &[u8]) -> Result<(), Error> {
    let write_txn = db.begin_write()?;
    {
        let mut table = write_txn.open_table(FAVICON_TABLE)?;
        table.insert(key, value)?;
    }
    write_txn.commit()?;
    Ok(())
}

pub async fn get_favicon(
    State(state): State<Arc<AppState>>,
    Query(query): Query<UrlQuery>,
) -> Response {
    let url = match Url::parse(&query.url) {
        Ok(url) => url,
        Err(e) => {
            return ErrorResponse::from(e).into_response();
        }
    };

    let db = state.db.lock().await;

    let value = match get(&db, url.as_str()).await {
        Ok(v) => v,
        Err(e) => {
            return ErrorResponse::from(e).into_response();
        }
    };

    if let Some(inner) = value {
        println!("Favicon found in database!");
        create_image_response(inner.value().to_vec())
    } else {
        println!("Favicon not found in database! Fetch favicon from API");

        let favicon_data = match fetch_favicon(&state.client, &url, 32).await {
            Ok(data) => data,
            Err(e) => {
                return ErrorResponse::from(e).into_response();
            }
        };

        match insert(&db, url.as_str(), favicon_data.as_slice()).await {
            Ok(_) => create_image_response(favicon_data),
            Err(e) => ErrorResponse::from(e).into_response(),
        }
    }
}
