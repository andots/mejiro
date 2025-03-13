use std::path::{Path, PathBuf};

use glob::glob;

use crate::Error;

pub fn list_userscripts(dir: &Path) -> Result<Vec<PathBuf>, Error> {
    let mut pattern = dir.to_path_buf();
    pattern.push("**/*.user.js");
    let pattern_str = pattern.to_str().ok_or(Error::InvalidUTF8())?;
    let paths = glob(pattern_str)?;
    let files = paths.filter_map(|p| p.ok()).collect::<Vec<_>>();
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
        let files = list_userscripts(&path)?;
        assert_eq!(files.len(), 2);
        for file in files {
            println!("{}", file.display());
        }

        Ok(())
    }
}
