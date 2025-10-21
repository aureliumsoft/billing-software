import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import db from '../../utils/db';
import {
  FiHome,
  FiShoppingCart,
  FiPackage,
  FiGrid,
  FiFileText,
  FiDollarSign,
  FiBarChart2,
  FiSettings,
  FiLogOut,
  FiMenu,
  FiX,
  FiCoffee,
  FiUser,
  FiHelpCircle
} from 'react-icons/fi';

const Layout = ({ currentUser, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [brandName, setBrandName] = useState('Cafe POS');
  const [brandLogo, setBrandLogo] = useState('');
  const location = useLocation();

  useEffect(() => {
    loadBrandSettings();
    
    // Listen for brand updates from Settings page
    const handleBrandUpdate = (event) => {
      const { brandName, brandLogo } = event.detail;
      setBrandName(brandName);
      setBrandLogo(brandLogo);
      document.title = `${brandName} - POS System`;
    };

    window.addEventListener('brandUpdated', handleBrandUpdate);
    
    return () => {
      window.removeEventListener('brandUpdated', handleBrandUpdate);
    };
  }, []);

  const loadBrandSettings = async () => {
    try {
      const nameResult = await db.getBrandName();
      if (nameResult.success) {
        setBrandName(nameResult.data);
        // Update document title
        document.title = `${nameResult.data} - POS System`;
      }

      const logoResult = await db.getBrandLogo();
      if (logoResult.success) {
        setBrandLogo(logoResult.data);
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  const mainMenuItems = [
    { path: '/', icon: FiHome, label: 'Dashboard' },
    { path: '/pos', icon: FiShoppingCart, label: 'POS' },
    { path: '/products', icon: FiPackage, label: 'Products' },
    { path: '/categories', icon: FiGrid, label: 'Categories' },
    { path: '/orders', icon: FiFileText, label: 'Orders' },
    { path: '/expenses', icon: FiDollarSign, label: 'Expenses' },
    { path: '/reports', icon: FiBarChart2, label: 'Reports' },
  ];

  const bottomMenuItems = [
    { path: '/settings', icon: FiSettings, label: 'Settings' },
    { path: '/help', icon: FiHelpCircle, label: 'Help' },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } fixed lg:relative lg:translate-x-0 w-64 bg-gradient-to-b from-blue-600 to-purple-700 text-white transition-transform duration-300 flex flex-col z-50 h-full`}
      >
        {/* Logo */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 p-2 rounded-lg overflow-hidden">
                {brandLogo ? (
                  <img 
                    src={brandLogo} 
                    alt={brandName}
                    className="h-8 w-8 object-cover"
                  />
                ) : (
                  <img 
                    src="./aurelium.png" 
                    alt="Aurelium Logo" 
                    className="h-8 w-8 object-contain"
                  />
                )}
              </div>
              <div>
                <h1 className="font-bold text-lg">{brandName}</h1>
                <p className="text-xs text-white/70">Management System</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:bg-white/10 p-2 rounded-lg lg:hidden"
            >
              <FiX />
            </button>
          </div>
        </div>

        {/* User Info */}
        {currentUser && (
          <div className="p-4 border-b border-white/20">
            <div className="flex items-center space-x-3 bg-white/10 p-3 rounded-lg">
              <div className="bg-white/20 p-2 rounded-full">
                <FiUser />
              </div>
              <div>
                <p className="font-medium">{currentUser.username}</p>
                <p className="text-xs text-white/70 capitalize">{currentUser.role}</p>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                  active
                    ? 'bg-white text-blue-600 shadow-lg'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <Icon className="text-xl flex-shrink-0" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section - Settings, Help, and Logout */}
        <div className="border-t border-white/20">
          {/* Settings and Help */}
          <div className="p-4 space-y-2">
            {bottomMenuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    active
                      ? 'bg-white text-blue-600 shadow-lg'
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  <Icon className="text-xl flex-shrink-0" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={onLogout}
              className="flex items-center space-x-3 p-3 rounded-lg text-white hover:bg-white/10 w-full transition-all duration-200"
            >
              <FiLogOut className="text-xl flex-shrink-0" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm p-4 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-800 p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <FiMenu className="text-xl" />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">{currentUser?.username}</p>
              <p className="text-xs text-gray-500 hidden sm:block">{new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;


