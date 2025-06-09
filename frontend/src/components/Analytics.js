import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { expenseAPI } from '../services/api';

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [summary, setSummary] = useState({
    totalExpenses: 0,
    averagePerMonth: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Rental', 'Groceries', 'Entertainment', 'Travel', 'Others'];
  const categoryColors = {
    'Rental': '#8B5CF6',
    'Groceries': '#10B981',
    'Entertainment': '#F59E0B',
    'Travel': '#3B82F6',
    'Others': '#6B7280'
  };

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await expenseAPI.getAnalytics();
      setAnalyticsData(response.data.chartData);
      setSummary(response.data.summary);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="text-center py-12 text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Monthly Expense Analytics</h2>
      
      {analyticsData.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No data available for analytics. Add some expenses first.
        </div>
      ) : (
        <>
          <div className="h-96 mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, 'Amount']} />
                <Legend />
                {categories.map(category => (
                  <Bar
                    key={category}
                    dataKey={category}
                    stackId="a"
                    fill={categoryColors[category]}
                    name={category}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Summary Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900">Total Expenses</h3>
              <p className="text-2xl font-bold text-blue-700">
                ₹{summary.totalExpenses.toLocaleString()}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900">Average per Month</h3>
              <p className="text-2xl font-bold text-green-700">
                ₹{summary.averagePerMonth.toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-900">Total Transactions</h3>
              <p className="text-2xl font-bold text-purple-700">{summary.totalTransactions}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;