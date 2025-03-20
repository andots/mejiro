// This code is based on https://docs.rs/serde_indextree/latest/src/serde_indextree/lib.rs.html

use indextree::{Arena, NodeId};
use serde::ser::{SerializeSeq, Serializer};
use serde::Serialize;

use crate::error::Error;

/// Convenience wrapper struct for serializing a node and its descendants.
#[derive(Serialize)]
pub struct NestedNode<'a, T: Serialize> {
    /// id of the node from NodeId.into()
    index: usize,
    #[serde(flatten)]
    data: &'a T,
    #[serde(skip_serializing_if = "Option::is_none")]
    children: Option<SiblingNodes<'a, T>>,
}

impl<'a, T: Serialize> NestedNode<'a, T> {
    /// Attempt to create a new `NestedNode` from an `Arena` and a `NodeId`.
    pub fn try_new(arena: &'a Arena<T>, node_id: NodeId) -> Result<Self, Error> {
        let node = arena
            .get(node_id)
            .ok_or(Error::NestedNode(node_id.into()))?;
        Ok(NestedNode {
            index: node_id.into(),
            data: node.get(),
            children: node
                .first_child()
                .map(|first| SiblingNodes::new(first, arena)),
        })
    }
}

/// Convenience wrapper struct for serializing a node and its siblings.
pub struct SiblingNodes<'a, T: Serialize> {
    first: NodeId,
    arena: &'a Arena<T>,
}

/// Serialize the children of a node.
impl<'a, T: Serialize> SiblingNodes<'a, T> {
    pub fn new(node_id: NodeId, arena: &'a Arena<T>) -> Self {
        SiblingNodes {
            first: node_id,
            arena,
        }
    }
}

impl<T: Serialize> Serialize for SiblingNodes<'_, T> {
    fn serialize<S: Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        let mut seq = serializer.serialize_seq(None)?;
        for node_id in self.first.following_siblings(self.arena) {
            let node = NestedNode::try_new(self.arena, node_id)
                .map_err(|_| serde::ser::Error::custom(format!("Node not found: {:?}", node_id)))?;
            seq.serialize_element(&node)?;
        }
        seq.end()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    use indextree::{macros::tree, Arena};

    #[derive(Serialize)]
    struct Data {
        data_id: i32,
        name: String,
    }

    impl Data {
        fn new(id: i32, name: impl Into<String>) -> Self {
            Self {
                data_id: id,
                name: name.into(),
            }
        }
    }

    #[test]
    fn test_serialize() {
        let mut arena = Arena::new();
        let root = Data::new(1, "root");
        let root_id = tree!(
            &mut arena,
            root => {
                Data::new(2, "child1"),
                Data::new(3, "child2") => {
                    Data::new(4, "grandchild1"),
                    Data::new(5, "grandchild2"),
                },
            }
        );
        let a = NestedNode::try_new(&arena, root_id).unwrap();
        let json = serde_json::to_string_pretty(&a).unwrap();
        println!("{}", json);
    }
}
