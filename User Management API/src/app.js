import express from 'express'
import apiRoutes from './routes/healthRouter.js'
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import cors from 'cors'

const app = express();

// --- Global Middlewares ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Root route ---
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'User Management API is running',
    data: { docs: '/api/v1/health' },
  });
});

// --- API Routes ---
app.use('/api/v1', apiRoutes);

// --- 404 Handler ---
app.use(notFound);

// --- Global Error Handler (must be last) ---
app.use(errorHandler);

export default app