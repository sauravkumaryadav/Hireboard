import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

import applicationRoutes from './routes/application.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// DB connection
connectDB();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Test route
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to my API!', status: 'ok' });
});

//  Mount application routes
app.use('/applications', applicationRoutes);

// Start server
app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server running on port", PORT);
  } else {
    console.log("Server error", error);
  }
});