// Database API wrapper
class DatabaseAPI {
  async executeQuery(method, ...args) {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return { success: false, error: 'Electron API not available' };
    }

    try {
      const result = await window.electronAPI.executeQuery(method, args);
      return result;
    } catch (error) {
      console.error('Database query error:', error);
      return { success: false, error: error.message };
    }
  }

  // User operations
  async getUser(username, password) {
    return await this.executeQuery('getUser', username, password);
  }

  async getUserByUsername(username) {
    return await this.executeQuery('getUserByUsername', username);
  }

  async getUserByEmail(email) {
    return await this.executeQuery('getUserByEmail', email);
  }

  async updatePassword(userId, newPassword) {
    return await this.executeQuery('updatePassword', userId, newPassword);
  }

  async createPasswordReset(userId, code) {
    return await this.executeQuery('createPasswordReset', userId, code);
  }

  async getPasswordReset(code) {
    return await this.executeQuery('getPasswordReset', code);
  }

  async markResetUsed(resetId) {
    return await this.executeQuery('markResetUsed', resetId);
  }

  // Category operations
  async getAllCategories() {
    return await this.executeQuery('getAllCategories');
  }

  async createCategory(name, description) {
    return await this.executeQuery('createCategory', name, description);
  }

  async updateCategory(id, name, description) {
    return await this.executeQuery('updateCategory', id, name, description);
  }

  async deleteCategory(id) {
    return await this.executeQuery('deleteCategory', id);
  }

  // Product operations
  async getAllProducts() {
    return await this.executeQuery('getAllProducts');
  }

  async getActiveProducts() {
    return await this.executeQuery('getActiveProducts');
  }

  async searchProducts(query) {
    return await this.executeQuery('searchProducts', query);
  }

  async createProduct(name, categoryId, price, cost, stock, description) {
    return await this.executeQuery('createProduct', name, categoryId, price, cost, stock, description);
  }

  async updateProduct(id, name, categoryId, price, cost, stock, description) {
    return await this.executeQuery('updateProduct', id, name, categoryId, price, cost, stock, description);
  }

  async deleteProduct(id) {
    return await this.executeQuery('deleteProduct', id);
  }

  // Order operations
  async createOrder(tokenNumber, userId, totalAmount, paymentMethod, items, notes) {
    return await this.executeQuery('createOrder', tokenNumber, userId, totalAmount, paymentMethod, items, notes);
  }

  async getAllOrders() {
    return await this.executeQuery('getAllOrders');
  }

  async getRecentOrders(limit = 10) {
    return await this.executeQuery('getRecentOrders', limit);
  }

  async getOrderById(id) {
    return await this.executeQuery('getOrderById', id);
  }

  async getOrderByToken(token) {
    return await this.executeQuery('getOrderByToken', token);
  }

  async getOrderItems(orderId) {
    return await this.executeQuery('getOrderItems', orderId);
  }

  async cancelOrder(id) {
    return await this.executeQuery('cancelOrder', id);
  }

  // Expense operations
  async getAllExpenses() {
    return await this.executeQuery('getAllExpenses');
  }

  async createExpense(category, amount, description, date, userId) {
    return await this.executeQuery('createExpense', category, amount, description, date, userId);
  }

  async updateExpense(id, category, amount, description, date) {
    return await this.executeQuery('updateExpense', id, category, amount, description, date);
  }

  async deleteExpense(id) {
    return await this.executeQuery('deleteExpense', id);
  }

  // Reports
  async getSalesReport(startDate, endDate) {
    return await this.executeQuery('getSalesReport', startDate, endDate);
  }

  async getProfitLoss(startDate, endDate) {
    return await this.executeQuery('getProfitLoss', startDate, endDate);
  }

  async getTopProducts(startDate, endDate, limit = 10) {
    return await this.executeQuery('getTopProducts', startDate, endDate, limit);
  }

  async getDashboardStats() {
    return await this.executeQuery('getDashboardStats');
  }

  // Print
  async printReceipt(content) {
    if (!window.electronAPI) {
      console.error('Electron API not available');
      return { success: false, error: 'Electron API not available' };
    }
    return await window.electronAPI.printReceipt(content);
  }

  // Settings operations
  async getNextTokenNumber() {
    return await this.executeQuery('getNextTokenNumber');
  }

  async resetTokenCounter() {
    return await this.executeQuery('resetTokenCounter');
  }

  async getCurrentTokenNumber() {
    return await this.executeQuery('getCurrentTokenNumber');
  }
}

const db = new DatabaseAPI();
export default db;


