import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase('offline.db')

export const initQueue = () =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS queue (id INTEGER PRIMARY KEY AUTOINCREMENT, type TEXT, payload TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
        )
      },
      reject,
      resolve
    )
  })

export const addQueueItem = (type, payload) =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('INSERT INTO queue (type, payload) values (?, ?)', [type, JSON.stringify(payload)])
      },
      reject,
      resolve
    )
  })

export const getQueueItems = () =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('SELECT * FROM queue ORDER BY created_at ASC', [], (_, { rows }) => resolve(rows._array))
      },
      reject
    )
  })

export const deleteQueueItem = (id) =>
  new Promise((resolve, reject) => {
    db.transaction(
      (tx) => {
        tx.executeSql('DELETE FROM queue WHERE id = ?', [id])
      },
      reject,
      resolve
    )
  })

