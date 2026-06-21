import express from 'express'
import userRouter from './userRouter.js';

const healthRouter =express.Router();

healthRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is healthy',
    data: { uptime: process.uptime(), timestamp: new Date().toISOString() },
  });
});

healthRouter.use('/users',userRouter)


export default healthRouter;