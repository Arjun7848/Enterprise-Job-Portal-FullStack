import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

import { initDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import interviewRoutes from './routes/interviewRoutes.js';
import subscriptionRoutes from './routes/subscriptionRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import atsRoutes from './routes/atsRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import companyRoutes from './routes/companyRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import { Server } from 'socket.io';
import { createServer } from 'http';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: '*',
  }
});
const PORT = process.env.PORT || 5000;

// Socket.io logic
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('join', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User joined: user_${userId}`);
  });

  socket.on('send_message', (data) => {
    // data: { sender_id, receiver_id, message }
    io.to(`user_${data.receiver_id}`).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Initialize Database
let db;
initDB().then(database => {
  db = database;
}).catch(err => {
  console.error('Failed to initialize database:', err);
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads', express.static(join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/ats', atsRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/profile', profileRoutes);

// Root Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Job Portal API' });
});

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start Server
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
