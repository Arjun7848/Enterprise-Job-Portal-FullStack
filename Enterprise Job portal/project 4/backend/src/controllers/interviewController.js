import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const scheduleInterview = async (req, res) => {
  const { application_id, job_id, seeker_id, scheduled_at, duration, meeting_link } = req.body;
  const recruiter_id = req.user.id;
  try {
    const result = await db.run(
      `INSERT INTO interviews (application_id, job_id, seeker_id, recruiter_id, scheduled_at, duration, meeting_link) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [application_id, job_id, seeker_id, recruiter_id, scheduled_at, duration, meeting_link]
    );

    // Update application status to shortlisted automatically when interview is scheduled
    await db.run('UPDATE applications SET status = ? WHERE id = ?', ['shortlisted', application_id]);

    res.status(201).json({ message: 'Interview scheduled successfully', interviewId: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Error scheduling interview', error: error.message });
  }
};

export const getSeekerInterviews = async (req, res) => {
  try {
    const interviews = await db.all(
      `SELECT i.*, j.title as job_title, u.name as recruiter_name 
       FROM interviews i 
       JOIN jobs j ON i.job_id = j.id 
       JOIN users u ON i.recruiter_id = u.id 
       WHERE i.seeker_id = ? 
       ORDER BY i.scheduled_at ASC`,
      [req.user.id]
    );
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
};

export const getRecruiterInterviews = async (req, res) => {
  try {
    const interviews = await db.all(
      `SELECT i.*, j.title as job_title, u.name as seeker_name 
       FROM interviews i 
       JOIN jobs j ON i.job_id = j.id 
       JOIN users u ON i.seeker_id = u.id 
       WHERE i.recruiter_id = ? 
       ORDER BY i.scheduled_at ASC`,
      [req.user.id]
    );
    res.json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews', error: error.message });
  }
};

export const updateInterviewStatus = async (req, res) => {
  const { id } = req.params;
  const { status, feedback } = req.body;
  try {
    await db.run(
      'UPDATE interviews SET status = ?, feedback = ? WHERE id = ?',
      [status, feedback, id]
    );
    res.json({ message: 'Interview updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating interview', error: error.message });
  }
};
