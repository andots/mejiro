#[tokio::main]
async fn main() {
    favicon_server::run(
        "outs/favicons.db",
        7853,
        vec!["http://localhost", "http://localhost:1420"],
    )
    .await;
}
