pub mod error;
mod handler;
mod response;

use axum::{routing::get, Router};
use redb::{Database, TableDefinition};
use reqwest::Client;
use std::sync::Arc;
use std::{net::SocketAddr, time::Duration};
use tokio::sync::Mutex;

use handler::get_favicon;

const USER_AGENT: &str =
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0";

pub const FAVICON_TABLE: TableDefinition<&str, &[u8]> = TableDefinition::new("favicons");

pub struct AppState {
    db: Arc<Mutex<Database>>,
    client: Client,
}

pub async fn run<P>(path: P, port: u16)
where
    P: AsRef<std::path::Path>,
{
    let db = Database::create(path).expect("Failed to create database");
    let write_txn = db.begin_write().expect("Failed to begin write transaction");
    {
        let mut _table = write_txn
            .open_table(FAVICON_TABLE)
            .expect("Failed to open table");
    }
    write_txn
        .commit()
        .expect("Failed to commit write transaction");

    let db = Arc::new(Mutex::new(db));

    let client = reqwest::Client::builder()
        .timeout(Duration::new(30, 0))
        .user_agent(USER_AGENT)
        .build()
        .unwrap();

    let app_state = Arc::new(AppState { db, client });

    // let allow_origins = vec!["http://localhost:1420"];

    // let origins = allow_origins
    //     .iter()
    //     .map(|addr| addr.parse::<HeaderValue>().unwrap())
    //     .collect::<Vec<_>>();

    let app = Router::new()
        .route("/favicon", get(get_favicon))
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], port));

    println!("Server starts on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
