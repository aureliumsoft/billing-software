import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Auth/Login';
import ForgotPassword from './components/Auth/ForgotPassword';
import Dashboard from './components/Dashboard/Dashboard';
import POS from './components/POS/POS';
import Products from './components/Products/Products';
import Categories from './components/Categories/Categories';
import Orders from './components/Orders/Orders';
import Expenses from './components/Expenses/Expenses';
import Reports from './components/Reports/Reports';
import Layout from './components/Layout/Layout';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem('currentUser');
    if (user) {
      setCurrentUser(JSON.parse(user));
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    localStorage.setItem('currentUser', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login onLogin={handleLogin} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/forgot-password"
          element={
            !isAuthenticated ? (
              <ForgotPassword />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        
        {isAuthenticated ? (
          <Route
            path="/"
            element={<Layout currentUser={currentUser} onLogout={handleLogout} />}
          >
            <Route index element={<Dashboard currentUser={currentUser} />} />
            <Route path="pos" element={<POS currentUser={currentUser} />} />
            <Route path="products" element={<Products />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<Orders />} />
            <Route path="expenses" element={<Expenses currentUser={currentUser} />} />
            <Route path="reports" element={<Reports />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;

