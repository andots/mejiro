use std::{
    fs::File,
    io::{Read, Write},
    path::Path,
};

use crate::error::AppError;

/// Write pretty json to file
pub fn write_json_to_file_pretty<P>(path: P, json_value: &serde_json::Value) -> Result<(), AppError>
where
    P: AsRef<Path>,
{
    let mut file = File::create(path)?;
    let json_str = serde_json::to_string_pretty(json_value)?;
    file.write_all(json_str.as_bytes())?;
    Ok(())
}

/// Write json to file
pub fn write_json_to_file<P>(path: P, json_value: &serde_json::Value) -> Result<(), AppError>
where
    P: AsRef<Path>,
{
    let mut file = File::create(path)?;
    let json_str = serde_json::to_string(json_value)?;
    file.write_all(json_str.as_bytes())?;
    Ok(())
}

/// Read file to String
pub fn read_file_to_string<P>(path: P) -> Result<String, AppError>
where
    P: AsRef<Path>,
{
    let mut file = File::open(path)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}
