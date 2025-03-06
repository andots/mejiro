// メインサーバー
#[tokio::main]
async fn main() {
    favicon_server::run("outs/favicons.db", 1421).await;
}
