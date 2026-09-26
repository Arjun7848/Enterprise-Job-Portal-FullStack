import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const getAllCourses = async (req, res) => {
  const { category } = req.query;
  try {
    let query = 'SELECT * FROM courses WHERE 1=1';
    const params = [];
    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    query += ' ORDER BY created_at DESC';
    const courses = await db.all(query, params);
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses', error: error.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await db.get('SELECT * FROM courses WHERE id = ?', [id]);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    
    // Check if user is enrolled
    let enrollment = null;
    if (req.user) {
        enrollment = await db.get('SELECT * FROM enrollments WHERE course_id = ? AND user_id = ?', [id, req.user.id]);
    }
    
    res.json({ ...course, enrolled: !!enrollment, progress: enrollment?.progress || 0 });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course', error: error.message });
  }
};

export const enrollInCourse = async (req, res) => {
  const { courseId } = req.body;
  const userId = req.user.id;
  try {
    // Check if already enrolled
    const existing = await db.get('SELECT id FROM enrollments WHERE course_id = ? AND user_id = ?', [courseId, userId]);
    if (existing) return res.status(400).json({ message: 'Already enrolled' });

    await db.run(
      'INSERT INTO enrollments (course_id, user_id) VALUES (?, ?)',
      [courseId, userId]
    );
    res.status(201).json({ message: 'Enrolled successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error enrolling in course', error: error.message });
  }
};

export const getUserEnrollments = async (req, res) => {
  try {
    const enrollments = await db.all(`
      SELECT e.*, c.title, c.thumbnail, c.instructor 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ?
    `, [req.user.id]);
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};

export const createCourse = async (req, res) => {
    const { title, description, instructor, price, category, duration, lessons_count, thumbnail } = req.body;
    try {
        const result = await db.run(
            `INSERT INTO courses (title, description, instructor, price, category, duration, lessons_count, thumbnail) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [title, description, instructor, price, category, duration, lessons_count, thumbnail]
        );
        res.status(201).json({ message: 'Course created successfully', courseId: result.lastID });
    } catch (error) {
        res.status(500).json({ message: 'Error creating course', error: error.message });
    }
};
