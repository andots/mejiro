use crate::{error::CoreError, serialize::NestedNode};

use super::Bookmarks;

/// Converting to JSON
impl Bookmarks {
    /// Arena to JSON string
    pub fn to_json(&self) -> Result<String, CoreError> {
        Ok(serde_json::to_string(&self.arena)?)
    }

    /// Arena to nested JSON string (frontend friendly)
    pub fn to_nested_json(&self, index: usize) -> Result<String, CoreError> {
        let node_id = self
            .find_node_id_by_index(index)
            .ok_or(CoreError::NodeNotFound(index))?;
        let value = NestedNode::try_new(&self.arena, node_id)?;
        Ok(serde_json::to_string(&value)?)
    }

    /// Arena to nested JSON string (frontend friendly) with pretty format
    pub fn to_nested_json_pretty(&self, index: usize) -> Result<String, CoreError> {
        let node_id = self
            .find_node_id_by_index(index)
            .ok_or(CoreError::NodeNotFound(index))?;
        let value = NestedNode::try_new(&self.arena, node_id)?;
        Ok(serde_json::to_string_pretty(&value)?)
    }
}
