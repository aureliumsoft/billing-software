import React, { useState, useEffect } from 'react';
import {
  FiBarChart2,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar
} from 'react-icons/fi';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import db from '../../utils/db';

const Reports = () => {
  const [dateRange, setDateRange] = useState('month');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [profitLoss, setProfitLoss] = useState({
    revenue: 0,
    cost: 0,
    expenses: 0,
    profit: 0
  });
  const [salesReport, setSalesReport] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDefaultDateRange();
  }, [dateRange]);

  useEffect(() => {
    if (startDate && endDate) {
      loadReports();
    }
  }, [startDate, endDate]);

  const setDefaultDateRange = () => {
    const end = new Date();
    const start = new Date();

    switch (dateRange) {
      case 'week':
        start.setDate(start.getDate() - 7);
        break;
      case 'month':
        start.setMonth(start.getMonth() - 1);
        break;
      case 'quarter':
        start.setMonth(start.getMonth() - 3);
        break;
      case 'year':
        start.setFullYear(start.getFullYear() - 1);
        break;
      default:
        start.setMonth(start.getMonth() - 1);
    }

    setStartDate(start.toISOString().split('T')[0]);
    setEndDate(end.toISOString().split('T')[0]);
  };

  const loadReports = async () => {
    setLoading(true);
    try {
      // Profit/Loss
      const plResult = await db.getProfitLoss(startDate, endDate);
      if (plResult.success) {
        setProfitLoss(plResult.data);
      }

      // Sales Report
      const salesResult = await db.getSalesReport(startDate, endDate);
      if (salesResult.success) {
        setSalesReport(salesResult.data);
      }

      // Top Products
      const topResult = await db.getTopProducts(startDate, endDate, 10);
      if (topResult.success) {
        setTopProducts(topResult.data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const profitMargin = profitLoss.revenue > 0 
    ? ((profitLoss.profit / profitLoss.revenue) * 100).toFixed(1)
    : 0;

  const expenseData = [
    { name: 'Revenue', value: profitLoss.revenue, color: '#10B981' },
    { name: 'Cost', value: profitLoss.cost, color: '#F59E0B' },
    { name: 'Expenses', value: profitLoss.expenses, color: '#EF4444' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
        <p className="text-gray-600 mt-1">Track your business performance</p>
      </div>

      {/* Date Range Selector */}
      <div className="card">
        <div className="flex flex-col md:flex-row flex-wrap gap-4 md:items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setDateRange('week')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  dateRange === 'week'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last 7 Days
              </button>
              <button
                onClick={() => setDateRange('month')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  dateRange === 'month'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setDateRange('quarter')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  dateRange === 'quarter'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last Quarter
              </button>
              <button
                onClick={() => setDateRange('year')}
                className={`px-4 py-2 rounded-lg font-medium ${
                  dateRange === 'year'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Last Year
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setDateRange('custom');
                }}
                className="input-field"
              />
            </div>
            <div className="flex-1 md:flex-none">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setDateRange('custom');
                }}
                className="input-field"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="stat-card bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <FiDollarSign className="text-green-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-green-600">
            PKR {Math.round(profitLoss.revenue)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            From sales
          </p>
        </div>

        <div className="stat-card bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Cost</p>
            <FiTrendingDown className="text-orange-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-orange-600">
            PKR {Math.round(profitLoss.cost)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Product costs
          </p>
        </div>

        <div className="stat-card bg-gradient-to-br from-red-50 to-red-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <FiTrendingDown className="text-red-600 text-xl" />
          </div>
          <p className="text-3xl font-bold text-red-600">
            PKR {Math.round(profitLoss.expenses)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Operating expenses
          </p>
        </div>

        <div className={`stat-card bg-gradient-to-br ${
          profitLoss.profit >= 0 
            ? 'from-blue-50 to-blue-100' 
            : 'from-red-50 to-red-100'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Net Profit</p>
            {profitLoss.profit >= 0 ? (
              <FiTrendingUp className="text-blue-600 text-xl" />
            ) : (
              <FiTrendingDown className="text-red-600 text-xl" />
            )}
          </div>
          <p className={`text-3xl font-bold ${
            profitLoss.profit >= 0 ? 'text-blue-600' : 'text-red-600'
          }`}>
            PKR {Math.round(profitLoss.profit)}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {profitMargin}% margin
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Trend */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FiBarChart2 className="mr-2" />
            Sales Trend
          </h3>
          {salesReport.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesReport}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => `PKR ${Math.round(value)}`}
                  labelFormatter={(label) => new Date(label).toLocaleDateString()}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total_sales" 
                  name="Sales"
                  stroke="#3B82F6" 
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiBarChart2 className="text-5xl mx-auto mb-2 opacity-30" />
                <p>No sales data available</p>
              </div>
            </div>
          )}
        </div>

        {/* Revenue Breakdown */}
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FiDollarSign className="mr-2" />
            Financial Breakdown
          </h3>
          {profitLoss.revenue > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => 
                    `${name}: PKR ${Math.round(value)} (${(percent * 100).toFixed(0)}%)`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `PKR ${Math.round(value)}`} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <div className="text-center">
                <FiDollarSign className="text-5xl mx-auto mb-2 opacity-30" />
                <p>No financial data available</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Products */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Top Selling Products</h3>
        {topProducts.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 12 }} width={150} />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_sold" name="Units Sold" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Units Sold
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Revenue
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.total_sold}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        PKR {Math.round(product.total_revenue)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="py-12 text-center text-gray-500">
            <FiBarChart2 className="text-5xl mx-auto mb-3 opacity-30" />
            <p>No product sales data available</p>
          </div>
        )}
      </div>

      {/* Profit/Loss Summary */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <FiCalendar className="mr-2" />
          Profit & Loss Statement
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-700">Total Revenue</span>
            <span className="font-bold text-green-600 text-lg">
              PKR {Math.round(profitLoss.revenue)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-700">Less: Cost of Goods Sold</span>
            <span className="font-bold text-orange-600 text-lg">
              -PKR {Math.round(profitLoss.cost)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-700 font-medium">Gross Profit</span>
            <span className="font-bold text-blue-600 text-lg">
              PKR {Math.round(profitLoss.revenue - profitLoss.cost)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-3 border-b">
            <span className="text-gray-700">Less: Operating Expenses</span>
            <span className="font-bold text-red-600 text-lg">
              -PKR {Math.round(profitLoss.expenses)}
            </span>
          </div>
          <div className="flex justify-between items-center py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg px-4">
            <span className="text-gray-800 font-bold text-lg">Net Profit/Loss</span>
            <span className={`font-bold text-2xl ${
              profitLoss.profit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {profitLoss.profit >= 0 ? '+' : ''}PKR {Math.round(profitLoss.profit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;


