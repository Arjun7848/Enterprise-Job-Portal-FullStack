import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const getStats = async (req, res) => {
  try {
    const userCount = await db.get('SELECT COUNT(*) as count FROM users');
    const jobCount = await db.get('SELECT COUNT(*) as count FROM jobs');
    const appCount = await db.get('SELECT COUNT(*) as count FROM applications');
    const recruiterCount = await db.get("SELECT COUNT(*) as count FROM users WHERE role = 'recruiter'");
    
    res.json({
      users: userCount.count,
      jobs: jobCount.count,
      applications: appCount.count,
      recruiters: recruiterCount.count
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await db.all('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await db.all(`
      SELECT j.*, u.name as recruiter_name 
      FROM jobs j 
      JOIN users u ON j.recruiter_id = u.id 
      ORDER BY j.posted_at DESC
    `);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('DELETE FROM jobs WHERE id = ?', [id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting job', error: error.message });
  }
};
