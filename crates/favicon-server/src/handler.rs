use axum::{
    extract::{Query, State},
    http,
    response::{IntoResponse, Response},
};
use reqwest::{Client, StatusCode};
use serde::Deserialize;
use std::sync::Arc;
use url::Url;

use crate::{
    db,
    error::{Error, ErrorResponse},
    response::create_image_response,
    AppState,
};

#[derive(Deserialize)]
pub struct UrlQuery {
    url: String,
}

const GSTATIC_URL: &str =
    "https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL";

async fn fetch_favicon(client: &Client, host: &str, size: u8) -> Result<Vec<u8>, Error> {
    let favicon_url = format!("{GSTATIC_URL}&size={size}&url=https://{host}");
    log::debug!("Fetching favicon from: {}", favicon_url);

    let res = client.get(&favicon_url).send().await?;
    if res.status().is_success() {
        let bytes = res.bytes().await?;
        Ok(bytes.to_vec())
    } else {
        Err(Error::Other("Failed to fetch favicon from API".to_string()))
    }
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

    let value = match db::find(&db, host_str).await {
        Ok(v) => v,
        Err(e) => {
            return ErrorResponse::from(e).into_response();
        }
    };

    if let Some(inner) = value {
        log::debug!("Favicon found in database for: {}", host_str);
        create_image_response(inner.value().to_vec())
    } else {
        let favicon_data = match fetch_favicon(&state.client, host_str, 32).await {
            Ok(data) => data,
            Err(e) => {
                return ErrorResponse::from(e).into_response();
            }
        };

        match db::insert(&db, host_str, favicon_data.as_slice()).await {
            Ok(_) => create_image_response(favicon_data),
            Err(e) => ErrorResponse::from(e).into_response(),
        }
    }
}

pub async fn remove_all_favicons(State(state): State<Arc<AppState>>) -> Response {
    let db = state.db.lock().await;
    let keys = match db::keys(&db).await {
        Ok(keys) => keys,
        Err(e) => {
            return (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response();
        }
    };

    for key in keys {
        match db::remove(&db, &key).await {
            Ok(_) => (),
            Err(e) => {
                return (StatusCode::INTERNAL_SERVER_ERROR, e.to_string()).into_response();
            }
        }
    }

    (StatusCode::OK, "All favicons removed from database").into_response()
}

pub async fn health_check() -> Response {
    (StatusCode::OK, "OK").into_response()
}

pub async fn handler_404() -> Response {
    (StatusCode::NOT_FOUND, "Not Found").into_response()
}
