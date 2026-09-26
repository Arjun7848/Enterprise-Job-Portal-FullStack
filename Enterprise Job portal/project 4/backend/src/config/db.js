import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { seedDatabase } from './seedData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, '../../database.sqlite');

let dbPromise = null;

export const initDB = async () => {
  if (dbPromise) return dbPromise;
  dbPromise = (async () => {
    const db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

  // Create tables
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('seeker', 'recruiter', 'admin')) NOT NULL,
      skills TEXT,
      bio TEXT,
      video_resume_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      website TEXT,
      location TEXT,
      logo TEXT,
      industry TEXT,
      employee_count TEXT,
      founded_at TEXT,
      culture TEXT,
      recruiter_id INTEGER,
      FOREIGN KEY (recruiter_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT CHECK(type IN ('full-time', 'part-time', 'contract', 'internship')) NOT NULL,
      location TEXT NOT NULL,
      salary_range TEXT,
      company_id INTEGER,
      recruiter_id INTEGER,
      requirements TEXT,
      posted_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (recruiter_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS applications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER,
      seeker_id INTEGER,
      status TEXT CHECK(status IN ('pending', 'reviewed', 'shortlisted', 'rejected', 'accepted')) DEFAULT 'pending',
      resume_url TEXT,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (job_id) REFERENCES jobs(id),
      FOREIGN KEY (seeker_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS resumes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      content JSON,
      is_default INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS blogs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      author_id INTEGER,
      thumbnail TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (author_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company_id INTEGER,
      user_id INTEGER,
      rating INTEGER CHECK(rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (company_id) REFERENCES companies(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      plan_name TEXT,
      status TEXT CHECK(status IN ('active', 'expired', 'cancelled')),
      end_date DATETIME,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      sender_id INTEGER,
      receiver_id INTEGER,
      message TEXT NOT NULL,
      is_read INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (sender_id) REFERENCES users(id),
      FOREIGN KEY (receiver_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS interviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      application_id INTEGER,
      job_id INTEGER,
      seeker_id INTEGER,
      recruiter_id INTEGER,
      scheduled_at DATETIME NOT NULL,
      duration INTEGER DEFAULT 30,
      meeting_link TEXT,
      status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
      feedback TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (application_id) REFERENCES applications(id),
      FOREIGN KEY (job_id) REFERENCES jobs(id),
      FOREIGN KEY (seeker_id) REFERENCES users(id),
      FOREIGN KEY (recruiter_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'INR',
      payment_id TEXT UNIQUE,
      order_id TEXT,
      status TEXT CHECK(status IN ('pending', 'captured', 'failed')) DEFAULT 'pending',
      plan_name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      instructor TEXT,
      price REAL DEFAULT 0,
      thumbnail TEXT,
      category TEXT,
      duration TEXT,
      lessons_count INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS enrollments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      course_id INTEGER,
      user_id INTEGER,
      progress INTEGER DEFAULT 0,
      enrolled_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (course_id) REFERENCES courses(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT CHECK(type IN ('info', 'success', 'warning', 'error')) DEFAULT 'info',
      is_read INTEGER DEFAULT 0,
      link TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `);

  console.log('SQLite Database initialized');
  
  // Seed initial Admin (Password: admin123)
  const bcrypt = await import('bcrypt');
  const hashedAdminPass = await bcrypt.default.hash('admin123', 10);
  await db.run(
    'INSERT OR IGNORE INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    ['System Admin', 'admin@jobportal.com', hashedAdminPass, 'admin']
  );
  console.log('Seed: Admin user checked/created');

await seedDatabase(db);

return db;
  })();
  return dbPromise;
};
