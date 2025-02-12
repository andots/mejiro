use dendron::{HotNode, Node};
use serde::{Deserialize, Serialize};
use serde_json::json;

use crate::id::Id;
use crate::models::{FolderData, NodeData};

pub trait Search {
    fn find_by_id(&self, id: &Id<NodeData>) -> Option<Node<NodeData>>;
}

impl Search for Node<NodeData> {
    fn find_by_id(&self, id: &Id<NodeData>) -> Option<Node<NodeData>> {
        self.depth_first_traverse()
            // TODO filter only event Open
            .map(|ev| ev.as_value().clone())
            .find(|node| node.borrow_data().id() == id)
    }
}

impl Search for HotNode<NodeData> {
    fn find_by_id(&self, id: &Id<NodeData>) -> Option<Node<NodeData>> {
        // TODO maybe should not use plain() here
        self.plain().find_by_id(id)
    }
}

/// Output should be like BookmarkTreeNode in browser
/// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/BookmarkTreeNode
#[derive(Debug, Serialize, Deserialize)]
struct BrowserBookmarkTreeNode {
    id: String,
    title: String,
    url: Option<String>,
    children: Vec<BrowserBookmarkTreeNode>,
}

// TODO: rename
#[allow(dead_code)]
fn dfs_recursive(node: &Node<NodeData>) -> serde_json::Value {
    json!({
        "id": node.borrow_data().id().to_string(),
        "title": node.borrow_data().title().to_string(),
        "url": node.borrow_data().url(),
        "children": node
            .children()
            .map(|n| dfs_recursive(&n))
            .collect::<Vec<_>>(),
    })
}

fn parse_json_to_tree_item(contents: String) -> BrowserBookmarkTreeNode {
    serde_json::from_str::<BrowserBookmarkTreeNode>(&contents).expect("Failed to parse JSON")
}

pub fn create_new_tree(title: &str) -> HotNode<NodeData> {
    let data = NodeData::Folder(FolderData::new(title));
    HotNode::new_tree(data)
}

/// Parse json String to tree
pub fn create_tree_from_json(contents: String) -> Option<HotNode<NodeData>> {
    let tree_item = parse_json_to_tree_item(contents);
    // TODO don't use unwrap
    let root_data = NodeData::new_folder(&tree_item.id, &tree_item.title);
    let root = HotNode::new_tree(root_data);
    create_node_recursive(&root, &tree_item);
    // TODO fix this
    // rootが二重に入ってしまうので、とりあえずfirst_childを返す
    root.first_child()
}

