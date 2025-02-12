use derive_new::new;
use std::marker::PhantomData;

use ulid::Ulid;

use crate::error::AppError;

#[derive(new, Debug, Clone, Copy, PartialEq)]
pub struct Id<T> {
    pub value: Ulid,
    _marker: PhantomData<T>,
}

impl<T> Id<T> {
    pub fn generate() -> Id<T> {
        Id::new(Ulid::new())
    }
}

impl<T> TryFrom<String> for Id<T> {
    type Error = AppError;
    fn try_from(value: String) -> Result<Self, Self::Error> {
        Ulid::from_string(&value)
            .map(|id| Self::new(id))
            .map_err(AppError::UlidDecode)
    }
}

impl<T> TryFrom<&str> for Id<T> {
    type Error = AppError;
    fn try_from(value: &str) -> Result<Self, Self::Error> {
        Ulid::from_string(value)
            .map(|id| Self::new(id))
            .map_err(AppError::UlidDecode)
    }
}

impl<T> std::fmt::Display for Id<T> {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        let id = self.value.to_string();
        write!(f, "{}", id)?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {

    use super::*;

    #[derive(Debug)]
    struct Test {}

    #[test]
    fn test_to_string() {
        let id: Id<Test> = Id::generate();
        assert_eq!(id.to_string().len(), 26);
    }

    #[test]
    fn test_decode_error_invalid_length() {
        let wrong_str = "xxx";
        let result = Id::<Test>::try_from(wrong_str);
        assert!(result.is_err());
        let e = result.unwrap_err();
        println!("{:?}", e);
        assert!(matches!(e, AppError::UlidDecode(_)));
    }

    #[test]
    fn test_decode_error_invalid_char() {
        let wrong_str = "01HX4SKJMESZVJQ4D2RQNVR3K&";
        let result = Id::<Test>::try_from(wrong_str);
        assert!(result.is_err());
        let e = result.unwrap_err();
        println!("{:?}", e);
        assert!(matches!(e, AppError::UlidDecode(_)));
    }
}
