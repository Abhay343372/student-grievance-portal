const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Validate Environment Variables
if (!process.env.JWT_SECRET) {
  console.error("WARNING: JWT_SECRET is not defined. Authentication will fail.");
}

// Connect to database
connectDB();

const app = express();

// Middleware
// Enable CORS for frontend requests
app.use(cors({
  origin: '*', // In production, replace with frontend URL
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging Middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} request to ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));

// Basic route for testing
app.get('/', (req, res) => {
  res.send('API is running securely...');
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err);
  res.status(500).json({ message: err.message || 'Internal Server Error' });
});

// Define PORT
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});
