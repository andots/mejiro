use axum::http::{header, StatusCode};
use axum::response::{IntoResponse, Response};

pub fn create_image_response(data: Vec<u8>) -> Response {
    (
        StatusCode::OK,
        [
            (header::CONTENT_TYPE, "image/png"),
            (header::CACHE_CONTROL, "public, max-age=86400"),
        ],
        data,
    )
        .into_response()
}
