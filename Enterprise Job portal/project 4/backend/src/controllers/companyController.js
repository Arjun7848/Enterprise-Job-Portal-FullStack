import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const getAllCompanies = async (req, res) => {
  const { search, industry } = req.query;
  try {
    let query = `
      SELECT c.*, 
        (SELECT AVG(rating) FROM reviews WHERE company_id = c.id) as avg_rating,
        (SELECT COUNT(*) FROM jobs WHERE company_id = c.id) as open_jobs
      FROM companies c WHERE 1=1
    `;
    const params = [];
    if (search) {
      query += ' AND c.name LIKE ?';
      params.push(`%${search}%`);
    }
    if (industry) {
      query += ' AND c.industry = ?';
      params.push(industry);
    }
    const companies = await db.all(query, params);
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching companies', error: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  const { id } = req.params;
  try {
    const company = await db.get(`
      SELECT c.*, 
        (SELECT AVG(rating) FROM reviews WHERE company_id = c.id) as avg_rating,
        (SELECT COUNT(*) FROM reviews WHERE company_id = c.id) as review_count
      FROM companies c WHERE c.id = ?
    `, [id]);

    if (!company) return res.status(404).json({ message: 'Company not found' });

    const jobs = await db.all('SELECT * FROM jobs WHERE company_id = ? ORDER BY posted_at DESC', [id]);
    const reviews = await db.all(`
      SELECT r.*, u.name as user_name 
      FROM reviews r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.company_id = ? 
      ORDER BY r.created_at DESC
    `, [id]);

    res.json({ ...company, jobs, reviews });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching company details', error: error.message });
  }
};

export const createReview = async (req, res) => {
  const { company_id, rating, comment } = req.body;
  const user_id = req.user.id;
  try {
    await db.run(
      'INSERT INTO reviews (company_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [company_id, user_id, rating, comment]
    );
    res.status(201).json({ message: 'Review submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting review', error: error.message });
  }
};

export const createCompany = async (req, res) => {
    const { name, description, website, location, logo, industry, employee_count, founded_at, culture } = req.body;
    const recruiter_id = req.user.id;
    try {
        const result = await db.run(
            `INSERT INTO companies (name, description, website, location, logo, industry, employee_count, founded_at, culture, recruiter_id) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, description, website, location, logo, industry, employee_count, founded_at, culture, recruiter_id]
        );
        res.status(201).json({ message: 'Company profile created', companyId: result.lastID });
    } catch (error) {
        res.status(500).json({ message: 'Error creating company', error: error.message });
    }
};
