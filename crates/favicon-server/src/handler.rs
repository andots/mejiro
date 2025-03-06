use axum::{
    extract::{Query, State},
    http::StatusCode,
    response::{IntoResponse, Response},
};
use reqwest::Client;
use serde::Deserialize;
use std::sync::Arc;
use url::Url;

use crate::{error::ApiError, response::create_image_response, AppState, FAVICON_TABLE};

const GSTATIC_URL: &str =
    "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL";

#[derive(Deserialize)]
pub struct UrlQuery {
    url: String,
}

async fn fetch_favicon(client: &Client, url: &Url, size: u8) -> Result<Vec<u8>, ApiError> {
    let favicon_url = format!("{GSTATIC_URL}&size={size}&url={}", url.as_str());
    println!("Fetching favicon from {}", favicon_url);

    match client.get(&favicon_url).send().await {
        Ok(response) => {
            if response.status().is_success() {
                match response.bytes().await {
                    Ok(bytes) => Ok(bytes.to_vec()),
                    Err(e) => Err(ApiError::from(e)),
                }
            } else {
                Err(ApiError::new(
                    StatusCode::INTERNAL_SERVER_ERROR,
                    "Failed to fetch favicon",
                ))
            }
        }
        Err(e) => Err(ApiError::from(e)),
    }
}

pub async fn get_favicon(
    State(state): State<Arc<AppState>>,
    Query(query): Query<UrlQuery>,
) -> Response {
    let url = match Url::parse(&query.url) {
        Ok(url) => url,
        Err(e) => {
            return ApiError::from(e).into_response();
        }
    };

    let db = state.db.lock().await;
    let read_txn = match db.begin_read() {
        Ok(txn) => txn,
        Err(e) => {
            return ApiError::from(e).into_response();
        }
    };
    let table = match read_txn.open_table(FAVICON_TABLE) {
        Ok(table) => table,
        Err(e) => {
            return ApiError::from(e).into_response();
        }
    };

    if let Ok(Some(value)) = table.get(url.as_str()) {
        println!("Favicon found in database!");
        let favicon_data = value.value().to_vec();
        create_image_response(favicon_data)
    } else {
        println!("Favicon not found in database! Fetch favicon from API");

        let favicon_data = match fetch_favicon(&state.client, &url, 32).await {
            Ok(data) => data,
            Err(e) => {
                return e.into_response();
            }
        };

        let write_txn = match db.begin_write() {
            Ok(txn) => txn,
            Err(e) => {
                return ApiError::from(e).into_response();
            }
        };
        {
            match write_txn.open_table(FAVICON_TABLE) {
                Ok(mut table) => match table.insert(url.as_str(), favicon_data.as_slice()) {
                    Ok(_) => (),
                    Err(e) => {
                        return ApiError::from(e).into_response();
                    }
                },
                Err(e) => {
                    return ApiError::from(e).into_response();
                }
            };
        }

        match write_txn.commit() {
            Ok(_) => {
                println!("Favicon write transaction committed!");
            }
            Err(e) => {
                return ApiError::from(e).into_response();
            }
        }

        create_image_response(favicon_data)
    }
}
