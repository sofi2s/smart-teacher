const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = process.pkg 
  ? path.join(path.dirname(process.execPath), 'database.sqlite')
  : path.join(__dirname, 'database.sqlite');
let dbInstance = null;

async function initDB() {
  const SQL = await initSqlJs();
  
  let db;
  if (fs.existsSync(DB_PATH)) {
    const buffer = fs.readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('admin','student')),
      university_id TEXT,
      department TEXT
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name TEXT NOT NULL,
      university_id TEXT UNIQUE NOT NULL,
      department TEXT NOT NULL,
      semester TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS student_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      grade REAL NOT NULL,
      absences INTEGER DEFAULT 0,
      participation INTEGER DEFAULT 0,
      semester TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS lessons (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      subject TEXT NOT NULL,
      pdf_url TEXT,
      video_url TEXT,
      content TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      subject TEXT NOT NULL,
      question TEXT NOT NULL,
      option_a TEXT NOT NULL,
      option_b TEXT NOT NULL,
      option_c TEXT NOT NULL,
      option_d TEXT NOT NULL,
      correct_option TEXT NOT NULL CHECK(correct_option IN ('a','b','c','d')),
      difficulty TEXT NOT NULL CHECK(difficulty IN ('easy','medium','hard'))
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS test_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      score REAL NOT NULL,
      total INTEGER NOT NULL,
      level TEXT,
      mistakes_json TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      message TEXT NOT NULL,
      type TEXT DEFAULT 'info',
      created_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    );
  `);

  dbInstance = db;
  saveDB();
  return db;
}

function saveDB() {
  if (dbInstance) {
    const data = dbInstance.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(DB_PATH, buffer);
  }
}

function getDB() {
  return dbInstance;
}

// Helper: run a query and return all results as array of objects
function dbAll(sql, params = []) {
  const stmt = dbInstance.prepare(sql);
  if (params.length) stmt.bind(params);
  const results = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject());
  }
  stmt.free();
  return results;
}

// Helper: run a query and return first result as object
function dbGet(sql, params = []) {
  const results = dbAll(sql, params);
  return results.length > 0 ? results[0] : null;
}

// Helper: run an insert/update/delete and return info
function dbRun(sql, params = []) {
  dbInstance.run(sql, params);
  const lastId = dbInstance.exec("SELECT last_insert_rowid()")[0]?.values[0]?.[0];
  const changes = dbInstance.getRowsModified();
  saveDB();
  return { lastInsertRowid: lastId, changes };
}

module.exports = { initDB, getDB, saveDB, dbAll, dbGet, dbRun, DB_PATH };
