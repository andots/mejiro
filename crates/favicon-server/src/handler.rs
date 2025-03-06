use axum::{
    extract::{Query, State},
    http,
    response::{IntoResponse, Response},
};
use redb::{Database, ReadableTable};
use reqwest::{Client, StatusCode};
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

async fn fetch_favicon(client: &Client, host: &str, size: u8) -> Result<Vec<u8>, Error> {
    let favicon_url = format!("{GSTATIC_URL}&size={size}&url=https://{host}");
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

async fn keys(db: &Database) -> Result<Vec<String>, Error> {
    let read_txn = db.begin_read()?;
    let table = read_txn.open_table(FAVICON_TABLE)?;
    let iter = table.iter()?;
    let keys = iter
        .filter_map(|r| r.ok())
        .map(|r| r.0.value().to_string())
        .collect::<Vec<_>>();

    Ok(keys)
}

async fn remove(db: &Database, key: &str) -> Result<(), Error> {
    let write_txn = db.begin_write()?;
    {
        let mut table = write_txn.open_table(FAVICON_TABLE)?;
        table.remove(key)?;
    }
    write_txn.commit()?;
    Ok(())
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

    // key is the host part of the URL
    let host_str = match url.host_str() {
        Some(host) => host,
        None => {
            return ErrorResponse::new(http::StatusCode::BAD_REQUEST, "Invalid URL: missing host")
                .into_response();
        }
    };

    let db = state.db.lock().await;

    let value = match get(&db, host_str).await {
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

        let favicon_data = match fetch_favicon(&state.client, host_str, 32).await {
            Ok(data) => data,
            Err(e) => {
                return ErrorResponse::from(e).into_response();
            }
        };

        match insert(&db, host_str, favicon_data.as_slice()).await {
            Ok(_) => create_image_response(favicon_data),
            Err(e) => ErrorResponse::from(e).into_response(),
        }
    }
}

pub async fn delete_all(State(state): State<Arc<AppState>>) -> Response {
    let db = state.db.lock().await;
    let keys = match keys(&db).await {
        Ok(keys) => keys,
        Err(e) => {
            return (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response();
        }
    };

    for key in keys {
        match remove(&db, &key).await {
            Ok(_) => (),
            Err(e) => {
                return (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response();
            }
        }
    }

    (StatusCode::OK, "All favicons deleted").into_response()
}

pub async fn health_check() -> Response {
    (StatusCode::OK, "OK").into_response()
}
