use redb::{Database, ReadableTable};

use crate::{error::Error, FAVICON_TABLE};

pub(crate) async fn find(
    db: &Database,
    key: &str,
) -> Result<Option<redb::AccessGuard<'static, &'static [u8]>>, Error> {
    let read_txn = db.begin_read()?;
    let table = read_txn.open_table(FAVICON_TABLE)?;
    let value = table.get(key)?;
    Ok(value)
}

pub(crate) async fn keys(db: &Database) -> Result<Vec<String>, Error> {
    let read_txn = db.begin_read()?;
    let table = read_txn.open_table(FAVICON_TABLE)?;
    let iter = table.iter()?;
    let keys = iter
        .filter_map(|r| r.ok())
        .map(|r| r.0.value().to_string())
        .collect::<Vec<_>>();

    Ok(keys)
}

pub(crate) async fn remove(db: &Database, key: &str) -> Result<(), Error> {
    let write_txn = db.begin_write()?;
    {
        let mut table = write_txn.open_table(FAVICON_TABLE)?;
        table.remove(key)?;
    }
    write_txn.commit()?;
    Ok(())
}

pub(crate) async fn insert(db: &Database, key: &str, value: &[u8]) -> Result<(), Error> {
    let write_txn = db.begin_write()?;
    {
        let mut table = write_txn.open_table(FAVICON_TABLE)?;
        table.insert(key, value)?;
    }
    write_txn.commit()?;
    Ok(())
}
