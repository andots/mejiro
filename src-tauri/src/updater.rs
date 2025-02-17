use tauri::Manager;
use tauri_plugin_dialog::{DialogExt, MessageDialogButtons, MessageDialogKind};

fn generate_message(current_version: &str, new_version: &str) -> String {
    format!("New version v{} released!\nPlease update to the latest version.\n\nCurrent version: v{} - Latest version: v{}", new_version, current_version, new_version)
}

pub async fn check_and_install_updates(
    app: tauri::AppHandle,
    updater: tauri_plugin_updater::Updater,
) {
    let update_result = updater.check().await;
    match update_result {
        Ok(update_status) => {
            match update_status {
                Some(status) => {
                    let do_update = app
                        .dialog()
                        .message(generate_message(&status.current_version, &status.version))
                        .title("Update Available")
                        .kind(MessageDialogKind::Info)
                        .buttons(MessageDialogButtons::OkCancelCustom(
                            "Update".to_string(),
                            "Cancel".to_string(),
                        ))
                        .blocking_show();

                    if do_update {
                        let _ = status.download_and_install(|_, _| {}, || {}).await;

                        tauri::process::restart(&app.env());
                    }
                }
                None => {
                    log::info!("No updates available");
                }
            };
        }
        Err(e) => {
            log::error!("Failed to check for updates: {}", e);
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_generate_message() {
        let current_version = "1.0.0";
        let new_version = "1.0.1";
        let expected = "New version v1.0.1 released!\nPlease update to the latest version.\n\nCurrent version: v1.0.0 - Latest version: v1.0.1";
        assert_eq!(generate_message(current_version, new_version), expected);
        println!("{}", generate_message(current_version, new_version));
    }
}
