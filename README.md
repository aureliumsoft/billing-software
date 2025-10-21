# ☕ Cafe POS System

<div align="center">

![Aurelium Soft](./public/aurelium.png)

**A Modern, Full-Featured Desktop Point of Sale Application**

Built with Electron, React, and SQLite

**Published by: [Aurelium Soft](https://aureliumsoft.com)**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Electron](https://img.shields.io/badge/Electron-28-blue)](https://www.electronjs.org/)
[![React](https://img.shields.io/badge/React-18-blue)](https://reactjs.org/)

</div>

---

## 📑 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Default Credentials](#default-credentials)
- [Feature Details](#feature-details)
- [Database Information](#database-information)
- [Project Structure](#project-structure)
- [Usage Guide](#usage-guide)
- [Configuration](#configuration)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Changelog](#changelog)
- [License](#license)
- [Support](#support)

---

## 🎯 Overview

Cafe POS System is a modern, offline-first desktop application designed specifically for cafes, restaurants, and small retail businesses. It features a beautiful, intuitive interface with token-based billing, comprehensive inventory management, and powerful reporting capabilities.

### Why Cafe POS System?

- ✅ **100% Offline** - No internet required, all data stored locally
- ✅ **Fast & Responsive** - Optimized for speed and efficiency
- ✅ **Easy to Use** - Intuitive interface, minimal training needed
- ✅ **Secure** - Local data storage, no cloud dependencies
- ✅ **Customizable** - Dynamic branding with your logo and name
- ✅ **Professional** - Receipt printing, token-based billing
- ✅ **Complete** - From inventory to reports, everything you need

---

## 🚀 Key Features

### 🛒 Point of Sale (POS)
- **Quick Product Search** - Find products instantly by name
- **Category Filtering** - Browse products by category
- **Visual Product Cards** - Product images for easy identification
- **Smart Cart Management** - Add, remove, adjust quantities
- **Multiple Payment Methods** - Cash, Card, Online
- **Token-Based Billing** - Unique token for each order
- **Receipt Printing** - Professional thermal printer support (80mm)
- **Stock Validation** - Real-time stock checking (optional)

### 📦 Inventory Management
- **Product Management** - Complete CRUD operations
- **Product Images** - Upload and display product images
- **Category Organization** - Organize products efficiently
- **Stock Tracking** - Monitor inventory levels (optional)
- **Low Stock Alerts** - Get notified when stock is low
- **Cost & Pricing** - Track costs and profit margins
- **Bulk Operations** - Manage multiple products efficiently

### 📋 Order Management
- **Order History** - View all past orders with filters
- **Token Search** - Find orders by token number
- **Order Details** - Complete breakdown of each order
- **Receipt Reprinting** - Print receipts for past orders
- **Order Cancellation** - Cancel orders with stock restoration
- **Status Tracking** - Monitor completed/cancelled orders
- **Payment Information** - Track payment methods used

### 💰 Expense Tracking
- **Category-Based Expenses** - Organize expenses by type
- **Date Filtering** - View by day, week, month, or custom range
- **Detailed Records** - Add descriptions and amounts
- **Expense Analysis** - Visual breakdown with charts
- **Financial Planning** - Track all business expenses

### 📊 Reports & Analytics
- **Profit/Loss Statement** - Comprehensive P&L reports
- **Sales Trends** - Line charts showing sales over time
- **Daily Sales Breakdown** - Detailed daily statistics
- **Top Products** - Identify best-selling items
- **Revenue Analysis** - Pie charts for financial data
- **Custom Date Ranges** - Filter reports by any period
- **Export to CSV** - Download reports for analysis
- **Print Reports** - Print-optimized report layouts
- **Real-time Statistics** - Live dashboard metrics

### 🔐 Authentication & Security
- **Secure Login** - User authentication system
- **Offline Password Reset** - Security questions or master code
- **User Roles** - Admin and cashier roles
- **Session Management** - Persistent login with "Remember Me"
- **Context Isolation** - Secure Electron architecture

### ⚙️ Settings & Customization
- **Dynamic Branding** - Custom business name and logo
- **Stock Management Toggle** - Enable/disable stock features
- **Token Number Reset** - Daily token number management
- **System Information** - View application details
- **Real-time Updates** - Changes reflect instantly

### 🎨 Modern UI/UX
- **Beautiful Design** - Modern gradient-based interface
- **Responsive Layout** - Works on different screen sizes
- **Smooth Animations** - Professional fade and slide effects
- **Intuitive Navigation** - Easy-to-use sidebar menu
- **Color-coded Status** - Visual cues for important information
- **Interactive Charts** - Powered by Recharts
- **Loading States** - User-friendly loading indicators

---

## 🛠️ Technology Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Electron** | 28.x | Desktop application framework |
| **React** | 18.x | Frontend UI library |
| **SQLite** | (better-sqlite3) | Local database |
| **Tailwind CSS** | 3.x | Styling and design |
| **Recharts** | 2.x | Charts and data visualization |
| **React Icons** | 5.x | Beautiful icon sets |
| **React Router** | 6.x | Application routing |
| **jsPDF** | 2.x | PDF generation for receipts |

---

## 📥 Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** (optional) - For cloning the repository

### Step 1: Get the Project

```bash
# If you have the project folder, navigate to it
cd cafe

# Or clone from repository
git clone <repository-url>
cd cafe
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required dependencies including:
- Electron
- React and React Router
- Tailwind CSS
- SQLite (better-sqlite3)
- All other dependencies

**Note:** If you encounter any issues during installation, see the [Troubleshooting](#troubleshooting) section.

---

## 🚀 Running the Application

### Development Mode

To run the application in development mode with hot-reload:

```bash
npm run electron-dev
```

This command will:
1. Start the React development server on `http://localhost:3000`
2. Wait for the server to be ready
3. Launch the Electron application automatically
4. Enable React DevTools for debugging

**Expected Output:**
```
🚀 Starting Cafe POS Development Environment...
📦 Starting React development server...
✅ React server is ready!
🔧 Starting Electron in 3 seconds...
⚡ Launching Electron...
```

### Alternative: Start Components Separately

If you prefer more control, you can start each component separately:

**Terminal 1 - React Dev Server:**
```bash
npm start
```

**Terminal 2 - Electron (after React is ready):**
```bash
npm run electron
```

---

## 📦 Building for Production

### Step 1: Build the React Application

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

### Step 2: Package the Electron Application

```bash
npm run package
```

This will create a distributable application in the `dist` folder.

**Output:**
- Windows: `dist/Cafe POS System Setup 1.0.0.exe`
- The installer includes everything needed to run the application

### Distribution

You can distribute the installer file to users. They simply need to:
1. Run the installer
2. Launch the application
3. Login with credentials you provide

---

## 🔑 Default Credentials

When you first run the application, use these credentials:

| Field | Value |
|-------|-------|
| **Username** | `admin` |
| **Password** | `admin123` |
| **Security Question** | What is your favorite color? |
| **Security Answer** | blue |

**⚠️ Important:** Change the default password after first login for security!

---

## 📚 Feature Details

### Token-Based Billing System

Each order generates a unique token number:
- **Format:** `T{timestamp}{random4digits}`
- **Example:** `T17298765431234`
- **Benefits:**
  - Easy order tracking and reference
  - Professional receipt generation
  - Unique identifier for each transaction
  - Customer can use token for inquiries

### Dynamic Branding

Customize the application with your business identity:
- **Brand Name:** Appears on receipts, sidebar, and login
- **Logo:** Upload your business logo (base64 stored in DB)
- **Real-time Updates:** Changes reflect instantly across the app
- **Receipt Branding:** Your logo and name on all receipts

### Stock Management (Optional)

The stock management feature can be toggled on/off:

**When Enabled:**
- Stock levels tracked automatically
- Low stock alerts (< 10 units)
- Stock validation during orders
- Stock restoration on cancellation
- Stock reports and analytics

**When Disabled:**
- No stock tracking required
- Suitable for service-based businesses
- Simpler product management
- Focus on sales and revenue

### Offline Password Reset

Secure password reset without email:

**Method 1: Security Question**
- Answer your pre-set security question
- Immediate password reset

**Method 2: Master Reset Code**
- Use the master code: `RESET2024`
- Emergency password recovery

### Product Images

Add visual appeal to your POS:
- **Upload:** Select image file during product creation
- **Storage:** Base64 encoded in SQLite database
- **Display:** Shows in POS product cards
- **Fallback:** Default emoji if no image provided
- **No External Storage:** All images stored in database

### Receipt Printing

Professional receipt printing with thermal printer support:
- **Paper Width:** 80mm thermal printers
- **Content:**
  - Your business logo and name
  - Date and time
  - Unique token number
  - Item breakdown with quantities and prices
  - Subtotal, tax information
  - Total amount
  - Payment method
  - Thank you message
- **Reprint:** Print past order receipts anytime

### Reports Export

Multiple export options for analysis:
- **CSV Export:** Download reports as CSV files
- **Print:** Print-optimized report layouts
- **Custom Ranges:** Select any date range
- **Multiple Charts:** Bar, line, and pie charts
- **Daily Breakdown:** Detailed day-by-day statistics

---

## 💾 Database Information

### Database Location

The SQLite database is automatically created at:

| Platform | Location |
|----------|----------|
| **Windows** | `%APPDATA%/cafe-pos-system/cafe_pos.db` |
| **macOS** | `~/Library/Application Support/cafe-pos-system/cafe_pos.db` |
| **Linux** | `~/.config/cafe-pos-system/cafe_pos.db` |

### Database Schema

The database includes the following tables:

1. **users** - User accounts and authentication
2. **categories** - Product categories
3. **products** - Product information with images
4. **orders** - Order records with token numbers
5. **order_items** - Individual items in each order
6. **expenses** - Business expense records
7. **settings** - Application settings (brand, stock management)

### Default Data

On first run, the database is seeded with:

**Users:**
- 1 Admin user (admin/admin123)

**Categories:**
- Beverages
- Food
- Desserts
- Bakery

**Products:**
- 10 sample products with:
  - Name, description
  - Cost and selling price
  - Stock quantity
  - Category assignment
  - Default emoji images

**Settings:**
- Stock management: Enabled
- Brand name: "Cafe POS"
- Brand logo: Default Aurelium logo

### Backup & Restore

**Backup:**
Simply copy the database file from the location above to a safe place.

**Restore:**
Replace the database file with your backup.

**Reset:**
Delete the database file, and the application will create a fresh one with default data.

---

## 📁 Project Structure

```
cafe/
├── electron.js                 # Electron main process
├── electron-dev.js            # Electron development process
├── preload.js                 # Electron preload script
├── database.js                # SQLite database handler
├── start-dev.js              # Development orchestrator
├── start-app.bat             # Windows startup script
├── package.json              # Dependencies and scripts
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
├── README.md                 # This file
├── LICENSE                   # MIT License
├── public/
│   ├── index.html           # HTML template
│   ├── aurelium.png         # Aurelium Soft logo
│   └── electron.js          # Electron config
├── build/                    # Production build (generated)
├── dist/                     # Packaged application (generated)
└── src/
    ├── App.js               # Main React component with routing
    ├── index.js            # React entry point
    ├── index.css           # Global styles with Tailwind
    ├── utils/
    │   └── db.js           # Database API wrapper
    └── components/
        ├── Auth/
        │   ├── Login.js               # Login page
        │   └── ForgotPassword.js     # Password reset
        ├── Layout/
        │   └── Layout.js              # Main layout & sidebar
        ├── Dashboard/
        │   └── Dashboard.js           # Dashboard with metrics
        ├── POS/
        │   └── POS.js                 # Point of Sale interface
        ├── Products/
        │   └── Products.js            # Product management
        ├── Categories/
        │   └── Categories.js          # Category management
        ├── Orders/
        │   └── Orders.js              # Order management
        ├── Expenses/
        │   └── Expenses.js            # Expense tracking
        ├── Reports/
        │   └── Reports.js             # Reports & analytics
        ├── Settings/
        │   └── Settings.js            # Application settings
        └── Help/
            └── Help.js                # Help & support
```

---

## 📖 Usage Guide

### 1. Login

1. Launch the application
2. Enter username and password
3. Check "Remember me" for persistent login (optional)
4. Click "Sign In"

**Forgot Password?**
- Click "Forgot Password?"
- Enter username
- Choose security question or master code
- Reset your password

### 2. Dashboard

The dashboard provides an overview of your business:

**Key Metrics:**
- Today's sales amount
- Number of orders today
- Total products in inventory
- Low stock items (if enabled) or weekly sales

**Quick Actions:**
- Start New Order (POS)
- Add Product
- View Orders
- View Reports
- Access Settings

**Recent Orders:**
- View last 5 orders
- Quick access to order details

### 3. Point of Sale (POS)

**Taking an Order:**
1. Navigate to POS from sidebar
2. Browse products by category or search
3. Click products to add to cart
4. Adjust quantities using +/- buttons
5. Review cart total
6. Select payment method
7. Click "Complete Order"
8. Print receipt (optional)

**Tips:**
- Use search for quick product lookup
- Category filters for easy browsing
- Product images for visual selection
- Stock validation prevents overselling

### 4. Product Management

**Add New Product:**
1. Go to Products
2. Click "Add New Product"
3. Enter product details:
   - Name
   - Category
   - Price
   - Cost (optional)
   - Stock quantity (optional)
   - Description (optional)
   - Upload image (optional)
4. Click "Add Product"

**Edit Product:**
- Click edit icon on product row
- Update information
- Click "Save Changes"

**Delete Product:**
- Click delete icon
- Confirm deletion
- Product is marked inactive (not deleted)

### 5. Category Management

**Add Category:**
1. Go to Categories
2. Click "Add New Category"
3. Enter category name
4. Click "Add Category"

**Edit/Delete:**
- Use action buttons on each category row
- Cannot delete categories with products

### 6. Order Management

**View Orders:**
- See all orders with details
- Filter by date, status, payment method
- Search by token number or cashier

**Order Details:**
- Click on any order to view full details
- See all items, quantities, prices
- View customer and payment information

**Cancel Order:**
- Click "Cancel Order" button
- Confirm cancellation
- Stock automatically restored (if enabled)

**Reprint Receipt:**
- Click "Print Receipt" on any order
- Receipt prints with original details

### 7. Expense Tracking

**Add Expense:**
1. Go to Expenses
2. Click "Add New Expense"
3. Enter:
   - Category (e.g., Rent, Utilities, Supplies)
   - Amount
   - Description
   - Date
4. Click "Add Expense"

**View Expenses:**
- Filter by date range
- View by category
- See expense trends
- Analyze spending patterns

### 8. Reports & Analytics

**Generate Reports:**
1. Go to Reports
2. Select date range
3. View comprehensive analytics:
   - Profit & Loss Statement
   - Sales Trends (line chart)
   - Top Selling Products (bar chart)
   - Revenue Breakdown (pie chart)
   - Daily Sales Breakdown (table)

**Export Options:**
- **CSV Export:** Download data for Excel
- **Print:** Print professional reports

**Key Metrics:**
- Total revenue
- Cost of goods sold (if stock enabled)
- Gross profit
- Expenses
- Net profit
- Profit margin %

### 9. Settings

**Brand Customization:**
- Edit brand name
- Upload business logo
- Changes reflect instantly

**Stock Management:**
- Toggle stock tracking on/off
- Affects POS, products, and reports

**Token Management:**
- View current token number
- Reset token number (with confirmation)

**System Information:**
- Application version
- Database location
- Developer information

### 10. Help

Access help page for:
- Aurelium Soft contact information
- Support details
- Quick help guides
- Social media links
- Version information

---

## ⚙️ Configuration

### Customizing the Application

**Brand Name & Logo:**
1. Go to Settings
2. Click "Edit" in Brand Customization
3. Enter new business name
4. Upload logo image
5. Click "Save Changes"

**Stock Management:**
1. Go to Settings
2. Toggle "Stock Management"
3. Changes apply immediately

**User Management:**
Currently, users can be managed through the database. Future updates will include a user management UI.

### Environment Variables

The application uses `electron-is-dev` to detect development mode automatically. No environment variables needed.

---

## 🔧 Troubleshooting

### Installation Issues

**Problem:** `npm install` fails
```bash
# Solution 1: Clear npm cache
npm cache clean --force
npm install

# Solution 2: Delete node_modules and reinstall
rm -rf node_modules
npm install

# Solution 3: Use legacy peer deps
npm install --legacy-peer-deps
```

**Problem:** `better-sqlite3` installation fails
```bash
# Solution: Install build tools
# Windows:
npm install --global windows-build-tools

# macOS:
xcode-select --install

# Linux:
sudo apt-get install build-essential
```

### Runtime Issues

**Problem:** Application won't start
```bash
# Check Node.js version
node --version  # Should be v16 or higher

# Reinstall dependencies
rm -rf node_modules
npm install

# Build and try again
npm run build
npm run electron
```

**Problem:** "Port 3000 is already in use"
```bash
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:3000 | xargs kill -9
```

**Problem:** Blank screen on startup
```bash
# Make sure React server is running
npm start

# In another terminal, start Electron
npm run electron

# Or use the combined command
npm run electron-dev
```

**Problem:** Database errors
- Delete database file (see [Database Location](#database-location))
- Restart application (will create fresh database)
- Note: All data will be lost

**Problem:** Images not showing
- Check image file size (keep under 1MB)
- Use common formats (JPG, PNG, GIF, WebP)
- Check browser console for errors

### Development Issues

**Problem:** Hot reload not working
```bash
# Restart development server
# Press Ctrl+C to stop
npm run electron-dev
```

**Problem:** Build fails
```bash
# Check for linting errors
npm run build

# Fix any reported errors in code
```

**Problem:** Electron opens in VS Code
```bash
# Use npx to run Electron
npx electron electron-dev.js

# Or use the provided scripts
npm run electron-dev
```

### Printer Issues

**Problem:** Receipt not printing
- Verify printer is connected and on
- Check printer is set as default in OS
- Ensure printer is 80mm thermal printer
- Test printer with OS print test page

**Problem:** Receipt formatting issues
- Adjust CSS in `src/components/POS/POS.js`
- Modify receipt template as needed
- Test with `window.print()`

---

## 👩‍💻 Development

### Adding New Features

1. **Create Component**
   ```javascript
   // src/components/NewFeature/NewFeature.js
   import React from 'react';
   
   export default function NewFeature() {
     return <div>New Feature</div>;
   }
   ```

2. **Add Database Methods**
   ```javascript
   // database.js
   getNewData() {
     const stmt = this.db.prepare('SELECT * FROM table');
     return stmt.all();
   }
   ```

3. **Add API Wrapper**
   ```javascript
   // src/utils/db.js
   export const getNewData = async () => {
     return await window.api.executeQuery('getNewData');
   };
   ```

4. **Add Route**
   ```javascript
   // src/App.js
   import NewFeature from './components/NewFeature/NewFeature';
   
   <Route path="newfeature" element={<NewFeature />} />
   ```

5. **Add Navigation**
   ```javascript
   // src/components/Layout/Layout.js
   {
     name: 'New Feature',
     path: '/newfeature',
     icon: FiStar
   }
   ```

### Database Schema Changes

1. **Update Table Definition**
   ```javascript
   // database.js - initializeTables()
   this.db.exec(`
     CREATE TABLE IF NOT EXISTS new_table (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       name TEXT NOT NULL
     )
   `);
   ```

2. **Add Migration**
   ```javascript
   // database.js - migrateDatabase()
   const version = this.getVersion();
   if (version < 2) {
     this.db.exec('ALTER TABLE...');
     this.setVersion(2);
   }
   ```

3. **Update Seed Data** (if needed)
   ```javascript
   // database.js - seedDefaultData()
   ```

### Code Style

- Use functional components with hooks
- Follow Tailwind CSS utility-first approach
- Keep components focused and reusable
- Add comments for complex logic
- Use meaningful variable names

### Testing

Before committing changes:

1. Test in development mode
2. Build and test production build
3. Test all affected features
4. Check for console errors
5. Verify database operations

---

## 📝 Changelog

### Version 1.0.0 (Current)

**🎉 Initial Release**

**Core Features:**
- ✅ Complete POS system with token-based billing
- ✅ Product management with image support
- ✅ Category management
- ✅ Order management with cancellation
- ✅ Expense tracking
- ✅ Comprehensive reports with export
- ✅ User authentication
- ✅ Offline password reset

**Customization:**
- ✅ Dynamic brand name and logo
- ✅ Optional stock management
- ✅ Token number management
- ✅ Settings page

**UI/UX:**
- ✅ Modern gradient design
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Interactive charts
- ✅ Print-optimized reports

**Recent Updates:**
- ✅ Fixed token number constraint issue
- ✅ Improved Electron development setup
- ✅ Enhanced receipt printing with branding
- ✅ Added product image support
- ✅ Implemented offline password reset
- ✅ Made stock management optional
- ✅ Added CSV export and print for reports
- ✅ Dynamic branding across application
- ✅ Help page with Aurelium Soft details
- ✅ Production-ready cleanup

---

## 📄 License

MIT License

Copyright (c) 2024 Aurelium Soft

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 💬 Support

### Get Help

**Aurelium Soft**
- 📧 Email: support@aureliumsoft.com
- 🌐 Website: https://aureliumsoft.com
- 📱 WhatsApp: +92 300 1234567
- 📍 Location: Lahore, Pakistan

### Social Media

- [Facebook](https://facebook.com/aureliumsoft)
- [Instagram](https://instagram.com/aureliumsoft)
- [LinkedIn](https://linkedin.com/company/aureliumsoft)

### Reporting Issues

If you encounter any bugs or have feature requests:
1. Check the [Troubleshooting](#troubleshooting) section first
2. Contact us via email with detailed information:
   - What you were trying to do
   - What happened instead
   - Screenshots (if applicable)
   - Error messages

### Documentation

- This README contains all necessary documentation
- Check the Help page within the application
- Visit our website for video tutorials (coming soon)

---

## 🙏 Credits

**Developed by:** Aurelium Soft

**Built with:**
- [Electron](https://www.electronjs.org/) - Desktop application framework
- [React](https://reactjs.org/) - UI library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [SQLite](https://www.sqlite.org/) - Database engine
- [Recharts](https://recharts.org/) - Charting library

**Special Thanks:**
- All open-source contributors
- The Electron and React communities
- Our beta testers

---

## 🌟 Features Coming Soon

- 📱 Mobile companion app
- ☁️ Optional cloud backup
- 👥 Advanced user management
- 🎫 Discount and coupon system
- 📊 More advanced analytics
- 🌍 Multi-language support
- 🔔 Desktop notifications
- 📧 Email receipt option

---

<div align="center">

**Thank you for using Cafe POS System!**

Made with ❤️ by [Aurelium Soft](https://aureliumsoft.com)

⭐ Star us on GitHub | 🐛 Report Issues | 💡 Request Features

---

**Version 1.0.0** | **Last Updated:** October 2024

</div>