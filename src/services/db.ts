import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('phone_secretary.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      
      CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        relationship_context TEXT,
        bio_summary TEXT,
        voice_id TEXT, 
        last_met_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS problems (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS interaction_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL, -- 'audio' or 'image'
        summary TEXT,
        raw_text TEXT,
        file_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS action_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        description TEXT NOT NULL,
        owner_contact_id INTEGER, -- NULL for 'me', otherwise foreign key
        problem_id INTEGER,
        due_date DATETIME,
        urgency_level TEXT, -- 'small' (2h), 'big' (1d)
        is_completed BOOLEAN DEFAULT 0,
        notification_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_contact_id) REFERENCES contacts(id),
        FOREIGN KEY (problem_id) REFERENCES problems(id)
      );

      -- Join table for people involved in problems
      CREATE TABLE IF NOT EXISTS problem_contacts (
        problem_id INTEGER,
        contact_id INTEGER,
        role TEXT,
        PRIMARY KEY (problem_id, contact_id),
        FOREIGN KEY (problem_id) REFERENCES problems(id),
        FOREIGN KEY (contact_id) REFERENCES contacts(id)
      );
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization failed:', error);
  }
};

export const getDB = () => db;

// Helper to reset DB for testing
export const resetDatabase = async () => {
    await db.execAsync(`
        DROP TABLE IF EXISTS problem_contacts;
        DROP TABLE IF EXISTS action_items;
        DROP TABLE IF EXISTS interaction_logs;
        DROP TABLE IF EXISTS problems;
        DROP TABLE IF EXISTS contacts;
    `);
    await initDatabase();
}
