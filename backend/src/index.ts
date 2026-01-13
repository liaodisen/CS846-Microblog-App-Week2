import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import logger from './config/logger.js';
import { requestLogger, errorLogger } from './middleware/logger.js';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import postRoutes from './routes/postRoutes.js';
import replyRoutes from './routes/replyRoutes.js';
import likeRoutes from './routes/likeRoutes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);
app.use(errorLogger);

// Serve uploaded files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', authMiddleware, postRoutes);
app.use('/api/replies', authMiddleware, replyRoutes);
app.use('/api/likes', authMiddleware, likeRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Error handler
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
});

export default app;
