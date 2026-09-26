import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

// POST /api/applications — seeker only
export const applyToJob = async (req, res) => {
  const { job_id } = req.body;
  const seeker_id = req.user.id;
  try {
    // Check if already applied
    const existing = await db.get(
      'SELECT id FROM applications WHERE job_id = ? AND seeker_id = ?',
      [job_id, seeker_id]
    );
    if (existing) {
      return res.status(409).json({ message: 'You have already applied for this job.' });
    }

    const result = await db.run(
      'INSERT INTO applications (job_id, seeker_id) VALUES (?, ?)',
      [job_id, seeker_id]
    );
    res.status(201).json({ message: 'Application submitted successfully', applicationId: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error: error.message });
  }
};

// GET /api/applications/seeker — seeker only
export const getSeekerApplications = async (req, res) => {
  try {
    const applications = await db.all(
      `SELECT a.*, j.title as job_title, c.name as company_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN companies c ON j.company_id = c.id
       WHERE a.seeker_id = ?
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// GET /api/applications/recruiter — recruiter only
export const getRecruiterApplications = async (req, res) => {
  try {
    const applications = await db.all(
      `SELECT a.*, j.title as job_title, u.name as seeker_name, u.email as seeker_email
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.seeker_id = u.id
       WHERE j.recruiter_id = ?
       ORDER BY a.applied_at DESC`,
      [req.user.id]
    );
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error: error.message });
  }
};

// PATCH /api/applications/:id/status — recruiter only
export const updateApplicationStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const ALLOWED_STATUSES = ['pending', 'shortlisted', 'rejected'];
  if (!ALLOWED_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status. Must be one of: pending, shortlisted, rejected' });
  }

  try {
    // Ensure the application belongs to a job posted by this recruiter
    const app = await db.get(
      `SELECT a.id FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ? AND j.recruiter_id = ?`,
      [id, req.user.id]
    );
    if (!app) {
      return res.status(403).json({ message: 'Not authorized to update this application.' });
    }

    await db.run(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, id]
    );
    res.json({ message: 'Status updated', status });
  } catch (error) {
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
};
