import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const getNotifications = async (req, res) => {
  try {
    const notifications = await db.all(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

export const markAsRead = async (req, res) => {
  const { id } = req.params;
  try {
    await db.run('UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?', [id, req.user.id]);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

export const createNotification = async (userId, title, message, type = 'info', link = '') => {
  try {
    const result = await db.run(
      'INSERT INTO notifications (user_id, title, message, type, link) VALUES (?, ?, ?, ?, ?)',
      [userId, title, message, type, link]
    );
    return result.lastID;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
