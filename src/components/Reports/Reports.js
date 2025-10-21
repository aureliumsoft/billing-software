import React, { useState, useEffect } from 'react';
import {
  FiBarChart2,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiCalendar,
  FiDownload,
  FiPrinter
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
  const [stockManagementEnabled, setStockManagementEnabled] = useState(true);

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
      // Load stock management setting
      const stockResult = await db.getStockManagementEnabled();
      if (stockResult.success) {
        setStockManagementEnabled(stockResult.data);
      }

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

  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add Profit/Loss Summary
    csvContent += "PROFIT & LOSS STATEMENT\\n";
    csvContent += `Period: ${startDate} to ${endDate}\\n\\n`;
    csvContent += "Category,Amount (PKR)\\n";
    csvContent += `Total Revenue,${profitLoss.revenue}\\n`;
    csvContent += `Cost of Goods Sold,-${profitLoss.cost}\\n`;
    csvContent += `Gross Profit,${profitLoss.revenue - profitLoss.cost}\\n`;
    csvContent += `Operating Expenses,-${profitLoss.expenses}\\n`;
    csvContent += `Net Profit/Loss,${profitLoss.profit}\\n\\n`;
    
    // Add Top Products
    csvContent += "TOP SELLING PRODUCTS\\n";
    csvContent += "Product Name,Units Sold,Revenue (PKR)\\n";
    topProducts.forEach(product => {
      csvContent += `${product.name},${product.total_sold},${product.total_revenue}\\n`;
    });
    
    // Add Daily Sales
    csvContent += "\\nDAILY SALES REPORT\\n";
    csvContent += "Date,Orders,Sales (PKR)\\n";
    salesReport.forEach(day => {
      csvContent += `${day.date},${day.order_count},${day.total_sales}\\n`;
    });
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_${startDate}_${endDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printReport = () => {
    window.print();
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#F97316'];

  const profitMargin = profitLoss.revenue > 0 
    ? ((profitLoss.profit / profitLoss.revenue) * 100).toFixed(1)
    : 0;

  const expenseData = stockManagementEnabled 
    ? [
        { name: 'Revenue', value: profitLoss.revenue, color: '#10B981' },
        { name: 'Cost', value: profitLoss.cost, color: '#F59E0B' },
        { name: 'Expenses', value: profitLoss.expenses, color: '#EF4444' }
      ]
    : [
        { name: 'Revenue', value: profitLoss.revenue, color: '#10B981' },
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={exportToCSV}
            className="btn-secondary flex items-center space-x-2"
            title="Export to CSV"
          >
            <FiDownload />
            <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={printReport}
            className="btn-primary flex items-center space-x-2"
            title="Print Report"
          >
            <FiPrinter />
            <span className="hidden sm:inline">Print</span>
          </button>
        </div>
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
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${stockManagementEnabled ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
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

        {stockManagementEnabled && (
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
        )}

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
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickFormatter={(value) => {
                    try {
                      return new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    } catch {
                      return value;
                    }
                  }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => [`PKR ${Math.round(value)}`, 'Sales']}
                  labelFormatter={(label) => {
                    try {
                      return new Date(label).toLocaleDateString('en-US', { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      });
                    } catch {
                      return label;
                    }
                  }}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc' }}
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
                  label={({ name, value, percent }) => {
                    if (value === 0) return '';
                    return `${name}: ${(percent * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `PKR ${Math.round(value)}`}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc' }}
                />
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
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 12 }} 
                  width={150}
                />
                <Tooltip 
                  formatter={(value, name) => [value, name === 'total_sold' ? 'Units' : 'Revenue']}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc' }}
                />
                <Legend />
                <Bar dataKey="total_sold" name="Units Sold" fill="#3B82F6" radius={[0, 4, 4, 0]} />
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

      {/* Daily Sales Table */}
      {salesReport.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <FiCalendar className="mr-2" />
            Daily Sales Breakdown
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Day
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Sales
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Order
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {salesReport.map((day, index) => {
                  const avgOrder = day.order_count > 0 ? day.total_sales / day.order_count : 0;
                  const dayName = new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' });
                  const formattedDate = new Date(day.date).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  });
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formattedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {dayName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                        {day.order_count}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold text-green-600">
                        PKR {Math.round(day.total_sales)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                        PKR {Math.round(avgOrder)}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50 font-bold">
                  <td colSpan="2" className="px-6 py-4 text-sm text-gray-900">
                    Total
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-gray-900">
                    {salesReport.reduce((sum, day) => sum + day.order_count, 0)}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-green-600">
                    PKR {Math.round(salesReport.reduce((sum, day) => sum + day.total_sales, 0))}
                  </td>
                  <td className="px-6 py-4 text-sm text-right text-blue-600">
                    PKR {Math.round(
                      salesReport.reduce((sum, day) => sum + day.total_sales, 0) / 
                      salesReport.reduce((sum, day) => sum + day.order_count, 0)
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

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
          {stockManagementEnabled && (
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700">Less: Cost of Goods Sold</span>
              <span className="font-bold text-orange-600 text-lg">
                -PKR {Math.round(profitLoss.cost)}
              </span>
            </div>
          )}
          {stockManagementEnabled && (
            <div className="flex justify-between items-center pb-3 border-b">
              <span className="text-gray-700 font-medium">Gross Profit</span>
              <span className="font-bold text-blue-600 text-lg">
                PKR {Math.round(profitLoss.revenue - profitLoss.cost)}
              </span>
            </div>
          )}
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
          {stockManagementEnabled && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Gross Margin</p>
                  <p className="font-bold text-gray-800">
                    {profitLoss.revenue > 0 
                      ? ((profitLoss.revenue - profitLoss.cost) / profitLoss.revenue * 100).toFixed(1)
                      : 0}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Net Margin</p>
                  <p className="font-bold text-gray-800">
                    {profitMargin}%
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;


