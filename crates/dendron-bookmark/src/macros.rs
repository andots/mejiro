/// Create a new bookmark node data
#[macro_export]
macro_rules! new_bookmark_node_data {
    ($title:expr, $url:expr) => {
        $crate::models::NodeData::Bookmark($crate::models::BookmarkData::new($title, $url))
    };
}

/// Create a new folder node data
#[macro_export]
macro_rules! new_folder_node_data {
    ($title:expr) => {
        $crate::models::NodeData::Folder($crate::models::FolderData::new($title))
    };
}
