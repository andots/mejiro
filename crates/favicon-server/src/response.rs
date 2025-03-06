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

pub fn create_default_image_response() -> Response {
    // https://icons8.com/icon/3685/globe
    // #339AF0
    // https://icons8.com/icon/NyuxPErq0tu2/globe-africa
    // #5C7CFA
    create_image_response(include_bytes!("./assets/default.png").to_vec())
}
