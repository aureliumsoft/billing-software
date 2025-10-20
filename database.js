const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = null;
    this.initPromise = this.initialize();
  }

  async initialize() {
    try {
      const userDataPath = app.getPath('userData');
      this.dbPath = path.join(userDataPath, 'cafe_pos.db');
      
      console.log('Database path:', this.dbPath);

      const SQL = await initSqlJs();
      
      // Load existing database or create new one
      if (fs.existsSync(this.dbPath)) {
        const buffer = fs.readFileSync(this.dbPath);
        this.db = new SQL.Database(buffer);
        console.log('Loaded existing database');
      } else {
        this.db = new SQL.Database();
        console.log('Created new database');
      }
      
      this.initializeTables();
      this.seedDefaultData();
      this.saveDatabase();
    } catch (error) {
      console.error('Database initialization error:', error);
      throw error;
    }
  }

  saveDatabase() {
    if (this.db && this.dbPath) {
      const data = this.db.export();
      const buffer = Buffer.from(data);
      fs.writeFileSync(this.dbPath, buffer);
    }
  }

  run(sql, params = []) {
    this.db.run(sql, params);
    this.saveDatabase();
  }

  exec(sql) {
    this.db.exec(sql);
    this.saveDatabase();
  }

  get(sql, params = []) {
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const result = stmt.step() ? stmt.getAsObject() : null;
    stmt.free();
    return result;
  }

  all(sql, params = []) {
    const stmt = this.db.prepare(sql);
    stmt.bind(params);
    const results = [];
    while (stmt.step()) {
      results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
  }

  initializeTables() {
    // Users table
    this.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT,
        role TEXT DEFAULT 'cashier',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Categories table
    this.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Products table
    this.exec(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category_id INTEGER,
        price REAL NOT NULL,
        cost REAL DEFAULT 0,
        stock INTEGER DEFAULT 0,
        image TEXT,
        description TEXT,
        active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Orders table
    this.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        token_number TEXT UNIQUE NOT NULL,
        user_id INTEGER,
        total_amount REAL NOT NULL,
        payment_method TEXT DEFAULT 'cash',
        status TEXT DEFAULT 'completed',
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Order items table
    this.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        product_id INTEGER NOT NULL,
        product_name TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        subtotal REAL NOT NULL
      )
    `);

    // Expenses table
    this.exec(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        category TEXT NOT NULL,
        amount REAL NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        created_by INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Password reset tokens table
    this.exec(`
      CREATE TABLE IF NOT EXISTS password_resets (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        reset_code TEXT NOT NULL,
        expires_at DATETIME NOT NULL,
        used INTEGER DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Settings table
    this.exec(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      )
    `);
  }

  seedDefaultData() {
    // Check if admin user exists
    const adminExists = this.get('SELECT id FROM users WHERE username = ?', ['admin']);
    
    // Initialize token counter if not exists
    const tokenCounter = this.get('SELECT value FROM settings WHERE key = ?', ['token_counter']);
    if (!tokenCounter) {
      this.run('INSERT INTO settings (key, value) VALUES (?, ?)', ['token_counter', '0']);
    }
    
    if (!adminExists) {
      // Create default admin user
      this.run(`INSERT INTO users (username, password, email, role) VALUES (?, ?, ?, ?)`,
        ['admin', 'admin123', 'admin@cafe.com', 'admin']);

      // Create default categories
      const categories = [
        ['Beverages', 'Hot and cold drinks'],
        ['Food', 'Snacks and meals'],
        ['Desserts', 'Sweet treats'],
        ['Bakery', 'Fresh baked goods']
      ];

      categories.forEach(cat => {
        this.run('INSERT INTO categories (name, description) VALUES (?, ?)', cat);
      });

      // Create sample products
      const products = [
        ['Espresso', 1, 3.50, 1.00, 100],
        ['Cappuccino', 1, 4.50, 1.50, 100],
        ['Latte', 1, 4.75, 1.50, 100],
        ['Americano', 1, 3.75, 1.00, 100],
        ['Cold Brew', 1, 5.00, 1.75, 50],
        ['Croissant', 4, 3.00, 1.00, 50],
        ['Sandwich', 2, 7.50, 3.00, 30],
        ['Muffin', 4, 3.50, 1.20, 40],
        ['Cheesecake', 3, 5.50, 2.00, 20],
        ['Cookie', 3, 2.50, 0.80, 60]
      ];

      products.forEach(prod => {
        this.run('INSERT INTO products (name, category_id, price, cost, stock) VALUES (?, ?, ?, ?, ?)', prod);
      });

      this.saveDatabase();
      console.log('Default data seeded successfully');
    }
  }

  // User operations
  getUser(username, password) {
    return this.get('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
  }

  getUserByUsername(username) {
    return this.get('SELECT * FROM users WHERE username = ?', [username]);
  }

  getUserByEmail(email) {
    return this.get('SELECT * FROM users WHERE email = ?', [email]);
  }

  updatePassword(userId, newPassword) {
    this.run('UPDATE users SET password = ? WHERE id = ?', [newPassword, userId]);
    return { changes: 1 };
  }

  createPasswordReset(userId, code) {
    const expiresAt = new Date(Date.now() + 3600000).toISOString();
    this.run('INSERT INTO password_resets (user_id, reset_code, expires_at) VALUES (?, ?, ?)',
      [userId, code, expiresAt]);
    return { lastID: 1 };
  }

  getPasswordReset(code) {
    return this.get(`SELECT * FROM password_resets WHERE reset_code = ? AND used = 0 AND expires_at > datetime('now')`, [code]);
  }

  markResetUsed(resetId) {
    this.run('UPDATE password_resets SET used = 1 WHERE id = ?', [resetId]);
    return { changes: 1 };
  }

  // Category operations
  getAllCategories() {
    return this.all('SELECT * FROM categories ORDER BY name');
  }

  createCategory(name, description) {
    this.run('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
    return { lastID: 1 };
  }

  updateCategory(id, name, description) {
    this.run('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    return { changes: 1 };
  }

  deleteCategory(id) {
    this.run('DELETE FROM categories WHERE id = ?', [id]);
    return { changes: 1 };
  }

  // Product operations
  getAllProducts() {
    return this.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      ORDER BY p.name
    `);
  }

  getActiveProducts() {
    return this.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.active = 1 
      ORDER BY p.name
    `);
  }

  searchProducts(query) {
    return this.all(`
      SELECT p.*, c.name as category_name 
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id 
      WHERE p.active = 1 AND (p.name LIKE ? OR p.description LIKE ?)
      ORDER BY p.name
    `, [`%${query}%`, `%${query}%`]);
  }

  createProduct(name, categoryId, price, cost, stock, description) {
    this.run('INSERT INTO products (name, category_id, price, cost, stock, description) VALUES (?, ?, ?, ?, ?, ?)',
      [name, categoryId, price, cost, stock, description]);
    return { lastID: 1 };
  }

  updateProduct(id, name, categoryId, price, cost, stock, description) {
    this.run('UPDATE products SET name = ?, category_id = ?, price = ?, cost = ?, stock = ?, description = ? WHERE id = ?',
      [name, categoryId, price, cost, stock, description, id]);
    return { changes: 1 };
  }

  deleteProduct(id) {
    this.run('UPDATE products SET active = 0 WHERE id = ?', [id]);
    return { changes: 1 };
  }

  updateProductStock(id, quantity) {
    this.run('UPDATE products SET stock = stock - ? WHERE id = ?', [quantity, id]);
  }

  // Order operations
  createOrder(tokenNumber, userId, totalAmount, paymentMethod, items, notes) {
    this.run('INSERT INTO orders (token_number, user_id, total_amount, payment_method, notes) VALUES (?, ?, ?, ?, ?)',
      [tokenNumber, userId, totalAmount, paymentMethod, notes]);
    
    const order = this.get('SELECT last_insert_rowid() as id');
    const orderId = order.id;

    items.forEach(item => {
      this.run('INSERT INTO order_items (order_id, product_id, product_name, quantity, price, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [orderId, item.id, item.name, item.quantity, item.price, item.subtotal]);
      this.updateProductStock(item.id, item.quantity);
    });

    return orderId;
  }

  getAllOrders() {
    return this.all(`
      SELECT o.*, u.username 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC
    `);
  }

  getRecentOrders(limit = 10) {
    return this.all(`
      SELECT o.*, u.username 
      FROM orders o 
      LEFT JOIN users u ON o.user_id = u.id 
      ORDER BY o.created_at DESC 
      LIMIT ?
    `, [limit]);
  }

  getOrderById(id) {
    return this.get('SELECT * FROM orders WHERE id = ?', [id]);
  }

  getOrderByToken(token) {
    return this.get('SELECT * FROM orders WHERE token_number = ?', [token]);
  }

  getOrderItems(orderId) {
    return this.all('SELECT * FROM order_items WHERE order_id = ?', [orderId]);
  }

  cancelOrder(id) {
    const order = this.getOrderById(id);
    if (!order || order.status === 'cancelled') {
      return null;
    }

    const items = this.getOrderItems(id);
    this.run('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);
    
    items.forEach(item => {
      this.run('UPDATE products SET stock = stock + ? WHERE id = ?', [item.quantity, item.product_id]);
    });

    return true;
  }

  // Expense operations
  getAllExpenses() {
    return this.all(`
      SELECT e.*, u.username as created_by_name 
      FROM expenses e 
      LEFT JOIN users u ON e.created_by = u.id 
      ORDER BY e.date DESC
    `);
  }

  createExpense(category, amount, description, date, userId) {
    this.run('INSERT INTO expenses (category, amount, description, date, created_by) VALUES (?, ?, ?, ?, ?)',
      [category, amount, description, date, userId]);
    return { lastID: 1 };
  }

  updateExpense(id, category, amount, description, date) {
    this.run('UPDATE expenses SET category = ?, amount = ?, description = ?, date = ? WHERE id = ?',
      [category, amount, description, date, id]);
    return { changes: 1 };
  }

  deleteExpense(id) {
    this.run('DELETE FROM expenses WHERE id = ?', [id]);
    return { changes: 1 };
  }

  // Reports
  getSalesReport(startDate, endDate) {
    return this.all(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as order_count,
        SUM(total_amount) as total_sales
      FROM orders 
      WHERE status = 'completed' 
        AND DATE(created_at) BETWEEN ? AND ?
      GROUP BY DATE(created_at)
      ORDER BY date DESC
    `, [startDate, endDate]);
  }

  getProfitLoss(startDate, endDate) {
    const revenue = this.get(`
      SELECT COALESCE(SUM(oi.subtotal), 0) as total_revenue,
             COALESCE(SUM(oi.quantity * p.cost), 0) as total_cost
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE o.status = 'completed' 
        AND DATE(o.created_at) BETWEEN ? AND ?
    `, [startDate, endDate]) || { total_revenue: 0, total_cost: 0 };

    const expenses = this.get(`
      SELECT COALESCE(SUM(amount), 0) as total_expenses
      FROM expenses
      WHERE DATE(date) BETWEEN ? AND ?
    `, [startDate, endDate]) || { total_expenses: 0 };

    return {
      revenue: revenue.total_revenue || 0,
      cost: revenue.total_cost || 0,
      expenses: expenses.total_expenses || 0,
      profit: (revenue.total_revenue || 0) - (revenue.total_cost || 0) - (expenses.total_expenses || 0)
    };
  }

  getTopProducts(startDate, endDate, limit = 10) {
    return this.all(`
      SELECT 
        p.name,
        SUM(oi.quantity) as total_sold,
        SUM(oi.subtotal) as total_revenue
      FROM order_items oi
      JOIN products p ON oi.product_id = p.id
      JOIN orders o ON oi.order_id = o.id
      WHERE o.status = 'completed' 
        AND DATE(o.created_at) BETWEEN ? AND ?
      GROUP BY p.id, p.name
      ORDER BY total_sold DESC
      LIMIT ?
    `, [startDate, endDate, limit]);
  }

  getDashboardStats() {
    const today = new Date().toISOString().split('T')[0];
    
    const todaySales = this.get(`
      SELECT COALESCE(SUM(total_amount), 0) as total
      FROM orders 
      WHERE status = 'completed' AND DATE(created_at) = ?
    `, [today]) || { total: 0 };

    const todayOrders = this.get(`
      SELECT COUNT(*) as count
      FROM orders 
      WHERE DATE(created_at) = ?
    `, [today]) || { count: 0 };

    const lowStock = this.get(`
      SELECT COUNT(*) as count
      FROM products 
      WHERE stock < 10 AND active = 1
    `) || { count: 0 };

    const totalProducts = this.get(`
      SELECT COUNT(*) as count
      FROM products 
      WHERE active = 1
    `) || { count: 0 };

    return {
      todaySales: todaySales.total || 0,
      todayOrders: todayOrders.count || 0,
      lowStock: lowStock.count || 0,
      totalProducts: totalProducts.count || 0
    };
  }

  // Settings operations
  getNextTokenNumber() {
    const result = this.get('SELECT value FROM settings WHERE key = ?', ['token_counter']);
    const current = parseInt(result?.value || '0');
    const next = current + 1;
    this.run('UPDATE settings SET value = ? WHERE key = ?', [next.toString(), 'token_counter']);
    return next;
  }

  resetTokenCounter() {
    this.run('UPDATE settings SET value = ? WHERE key = ?', ['0', 'token_counter']);
    return true;
  }

  getCurrentTokenNumber() {
    const result = this.get('SELECT value FROM settings WHERE key = ?', ['token_counter']);
    return parseInt(result?.value || '0');
  }
}

module.exports = Database;
