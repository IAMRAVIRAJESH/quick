const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const expenseRoutes = require('./routes/Expense');
const { connectDB } = require('./config/Database');
const { syncModels } = require('./models');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/expenses', expenseRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running!' });
});

const initializeApp = async () => {
  try {
    await connectDB();

    await syncModels();

    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Error initializing application:', error);
    process.exit(1);
  }
};

initializeApp();

module.exports = { app };
