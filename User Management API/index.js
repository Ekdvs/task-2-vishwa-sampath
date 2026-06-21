import dotenv from 'dotenv'
import connectDB from './src/config/db.js';
import app from './src/app.js';

const PORT = process.env.PORT || 5000;

dotenv.config();
/**
 * Boots the application: connects to MongoDB first, then
 * starts the HTTP server. If the DB connection fails, the
 * process exits (handled inside connectDB) before the server
 * ever starts listening.
 */
const startServer = async () => {
  await connectDB();

  const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });

  // Gracefully handle unhandled promise rejections instead of crashing
  process.on('unhandledRejection', (err) => {
    console.error(`Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
  });
};

startServer();