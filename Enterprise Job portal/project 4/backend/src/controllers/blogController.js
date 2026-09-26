import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const createBlog = async (req, res) => {
  const { title, content, thumbnail } = req.body;
  const author_id = req.user.id;
  try {
    const result = await db.run(
      'INSERT INTO blogs (title, content, author_id, thumbnail) VALUES (?, ?, ?, ?)',
      [title, content, author_id, thumbnail]
    );
    res.status(201).json({ message: 'Article published successfully', blogId: result.lastID });
  } catch (error) {
    res.status(500).json({ message: 'Error publishing article', error: error.message });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await db.all(`
      SELECT b.*, u.name as author_name 
      FROM blogs b 
      JOIN users u ON b.author_id = u.id 
      ORDER BY b.created_at DESC
    `);
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
};

export const getBlogById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await db.get(`
      SELECT b.*, u.name as author_name 
      FROM blogs b 
      JOIN users u ON b.author_id = u.id 
      WHERE b.id = ?
    `, [id]);
    if (!blog) return res.status(404).json({ message: 'Article not found' });
    res.json(blog);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
};

export const deleteBlog = async (req, res) => {
  const { id } = req.params;
  try {
    // Only author or admin can delete (middleware handles admin, here we check author)
    const blog = await db.get('SELECT author_id FROM blogs WHERE id = ?', [id]);
    if (req.user.role !== 'admin' && blog.author_id !== req.user.id) {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    await db.run('DELETE FROM blogs WHERE id = ?', [id]);
    res.json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
};
