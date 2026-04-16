// Entry point - Express server setup
// TODO: Import and configure Express, middleware, routes, and start server
import express from 'express'
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import helmet from 'helmet'  // Security headers
import cors from 'cors' // Cross-origin resource sharing
import morgan from 'morgan' // HTTP request logging

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());// Middleware to parse JSON data

// 1. Our "Temporary Database"
let users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
];
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to my API!', status: 'ok' })
})


app.post('/users', (req, res) => {
  const newUser = {
    id: users.length + 1,
    name: req.body.name
  };

  users.push(newUser);
  res.json({ message: "new user created", data: newUser });

})

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Successfully Running on port", PORT);
  }
  else {
    console.log("Error occurred, server can't start", error);
  }
})