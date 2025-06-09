const express = require('express');
const router = express.Router();
const ExpenseController = require('../controller/ExpenseController');
const expenseController = new ExpenseController();

// GET all expenses with filtering
router.get('/', expenseController.getAllExpenses);

// POST new expense
router.post('/', expenseController.addNewExpense);

// DELETE expense
router.delete('/:id', expenseController.deleteExpense);

// GET analytics data
router.get('/analytics', expenseController.getAnalytics);

module.exports = router;
