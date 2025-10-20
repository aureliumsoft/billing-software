import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiAlertCircle,
  FiPackage,
  FiTrendingUp,
  FiArrowRight,
  FiRefreshCw
} from 'react-icons/fi';
import db from '../../utils/db';

const Dashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    lowStock: 0,
    totalProducts: 0
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tokenNumber, setTokenNumber] = useState(0);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadDashboardData();
    loadTokenNumber();
  }, []);

  const loadDashboardData = async () => {
    try {
      const statsResult = await db.getDashboardStats();
      if (statsResult.success) {
        setStats(statsResult.data);
      }

      const ordersResult = await db.getRecentOrders(5);
      if (ordersResult.success) {
        setRecentOrders(ordersResult.data);
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTokenNumber = async () => {
    try {
      const result = await db.getCurrentTokenNumber();
      if (result.success) {
        setTokenNumber(result.data);
      }
    } catch (error) {
      console.error('Error loading token number:', error);
    }
  };

  const handleResetToken = async () => {
    if (!window.confirm('Are you sure you want to reset the token counter? This will start token numbers from 1 again. Receipt numbers will NOT be affected.')) {
      return;
    }

    setResetting(true);
    try {
      const result = await db.resetTokenCounter();
      if (result.success) {
        setTokenNumber(0);
        alert('Token counter has been reset successfully! Next order will be Token #1');
      } else {
        alert('Failed to reset token counter');
      }
    } catch (error) {
      console.error('Error resetting token:', error);
      alert('Failed to reset token counter');
    } finally {
      setResetting(false);
    }
  };

  const statCards = [
    {
      title: "Today's Sales",
      value: `PKR ${Math.round(stats.todaySales)}`,
      icon: FiDollarSign,
      color: 'bg-gradient-to-br from-green-400 to-green-600',
      link: '/reports'
    },
    {
      title: "Today's Orders",
      value: stats.todayOrders,
      icon: FiShoppingBag,
      color: 'bg-gradient-to-br from-blue-400 to-blue-600',
      link: '/orders'
    },
    {
      title: 'Low Stock Items',
      value: stats.lowStock,
      icon: FiAlertCircle,
      color: 'bg-gradient-to-br from-red-400 to-red-600',
      link: '/products'
    },
    {
      title: 'Total Products',
      value: stats.totalProducts,
      icon: FiPackage,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      link: '/products'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser?.username}! 👋
        </h1>
        <p className="text-blue-100">
          Here's what's happening with your cafe today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="transform hover:scale-105 transition-transform duration-200"
            >
              <div className={`${stat.color} rounded-xl shadow-lg p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-white/20 p-3 rounded-lg">
                    <Icon className="text-2xl" />
                  </div>
                  <FiTrendingUp className="text-xl opacity-50" />
                </div>
                <p className="text-white/80 text-sm mb-1">{stat.title}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Token Reset Card */}
      <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Token Management</h3>
            <p className="text-gray-600 mb-1">Current Token Number: <span className="font-bold text-purple-600 text-2xl">{tokenNumber}</span></p>
            <p className="text-sm text-gray-500">Next Token will be: #{tokenNumber + 1}</p>
            <p className="text-xs text-gray-500 mt-2">Note: Resetting tokens will NOT affect receipt numbers</p>
          </div>
          <button
            onClick={handleResetToken}
            disabled={resetting}
            className="btn-danger flex items-center justify-center space-x-2 whitespace-nowrap sm:self-start"
          >
            <FiRefreshCw className={resetting ? 'animate-spin' : ''} />
            <span>{resetting ? 'Resetting...' : 'Reset Tokens'}</span>
          </button>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Recent Orders</h2>
            <Link
              to="/orders"
              className="text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
            >
              View All
              <FiArrowRight className="ml-1" />
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FiShoppingBag className="text-4xl mx-auto mb-2 opacity-50" />
              <p>No orders yet today</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div>
                    <p className="font-semibold text-gray-800">
                      Token #{order.token_number}
                    </p>
                    <p className="text-xs text-gray-400">Receipt: {order.id}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">
                      PKR {Math.round(order.total_amount)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {order.payment_method}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/pos"
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow text-center"
            >
              <FiShoppingBag className="text-3xl mx-auto mb-2" />
              <p className="font-semibold">New Order</p>
            </Link>
            <Link
              to="/products"
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow text-center"
            >
              <FiPackage className="text-3xl mx-auto mb-2" />
              <p className="font-semibold">Manage Products</p>
            </Link>
            <Link
              to="/expenses"
              className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow text-center"
            >
              <FiDollarSign className="text-3xl mx-auto mb-2" />
              <p className="font-semibold">Add Expense</p>
            </Link>
            <Link
              to="/reports"
              className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow text-center"
            >
              <FiTrendingUp className="text-3xl mx-auto mb-2" />
              <p className="font-semibold">View Reports</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


