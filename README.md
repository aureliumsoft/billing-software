# Cafe POS System

A modern, full-featured desktop Point of Sale (POS) application for cafes with token-based billing system. Built with Electron, React, and SQLite for offline functionality.

## Features

### 🛒 Complete POS System
- **Product Management**: Add, edit, and categorize products
- **Smart Search**: Quick product search and filtering by category
- **Shopping Cart**: Easy-to-use cart with quantity adjustments
- **Multiple Payment Methods**: Support for Cash, Card, and Online payments
- **Token-Based Billing**: Unique token generation for each order
- **Receipt Printing**: Professional receipt printing functionality
- **Real-time Stock Management**: Automatic stock updates on orders

### 📦 Inventory Management
- **Products**: Complete CRUD operations for products
- **Categories**: Organize products into categories
- **Stock Tracking**: Low stock alerts and monitoring
- **Cost & Pricing**: Track cost price and profit margins

### 📋 Orders Management
- **Order History**: View all past orders
- **Order Details**: Detailed view of each order with items
- **Cancel Orders**: Cancel orders and restore stock
- **Receipt Reprinting**: Print receipts for past orders
- **Status Tracking**: Monitor completed and cancelled orders

### 💰 Expenses Tracking
- **Category-based Expenses**: Track expenses by categories
- **Date Filtering**: View expenses by day, week, month
- **Detailed Records**: Add descriptions and amounts
- **Expense Analysis**: Visual breakdown of expenses

### 📊 Reports & Analytics
- **Profit/Loss Reports**: Comprehensive P&L statements
- **Sales Trends**: Visual charts showing sales over time
- **Top Products**: Identify best-selling items
- **Financial Breakdown**: Pie charts for revenue, costs, and expenses
- **Custom Date Ranges**: Filter reports by any date range
- **Real-time Statistics**: Dashboard with key metrics

### 🔐 Authentication
- **Secure Login**: User authentication system
- **Forgot Password**: Password reset with email/code verification
- **User Roles**: Support for different user roles (admin, cashier)
- **Session Management**: Persistent login sessions

### 🎨 Modern UI/UX
- **Beautiful Design**: Gradient-based modern interface
- **Responsive Layout**: Works on different screen sizes
- **Smooth Animations**: Fade-in and slide-up effects
- **Intuitive Navigation**: Easy-to-use sidebar navigation
- **Color-coded Information**: Visual cues for status and categories

## Technology Stack

- **Frontend**: React 18
- **Desktop Framework**: Electron 28
- **Database**: SQLite (better-sqlite3)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: React Icons
- **PDF Generation**: jsPDF

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone or navigate to the project directory**
```bash
cd cafe
```

2. **Install dependencies**
```bash
npm install
```

3. **Start the development server**
```bash
npm run electron-dev
```

This will:
- Start the React development server on http://localhost:3000
- Launch the Electron application automatically

### Building for Production

```bash
# Build the React app
npm run build

# Package the Electron app
npm run package
```

The packaged application will be available in the `dist` folder.

## Default Credentials

- **Username**: admin
- **Password**: admin123

## Database

The application uses SQLite for local data storage. The database is automatically created on first run at:
- Windows: `%APPDATA%/cafe-pos-system/cafe_pos.db`
- macOS: `~/Library/Application Support/cafe-pos-system/cafe_pos.db`
- Linux: `~/.config/cafe-pos-system/cafe_pos.db`

### Default Data

The application comes pre-seeded with:
- 1 admin user
- 4 product categories (Beverages, Food, Desserts, Bakery)
- 10 sample products

## Usage Guide

### 1. Login
- Use the default credentials or create new users
- "Remember me" option for convenience
- Forgot password feature available

### 2. Dashboard
- View today's sales and order count
- Monitor low stock items
- Quick access to recent orders
- Quick action buttons for common tasks

### 3. POS (Point of Sale)
- Search or browse products by category
- Click products to add to cart
- Adjust quantities as needed
- Select payment method (Cash/Card/Online)
- Complete order to generate token
- Print receipt

### 4. Products
- Add new products with details
- Edit existing products
- View stock levels and profit margins
- Delete products (marks as inactive)
- Track cost and selling prices

### 5. Categories
- Create product categories
- Edit category information
- Delete unused categories

### 6. Orders
- View all orders with filters
- Search by token number or cashier
- View detailed order information
- Cancel orders (restores stock)
- Reprint receipts

### 7. Expenses
- Track business expenses
- Categorize expenses
- Filter by date ranges
- View expense summaries
- Add descriptions for reference

### 8. Reports
- View Profit & Loss statements
- Analyze sales trends with charts
- Identify top-selling products
- See financial breakdowns
- Custom date range selection

## Features Breakdown

### Token-Based Billing
Each order generates a unique token number in format: `T{timestamp}{random}`
- Easy order tracking
- Professional receipt generation
- Unique identifier for each transaction

### Print Functionality
- Thermal printer compatible (80mm)
- Professional receipt layout
- Includes token number prominently
- Detailed item breakdown
- Payment information

### Stock Management
- Automatic stock deduction on orders
- Stock restoration on order cancellation
- Low stock warnings (< 10 units)
- Real-time stock updates

### Profit Calculation
- Tracks cost price and selling price
- Calculates profit per item
- Shows profit margins
- Comprehensive P&L reports

## Project Structure

```
cafe/
├── electron.js              # Electron main process
├── preload.js              # Electron preload script
├── database.js             # SQLite database handler
├── package.json            # Dependencies and scripts
├── public/
│   └── index.html         # HTML template
└── src/
    ├── App.js             # Main React component
    ├── index.js           # React entry point
    ├── index.css          # Global styles
    ├── utils/
    │   └── db.js          # Database API wrapper
    └── components/
        ├── Auth/          # Login & Forgot Password
        ├── Layout/        # Main layout & navigation
        ├── Dashboard/     # Dashboard component
        ├── POS/          # Point of Sale
        ├── Products/      # Product management
        ├── Categories/    # Category management
        ├── Orders/        # Order management
        ├── Expenses/      # Expense tracking
        └── Reports/       # Reports & analytics
```

## Troubleshooting

### Application won't start
- Ensure all dependencies are installed: `npm install`
- Check Node.js version: `node --version` (should be v16+)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Database errors
- The database is created automatically on first run
- Check file permissions in the application data directory
- Delete the database file to reset (will lose all data)

### Print not working
- Ensure printer is connected and configured
- Check printer settings in your OS
- Thermal printers should be set to 80mm width

### Build issues
- Run `npm run build` before packaging
- Check for any linting errors
- Ensure all dependencies are properly installed

## Development

### Adding New Features
1. Create component in appropriate directory
2. Add database methods in `database.js`
3. Add API wrapper methods in `src/utils/db.js`
4. Update routes in `App.js` if needed
5. Add navigation in `Layout.js`

### Database Schema Changes
1. Modify tables in `database.js` -> `initializeTables()`
2. Update seed data in `seedDefaultData()` if needed
3. Add new methods for CRUD operations
4. Update API wrapper in `src/utils/db.js`

## License

MIT License - Feel free to use this for your business!

## Support

For issues, questions, or contributions, please create an issue in the repository.

## Credits

Built with ❤️ using Electron, React, and SQLite.

---

**Note**: This is an offline-first application. All data is stored locally in SQLite database. No internet connection required for operation.


