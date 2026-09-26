import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

// POST /api/jobs — recruiter only
export const createJob = async (req, res) => {
  const { title, description, type, location, salary_range, company_id, requirements } = req.body;
  const recruiter_id = req.user.id;
  try {
    const result = await db.run(
      `INSERT INTO jobs (title, description, type, location, salary_range, company_id, recruiter_id, requirements)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, type, location, salary_range, company_id, recruiter_id, requirements]
    );
    res.status(201).json({ message: 'Job posted successfully', jobId: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Error posting job', error: error.message });
  }
};

// GET /api/jobs — public
export const getAllJobs = async (req, res) => {
  const { search, type, location, minSalary } = req.query;
  try {
    let query = 'SELECT j.*, c.name as company_name, c.logo as company_logo FROM jobs j LEFT JOIN companies c ON j.company_id = c.id WHERE 1=1';
    const params = [];

    if (search) {
      query += ' AND (j.title LIKE ? OR j.description LIKE ? OR c.name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    if (type && type !== 'all') {
      query += ' AND j.type = ?';
      params.push(type);
    }
    if (location) {
      query += ' AND j.location LIKE ?';
      params.push(`%${location}%`);
    }
    if (minSalary) {
      query += ' AND j.salary_range LIKE ?';
      params.push(`%${minSalary}%`);
    }

    query += ' ORDER BY j.posted_at DESC';
    const jobs = await db.all(query, params);
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching jobs', error: error.message });
  }
};

// GET /api/jobs/mine — recruiter only
export const getRecruiterJobs = async (req, res) => {
  const recruiter_id = req.user.id;
  try {
    const jobs = await db.all(
      `SELECT j.*, c.name as company_name,
              (SELECT COUNT(*) FROM applications a WHERE a.job_id = j.id) as application_count
       FROM jobs j
       LEFT JOIN companies c ON j.company_id = c.id
       WHERE j.recruiter_id = ?
       ORDER BY j.posted_at DESC`,
      [recruiter_id]
    );
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recruiter jobs', error: error.message });
  }
};

// GET /api/jobs/:id — public
export const getJobById = async (req, res) => {
  const { id } = req.params;
  try {
    const job = await db.get(
      'SELECT j.*, c.name as company_name, c.logo as company_logo, c.description as company_description FROM jobs j LEFT JOIN companies c ON j.company_id = c.id WHERE j.id = ?',
      [id]
    );
    if (!job) return res.status(404).json({ message: 'Job not found' });
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching job', error: error.message });
  }
};
