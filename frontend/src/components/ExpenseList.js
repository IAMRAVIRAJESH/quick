import React, { useState, useEffect } from 'react';
import { Filter, Calendar, FileText, Trash2 } from 'lucide-react';
import { expenseAPI } from '../services/api';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    dateRange: 'all',
    categories: [],
    paymentModes: []
  });

  const categories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
  const paymentModes = ['UPI', 'Credit Card', 'Net Banking', 'Cash'];

  const categoryColors = {
    'Rental': '#8B5CF6',
    'Groceries': '#10B981',
    'Entertainment': '#F59E0B',
    'Travel': '#3B82F6',
    'Others': '#6B7280'
  };

  const fetchExpenses = async () => {
    setLoading(true);
    try {
      const response = await expenseAPI.getExpenses(filters);
      setExpenses(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [filters]);

  const handleFilterChange = (type, value) => {
    setFilters(prev => {
      if (type === 'dateRange') {
        return { ...prev, dateRange: value };
      } else if (type === 'categories') {
        const newCategories = prev.categories.includes(value)
          ? prev.categories.filter(c => c !== value)
          : [...prev.categories, value];
        return { ...prev, categories: newCategories };
      } else if (type === 'paymentModes') {
        const newPaymentModes = prev.paymentModes.includes(value)
          ? prev.paymentModes.filter(p => p !== value)
          : [...prev.paymentModes, value];
        return { ...prev, paymentModes: newPaymentModes };
      }
      return prev;
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return;
    }

    try {
      await expenseAPI.deleteExpense(id);
      fetchExpenses(); // Refresh the list
    } catch (error) {
      console.error('Error deleting expense:', error);
      alert('Error deleting expense. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Filter className="w-5 h-5 mr-2" />
          Filters
        </h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
            <select
              value={filters.dateRange}
              onChange={(e) => handleFilterChange('dateRange', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All time</option>
              <option value="thisMonth">This month</option>
              <option value="last30">Last 30 days</option>
              <option value="last90">Last 90 days</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="space-y-2">
              {categories.map(cat => (
                <label key={cat} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.categories.includes(cat)}
                    onChange={() => handleFilterChange('categories', cat)}
                    className="mr-2"
                  />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Modes</label>
            <div className="space-y-2">
              {paymentModes.map(mode => (
                <label key={mode} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={filters.paymentModes.includes(mode)}
                    onChange={() => handleFilterChange('paymentModes', mode)}
                    className="mr-2"
                  />
                  <span className="text-sm">{mode}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expenses List */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">
            Expenses ({expenses.length})
          </h2>
          <p className="text-gray-600 mt-1">
            Total: ₹{total.toLocaleString()}
          </p>
        </div>
        
        <div className="divide-y">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
          ) : expenses.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No expenses found matching your filters
            </div>
          ) : (
            expenses.map(expense => (
              <div key={expense.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="text-lg font-semibold text-gray-900">
                        ₹{expense.amount.toLocaleString()}
                      </span>
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: categoryColors[expense.category] + '20',
                          color: categoryColors[expense.category]
                        }}
                      >
                        {expense.category}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {expense.paymentMode}
                      </span>
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {new Date(expense.date).toLocaleDateString()}
                      </span>
                      {expense.notes && (
                        <span className="flex items-center">
                          <FileText className="w-4 h-4 mr-1" />
                          {expense.notes}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-red-500 hover:text-red-700 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;