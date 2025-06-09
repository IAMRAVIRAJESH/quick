const { sequelize } = require('../config/Database');
const { DataTypes } = require('sequelize');

const Expense = sequelize.define(
  'Expense', // Model name (singular, Sequelize pluralizes for table name by default)
  {
    // Primary Key: Unique identifier for each expense
    id: {
      type: DataTypes.UUID, // Use UUID for unique IDs, similar to uuidv4()
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4, // Generates a UUID V4 by default
      allowNull: false,
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2), // Use DECIMAL for monetary values (precision, scale)
      allowNull: false,
      validate: {
        isDecimal: true,
        notEmpty: true,
        min: 0, // Ensure amount is not negative
      },
    },
    category: {
      type: DataTypes.STRING, // Category can be a string
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255], // Example: category name length between 1 and 255
      },
    },
    notes: {
      type: DataTypes.TEXT, // Use TEXT for potentially longer notes
      allowNull: true, // Notes are optional based on your original class
    },
    date: {
      type: DataTypes.DATE, // Date of the expense
      allowNull: false,
      validate: {
        isDate: true,
      },
    },
    paymentMode: {
      type: DataTypes.STRING, // Payment mode (e.g., 'Cash', 'Credit Card', 'UPI')
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 50], // Example: payment mode length between 1 and 50
      },
    },
    // Sequelize automatically adds `createdAt` and `updatedAt` if `timestamps` is true
    // You had `CreatedAt` in your class, which maps well to Sequelize's `createdAt`
  },
  {
    tableName: 'expenses', // Explicitly define the table name as plural lowercase
    timestamps: true, // Enable Sequelize's default createdAt and updatedAt fields
    underscored: true, // Use snake_case for column names in the database (e.g., `payment_mode`)
  }
);

module.exports = Expense;
