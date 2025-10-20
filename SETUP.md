# Quick Setup Guide

## Installation Steps

1. **Open Terminal/Command Prompt** in the project directory

2. **Install all dependencies**
   ```bash
   npm install
   ```

3. **Start the application in development mode**
   ```bash
   npm run electron-dev
   ```

   This command will:
   - Start React development server
   - Wait for it to be ready
   - Launch Electron application automatically

## First Run

When you first start the application:

1. **Login Screen** will appear
2. Use default credentials:
   - Username: `admin`
   - Password: `admin123`
3. The database will be created automatically with sample data

## Project Structure Created

```
cafe/
├── package.json              ✅ Dependencies configuration
├── electron.js               ✅ Electron main process
├── electron-is-dev.js        ✅ Development detection
├── preload.js                ✅ Electron security bridge
├── database.js               ✅ SQLite database handler
├── tailwind.config.js        ✅ Tailwind CSS configuration
├── postcss.config.js         ✅ PostCSS configuration
├── README.md                 ✅ Complete documentation
├── SETUP.md                  ✅ This file
├── .gitignore               ✅ Git ignore rules
├── public/
│   └── index.html           ✅ HTML template
└── src/
    ├── index.js             ✅ React entry point
    ├── index.css            ✅ Global styles with Tailwind
    ├── App.js               ✅ Main app with routing
    ├── utils/
    │   └── db.js            ✅ Database API wrapper
    └── components/
        ├── Auth/
        │   ├── Login.js                    ✅ Login page
        │   └── ForgotPassword.js          ✅ Password reset
        ├── Layout/
        │   └── Layout.js                   ✅ Main layout
        ├── Dashboard/
        │   └── Dashboard.js                ✅ Dashboard
        ├── POS/
        │   └── POS.js                      ✅ Point of Sale
        ├── Products/
        │   └── Products.js                 ✅ Product management
        ├── Categories/
        │   └── Categories.js               ✅ Category management
        ├── Orders/
        │   └── Orders.js                   ✅ Order management
        ├── Expenses/
        │   └── Expenses.js                 ✅ Expense tracking
        └── Reports/
            └── Reports.js                  ✅ Reports & analytics
```

## Development Commands

```bash
# Start development mode
npm run electron-dev

# Build React app only
npm run build

# Start Electron only (after build)
npm run electron

# Package for distribution
npm run package
```

## Troubleshooting

### Port already in use
If you see "Port 3000 is already in use":
```bash
# Kill the process using port 3000
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

### Dependencies not installing
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### Electron not starting
```bash
# Make sure build exists
npm run build

# Then try electron
npm run electron
```

## What's Included

### ✅ Complete Features
- [x] Login & Authentication
- [x] Forgot Password
- [x] Dashboard with Statistics
- [x] Point of Sale (POS)
- [x] Product Management
- [x] Category Management
- [x] Order Management
- [x] Expense Tracking
- [x] Profit/Loss Reports
- [x] Sales Analytics
- [x] Token-Based Billing
- [x] Receipt Printing
- [x] Stock Management
- [x] Multiple Payment Methods

### 💎 Modern UI/UX Features
- Beautiful gradient designs
- Smooth animations
- Responsive layout
- Intuitive navigation
- Color-coded information
- Interactive charts
- Real-time updates

### 🔒 Security
- Secure user authentication
- Role-based access
- Context isolation in Electron
- No remote code execution

### 💾 Database
- SQLite for offline operation
- Automatic database creation
- Pre-seeded with sample data
- Complete CRUD operations

## Sample Data Included

### Users
- 1 Admin user (admin/admin123)

### Categories
- Beverages
- Food
- Desserts
- Bakery

### Products
- 10 sample products with stock
- Price and cost tracking
- Category assignments

## Next Steps

1. ✅ Run `npm install`
2. ✅ Run `npm run electron-dev`
3. ✅ Login with admin/admin123
4. ✅ Explore the features!
5. 🎯 Start adding your actual products
6. 🎯 Configure your categories
7. 🎯 Start taking orders!

## Production Deployment

When ready to deploy:

1. Update the default admin password
2. Add your actual products and categories
3. Build the application: `npm run build`
4. Package for your platform: `npm run package`
5. Distribute the packaged app from the `dist` folder

## Support

For any issues or questions, refer to the main README.md file.

---

Happy selling! 🎉


