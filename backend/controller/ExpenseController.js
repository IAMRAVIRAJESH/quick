const Expense = require('../models/Expense');
const { Op } = require('sequelize');

class ExpenseController {
  async getAllExpenses(req, res) {
    try {
      const { dateRange, categories, paymentModes } = req.query;

      // Build the WHERE clause for Sequelize
      const whereClause = {};

      // Date filtering
      if (dateRange && dateRange !== 'all') {
        const now = new Date();
        let filterDate = new Date(); // Initialize filterDate

        // Reset hours, minutes, seconds, milliseconds for accurate date comparisons
        filterDate.setHours(0, 0, 0, 0);

        switch (dateRange) {
          case 'thisMonth':
            filterDate = new Date(now.getFullYear(), now.getMonth(), 1);
            break;
          case 'last30':
            filterDate.setDate(now.getDate() - 30);
            break;
          case 'last90':
            filterDate.setDate(now.getDate() - 90);
            break;
          case 'today': // Added 'today' as a common use case
            filterDate = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate()
            );
            break;
          case 'thisWeek': // Added 'thisWeek'
            const day = now.getDay(); // 0 for Sunday, 1 for Monday, etc.
            filterDate = new Date(now.setDate(now.getDate() - day)); // Go to the start of the week (Sunday)
            filterDate.setHours(0, 0, 0, 0); // Reset time for start of day
            break;
          default:
            // If dateRange is not recognized, don't apply date filter
            break;
        }

        // Apply the date filter if filterDate was adjusted
        if (dateRange !== 'all' && dateRange !== undefined) {
          whereClause.date = {
            [Op.gte]: filterDate, // Greater than or equal to filterDate
          };
        }
      }

      // Category filtering
      if (categories) {
        const categoryArray = Array.isArray(categories)
          ? categories
          : [categories];
        whereClause.category = {
          [Op.in]: categoryArray, // Match any category in the array
        };
      }

      // Payment mode filtering
      if (paymentModes) {
        const paymentModeArray = Array.isArray(paymentModes)
          ? paymentModes
          : [paymentModes];
        whereClause.paymentMode = {
          [Op.in]: paymentModeArray, // Match any payment mode in the array
        };
      }

      // Fetch expenses from the database with applied filters and sort by date
      const filteredExpenses = await Expense.findAll({
        where: whereClause,
        order: [['date', 'DESC']], // Sort by date, newest first
      });

      res.json({
        success: true,
        data: filteredExpenses,
        // Calculate total sum of amounts from the fetched data
        total: filteredExpenses.reduce(
          (sum, exp) => sum + parseFloat(exp.amount),
          0
        ),
      });
    } catch (error) {
      console.error('Error in getAllExpenses:', error); // Log the full error for debugging
      res.status(500).json({
        success: false,
        message: 'Error fetching expenses',
        error: error.message,
      });
    }
  }

  // ---

  async addNewExpense(req, res) {
    try {
      const { amount, category, notes, date, paymentMode } = req.body;

      const expense = await Expense.create({
        amount: parseFloat(amount), // Ensure amount is stored as a float/decimal
        category,
        notes: notes || '', // Ensure notes are not null if optional
        date,
        paymentMode,
        // 'id', 'createdAt', 'updatedAt' are handled by Sequelize defaults
      });

      res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: expense, // Return the newly created expense object from the DB
      });
    } catch (error) {
      console.error('Error in addNewExpense:', error); // Log the full error for debugging
      // Sequelize validation errors often have a 'name' of 'SequelizeValidationError'
      if (error.name === 'SequelizeValidationError') {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: error.errors.map(err => err.message), // Extract specific error messages
        });
      }
      res.status(500).json({
        success: false,
        message: 'Error adding expense',
        error: error.message,
      });
    }
  }

  // ---

  async deleteExpense(req, res) {
    try {
      const { id } = req.params;

      // Delete the expense record from the database
      const deletedRows = await Expense.destroy({
        where: { id: id },
      });

      if (deletedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Expense not found',
        });
      }

      res.json({
        success: true,
        message: 'Expense deleted successfully',
      });
    } catch (error) {
      console.error('Error in deleteExpense:', error); // Log the full error for debugging
      res.status(500).json({
        success: false,
        message: 'Error deleting expense',
        error: error.message,
      });
    }
  }

  // ---

  async getAnalytics(req, res) {
    try {
      const allExpenses = await Expense.findAll({
        order: [['date', 'ASC']], // Sort by date for consistent monthly grouping
      });

      const monthlyData = {};

      allExpenses.forEach(expense => {
        const date = new Date(expense.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthKey,
            Rental: 0,
            Groceries: 0,
            Entertainment: 0,
            Travel: 0,
            Others: 0,
            // Add other categories you expect or derive dynamically
          };
        }
        // Ensure amount is parsed as a float before adding
        monthlyData[monthKey][expense.category] =
          (monthlyData[monthKey][expense.category] || 0) +
          parseFloat(expense.amount);
      });

      const analyticsData = Object.values(monthlyData).sort((a, b) =>
        a.month.localeCompare(b.month)
      );

      // Calculate total and average using fetched data
      const totalExpenses = allExpenses.reduce(
        (sum, exp) => sum + parseFloat(exp.amount),
        0
      );
      const averagePerMonth =
        analyticsData.length > 0 ? totalExpenses / analyticsData.length : 0;

      res.json({
        success: true,
        data: {
          chartData: analyticsData,
          summary: {
            totalExpenses,
            averagePerMonth: Math.round(averagePerMonth),
            totalTransactions: allExpenses.length,
          },
        },
      });
    } catch (error) {
      console.error('Error in getAnalytics:', error); // Log the full error for debugging
      res.status(500).json({
        success: false,
        message: 'Error fetching analytics',
        error: error.message,
      });
    }
  }
}

module.exports = ExpenseController;
