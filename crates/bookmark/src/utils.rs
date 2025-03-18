use std::time::{SystemTime, UNIX_EPOCH};

// write function generate unix timestamp in milliseconds
pub fn get_unix_timestamp() -> Option<u64> {
    let now = SystemTime::now();
    match now.duration_since(UNIX_EPOCH) {
        Ok(duration) => Some(duration.as_millis() as u64),
        Err(_) => None,
    }
}
