import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FiDollarSign,
  FiShoppingBag,
  FiAlertCircle,
  FiPackage,
  FiTrendingUp,
  FiArrowRight,
  FiSettings
} from 'react-icons/fi';
import db from '../../utils/db';

const Dashboard = ({ currentUser }) => {
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    weekSales: 0,
    avgOrderValue: 0,
    lowStock: 0,
    totalProducts: 0,
    stockManagementEnabled: true
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('Cafe POS');

  useEffect(() => {
    loadDashboardData();
    loadBrandSettings();
    
    // Listen for brand updates from Settings page
    const handleBrandUpdate = (event) => {
      const { brandName } = event.detail;
      setBrandName(brandName);
    };

    window.addEventListener('brandUpdated', handleBrandUpdate);
    
    return () => {
      window.removeEventListener('brandUpdated', handleBrandUpdate);
    };
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

  const loadBrandSettings = async () => {
    try {
      const nameResult = await db.getBrandName();
      if (nameResult.success) {
        setBrandName(nameResult.data);
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
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
    // Conditional: Show Low Stock if stock management is enabled, otherwise show Week Sales
    stats.stockManagementEnabled ? {
      title: 'Low Stock Items',
      value: stats.lowStock,
      icon: FiAlertCircle,
      color: 'bg-gradient-to-br from-red-400 to-red-600',
      link: '/products'
    } : {
      title: "This Week's Sales",
      value: `PKR ${Math.round(stats.weekSales)}`,
      icon: FiTrendingUp,
      color: 'bg-gradient-to-br from-indigo-400 to-indigo-600',
      link: '/reports'
    },
    {
      title: stats.stockManagementEnabled ? 'Total Products' : 'Avg Order Value',
      value: stats.stockManagementEnabled ? stats.totalProducts : `PKR ${Math.round(stats.avgOrderValue)}`,
      icon: FiPackage,
      color: 'bg-gradient-to-br from-purple-400 to-purple-600',
      link: stats.stockManagementEnabled ? '/products' : '/reports'
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
            <Link
              to="/settings"
              className="bg-gradient-to-br from-gray-500 to-gray-600 text-white p-6 rounded-lg hover:shadow-lg transition-shadow text-center"
            >
              <FiSettings className="text-3xl mx-auto mb-2" />
              <p className="font-semibold">Settings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


