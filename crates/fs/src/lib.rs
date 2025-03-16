use std::path::{Path, PathBuf};

use glob::glob;

#[derive(Debug, thiserror::Error)]
pub enum Error {
    #[error("Invalid UTF-8 charactor")]
    InvalidUTF8(),

    #[error(transparent)]
    GlobError(#[from] glob::GlobError),

    #[error(transparent)]
    GlobPattern(#[from] glob::PatternError),
}

pub fn glob_files_with_matcher<P: AsRef<Path>>(
    dir: P,
    matcher: &str,
) -> Result<Vec<PathBuf>, Error> {
    let mut path = dir.as_ref().to_path_buf();
    path.push(matcher);
    let pattern_str = path.to_str().ok_or(Error::InvalidUTF8())?;
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
    fn test_glob_files() -> anyhow::Result<()> {
        let path = get_assets_dir();
        let files = glob_files_with_matcher(&path, "**/*.user.js")?;
        assert_eq!(files.len(), 2);
        for file in files {
            println!("{}", file.display());
        }

        Ok(())
    }
}