// Create node recursively
fn create_node_recursive(node: &HotNode<NodeData>, tree_item: &BrowserBookmarkTreeNode) {
    let node_data = match &tree_item.url {
        Some(url) => NodeData::new_bookmark(&tree_item.id, &tree_item.title, url),
        None => NodeData::new_folder(&tree_item.id, &tree_item.title),
    };
    let new_node = node.create_as_last_child(node_data);
    tree_item
        .children
        .iter()
        .for_each(|item| create_node_recursive(&new_node, item));
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use tempfile::NamedTempFile;

    use crate::{
        file::{read_file_to_string, write_json_to_file},
        new_bookmark_node_data, new_folder_node_data,
    };

    use super::*;

    struct TestTree {
        root: HotNode<NodeData>,
        root_node_data: NodeData,
        // b1_node_data: NodeData,
        // f1_node_data: NodeData,
        // b2_node_data: NodeData,
        b3_node_data: NodeData,
        // f2_node_data: NodeData,
    }

    // Create tree structure for test
    // root
    // | - b1
    // | - f1
    //    | - b2
    //      | - b3
    //    | - f2
    //      | - b4
    // | - f3
    //    | - b5
    //      | - b6
    //      | - b7
    fn create_test_tree() -> TestTree {
        let r = new_folder_node_data!("root");
        let b1 = new_bookmark_node_data!("b1", "http://b1.com");
        let b2 = new_bookmark_node_data!("b2", "http://b2.com");
        let b3 = new_bookmark_node_data!("b3", "http://b3.com");
        let b4 = new_bookmark_node_data!("b4", "http://b4.com");
        let b5 = new_bookmark_node_data!("b5", "http://b5.com");
        let b6 = new_bookmark_node_data!("b6", "http://b6.com");
        let b7 = new_bookmark_node_data!("b7", "http://b7.com");
        let f1 = new_folder_node_data!("f1");
        let f2 = new_folder_node_data!("f2");
        let f3 = new_folder_node_data!("f3");

        // create tree
        let root = HotNode::new_tree(r.clone());
        // children of root node
        let _b1_node = root.create_as_last_child(b1.clone());
        let f1_node = root.create_as_last_child(f1.clone());
        let f3_node = root.create_as_last_child(f3.clone());
        // children of f1 node
        let b2_node = f1_node.create_as_last_child(b2.clone());
        let f2_node = f1_node.create_as_last_child(f2.clone());
        // children of b2 node
        let _b3_node = b2_node.create_as_last_child(b3.clone());
        // children of f2 node
        let _b4_node = f2_node.create_as_last_child(b4.clone());
        // children of f3 node
        let b5_node = f3_node.create_as_last_child(b5.clone());
        // children of b5 node
        let _b6_node = b5_node.create_as_last_child(b6.clone());
        let _b7_node = b5_node.create_as_last_child(b7.clone());

        TestTree {
            root,
            root_node_data: r,
            // b1_node_data: b1,
            // f1_node_data: f1,
            // b2_node_data: b2,
            b3_node_data: b3,
            // f2_node_data: f2,
        }
    }

    #[test]
    fn test_tree_model() {
        let test_tree = create_test_tree();
        // let p = test_tree.root.debug_pretty_print();
        // println!("{:?}", p);

        let root = test_tree.root.plain();
        assert!(root.borrow_data().is_folder());
        assert!(!root.borrow_data().is_bookmark());
        assert_eq!(root.num_children(), 3);

        // find root by id
        let node = root.find_by_id(test_tree.root_node_data.id());
        assert!(node.is_some());
        assert_eq!(node.unwrap().borrow_data().title(), "root");

        // find bookmark3 data by id
        let node = root.find_by_id(test_tree.b3_node_data.id());
        assert!(node.is_some());
        assert_eq!(node.unwrap().borrow_data().title(), "b3");
    }

    #[test]
    fn test_edit_data() {
        let test_tree = create_test_tree();
        let root = test_tree.root.plain();
        let node = root.find_by_id(test_tree.b3_node_data.id());
        assert!(node.is_some());
        node.unwrap()
            .borrow_data_mut()
            .set_title("bookmark3-new-title".to_string());
        let node = root.find_by_id(test_tree.b3_node_data.id());
        assert_eq!(node.unwrap().borrow_data().title(), "bookmark3-new-title");
    }

    #[test]
    fn test_to_json() -> anyhow::Result<()> {
        let test_tree = create_test_tree();
        let root = test_tree.root.plain();
        let json_output = dfs_recursive(&root);
        // println!("{}", serde_json::to_string_pretty(&json_output).unwrap());

        let temp_file = NamedTempFile::new()?;
        let file_path = temp_file.path();

        write_json_to_file(file_path, &json_output)?;

        // read tmp file
        let contents = read_file_to_string(file_path)?;

        // parse json
        let parsed_json: serde_json::Value = serde_json::from_str(&contents)?;

        // compare original json
        assert_eq!(
            parsed_json, json_output,
            "Written JSON does not match expected output"
        );
        Ok(())
    }

    #[test]
    fn test_from_json() {
        let data_dir = PathBuf::from(env!("CARGO_MANIFEST_DIR"))
            .join("tests")
            .join("assets");
        let file_path = data_dir.join("tree.json");
        let contents = read_file_to_string(&file_path).unwrap();
        let root = create_tree_from_json(contents);
        if let Some(r) = root {
            // find b4
            let id = Id::try_from("01JK943R27GCKK5CPY2K8HGKST").unwrap();
            let n = r.find_by_id(&id);
            assert!(n.is_some());
            let data = n.unwrap().borrow_data().clone();
            assert!(data.is_bookmark());
            assert_eq!(data.title(), "b4");
            assert_eq!(data.url(), Some("http://b4.com".into()));
            // let p = r.debug_pretty_print();
            // println!("{:?}", p);
        }
    }
}

// let v = root
//   .depth_first_traverse()
//   .map(|ev| ev.as_value().clone())
//   .map(|node| node.borrow_data().clone())
//   .collect::<Vec<_>>();
// println!("{:?}", v);
// let mut traverser = root.depth_first_traverse();

// for dft_event in traverser {
//     match dft_event {
//         DftEvent::Open(node) => {
//             let data = node.borrow_data().clone();
//             if let Ok(s) = serde_json::to_string::<NodeData>(&data) {
//                 println!("Open: {}", s);
//             }
//         }
//         DftEvent::Close(_node) => {
//             // let data = node.borrow_data().clone();
//             // if let Ok(s) = serde_json::to_string::<NodeData>(&data) {
//             //     println!("Close: {}", s);
//             // }
//         }
//     }
// }
// pub trait GetNodeData {
//     fn is_bookmark(&self) -> bool;
//     fn is_folder(&self) -> bool;
// }

// impl GetNodeData for Node<NodeData> {
//     fn is_bookmark(&self) -> bool {
//         self.borrow_data().is_bookmark()
//     }

//     fn is_folder(&self) -> bool {
//         self.borrow_data().is_folder()
//     }
// }

// impl GetNodeData for HotNode<NodeData> {
//     fn is_bookmark(&self) -> bool {
//         self.borrow_data().is_bookmark()
//     }

//     fn is_folder(&self) -> bool {
//         self.borrow_data().is_folder()
//     }
// }
