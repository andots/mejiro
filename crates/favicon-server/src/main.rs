// メインサーバー
#[tokio::main]
async fn main() {
    favicon_server::run(
        "outs/favicons.db",
        1421,
        vec![
            String::from("http://localhost"),
            String::from("http://localhost:1420"),
        ],
    )
    .await;
}
