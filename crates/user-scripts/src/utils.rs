use std::path::{Path, PathBuf};

use glob::glob;

use crate::Error;

pub fn list_userscript_files(dir: &Path) -> Result<Vec<PathBuf>, Error> {
    let pattern = format!("{}/**/*.user.js", dir.display());
    let mut files = Vec::new();
    let paths = glob(&pattern)?;

    // let files = paths.filter_map(|p| p.ok()).collect::<Vec<_>>();

    for entry in paths {
        match entry {
            Ok(path) => files.push(path),
            Err(e) => log::error!("GlobError: {:?}", e),
        }
    }

    Ok(files)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn get_assets_dir() -> PathBuf {
        let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")
            .expect("CARGO_MANIFEST_DIR environment variable is not set");
        let path = PathBuf::from(manifest_dir).join("tests").join("assets");
        if !path.exists() {
            std::fs::create_dir_all(&path).expect("can't create outs directory");
        }
        path
    }

    #[test]
    fn test_list_user_js_file() -> anyhow::Result<()> {
        let path = get_assets_dir();
        let files = list_userscript_files(&path)?;
        assert_eq!(files.len(), 2);
        for file in files {
            println!("{}", file.display());
        }

        Ok(())
    }
}
