import { initDB } from '../config/db.js';

let db;
initDB().then(database => db = database);

export const getMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const currentUserId = req.user.id;
  try {
    const messages = await db.all(`
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?) 
      ORDER BY created_at ASC
    `, [currentUserId, otherUserId, otherUserId, currentUserId]);
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching messages', error: error.message });
  }
};

export const getConversations = async (req, res) => {
  const currentUserId = req.user.id;
  try {
    // Get unique users who have exchanged messages with current user
    const conversations = await db.all(`
      SELECT DISTINCT 
        CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END as user_id,
        u.name,
        u.role
      FROM messages m
      JOIN users u ON u.id = (CASE WHEN sender_id = ? THEN receiver_id ELSE sender_id END)
      WHERE sender_id = ? OR receiver_id = ?
    `, [currentUserId, currentUserId, currentUserId, currentUserId]);
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching conversations', error: error.message });
  }
};

export const sendMessage = async (req, res) => {
  const { receiver_id, message } = req.body;
  const sender_id = req.user.id;
  try {
    const result = await db.run(
      'INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)',
      [sender_id, receiver_id, message]
    );
    res.status(201).json({ id: result.lastID, sender_id, receiver_id, message, created_at: new Date() });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};
