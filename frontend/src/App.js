import React, { useState } from 'react';
import { PlusCircle, FileText, BarChart3 } from 'lucide-react';
import AddExpense from './components/AddExpense';
import ExpenseList from './components/ExpenseList';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('add');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Manager</h1>
          <p className="text-gray-600">Track and manage your expenses efficiently</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('add')}
              className={`flex items-center px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'add'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add Expense
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex items-center px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'list'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <FileText className="w-5 h-5 mr-2" />
              View Expenses
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center px-6 py-4 border-b-2 transition-colors ${
                activeTab === 'analytics'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <BarChart3 className="w-5 h-5 mr-2" />
              Analytics
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'add' && <AddExpense />}
        {activeTab === 'list' && <ExpenseList />}
        {activeTab === 'analytics' && <Analytics />}
      </div>
    </div>
  );
}

export default App;