import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiShoppingCart,
  FiTrash2,
  FiPlus,
  FiMinus,
  FiDollarSign,
  FiCreditCard,
  FiSmartphone,
  FiPrinter,
  FiCheck
} from 'react-icons/fi';
import db from '../../utils/db';

const POS = ({ currentUser }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [amountReceived, setAmountReceived] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [stockManagementEnabled, setStockManagementEnabled] = useState(true);
  const [brandName, setBrandName] = useState('Cafe POS');
  const [brandLogo, setBrandLogo] = useState('');

  useEffect(() => {
    loadProducts();
    loadCategories();
    loadStockSetting();
    loadBrandSettings();
    
    // Listen for brand updates from Settings page
    const handleBrandUpdate = (event) => {
      const { brandName, brandLogo } = event.detail;
      setBrandName(brandName);
      setBrandLogo(brandLogo);
    };

    window.addEventListener('brandUpdated', handleBrandUpdate);
    
    return () => {
      window.removeEventListener('brandUpdated', handleBrandUpdate);
    };
  }, []);

  const loadStockSetting = async () => {
    try {
      const result = await db.getStockManagementEnabled();
      if (result.success) {
        setStockManagementEnabled(result.data);
      }
    } catch (error) {
      console.error('Error loading stock setting:', error);
    }
  };

  const loadBrandSettings = async () => {
    try {
      const nameResult = await db.getBrandName();
      if (nameResult.success) {
        setBrandName(nameResult.data);
      }

      const logoResult = await db.getBrandLogo();
      if (logoResult.success) {
        setBrandLogo(logoResult.data);
      }
    } catch (error) {
      console.error('Error loading brand settings:', error);
    }
  };

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  const loadProducts = async () => {
    try {
      const result = await db.getActiveProducts();
      if (result.success) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const result = await db.getAllCategories();
      if (result.success) {
        setCategories(result.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category_id === parseInt(selectedCategory));
    }

    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  };

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      // Check stock only if stock management is enabled
      if (stockManagementEnabled && existingItem.quantity >= product.stock) {
        alert('Insufficient stock!');
        return;
      }
      setCart(cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
          : item
      ));
    } else {
      // Check stock only if stock management is enabled
      if (stockManagementEnabled && product.stock <= 0) {
        alert('Product out of stock!');
        return;
      }
      setCart([...cart, {
        ...product,
        quantity: 1,
        subtotal: product.price
      }]);
    }
  };

  const updateQuantity = (productId, newQuantity) => {
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    // Check stock only if stock management is enabled
    if (stockManagementEnabled && newQuantity > product.stock) {
      alert('Insufficient stock!');
      return;
    }

    setCart(cart.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
        : item
    ));
  };

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
    setShowCheckout(false);
    setAmountReceived('');
    setNotes('');
  };

  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const generateTokenNumber = async () => {
    try {
      const result = await db.getNextTokenNumber();
      if (result.success) {
        return result.data;
      }
      return 1;
    } catch (error) {
      console.error('Error generating token:', error);
      return 1;
    }
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert('Cart is empty!');
      return;
    }

    const total = getTotal();

    if (paymentMethod === 'cash') {
      const received = parseFloat(amountReceived);
      if (isNaN(received) || received < total) {
        alert('Insufficient amount received!');
        return;
      }
    }

    setLoading(true);

    try {
      const tokenNumber = await generateTokenNumber();
      const orderItems = cart.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal
      }));

      const result = await db.createOrder(
        tokenNumber,
        currentUser.id,
        total,
        paymentMethod,
        orderItems,
        notes
      );

      if (result.success) {
        const order = {
          id: result.data,
          token_number: tokenNumber,
          total_amount: total,
          payment_method: paymentMethod,
          items: cart,
          created_at: new Date().toISOString(),
          amount_received: paymentMethod === 'cash' ? parseFloat(amountReceived) : total,
          change: paymentMethod === 'cash' ? parseFloat(amountReceived) - total : 0
        };

        setCompletedOrder(order);
        setOrderComplete(true);
        await loadProducts(); // Reload to update stock
      } else {
        alert('Failed to create order: ' + result.error);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to complete order!');
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = async () => {
    if (!completedOrder) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: 'Courier New', monospace;
              width: 80mm;
              margin: 0;
              padding: 10mm;
              font-size: 12px;
            }
            .center { text-align: center; }
            .bold { font-weight: bold; }
            .line { border-top: 1px dashed #000; margin: 5px 0; }
            table { width: 100%; border-collapse: collapse; }
            td { padding: 2px 0; }
            .right { text-align: right; }
            .logo { width: 60px; height: 60px; margin: 10px auto; object-fit: cover; border-radius: 8px; }
          </style>
        </head>
        <body>
          ${brandLogo ? `<img src="${brandLogo}" alt="Logo" class="logo" />` : `<img src="./aurelium.png" alt="Aurelium Logo" class="logo" />`}
          <div class="center bold" style="font-size: 16px;">${brandName.toUpperCase()}</div>
          <div class="center" style="font-size: 10px;">Token Based Billing Receipt</div>
          <div class="line"></div>
          <div class="center bold" style="font-size: 24px; margin: 10px 0;">
            TOKEN #${completedOrder.token_number}
          </div>
          <div class="center" style="font-size: 9px; color: #888; margin: -5px 0 10px 0;">
            Receipt No: ${completedOrder.id}
          </div>
          <div class="line"></div>
          <table>
            <tr>
              <td>Date:</td>
              <td class="right">${new Date(completedOrder.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Cashier:</td>
              <td class="right">${currentUser.username}</td>
            </tr>
          </table>
          <div class="line"></div>
          <table>
            ${completedOrder.items.map(item => `
              <tr>
                <td colspan="2" class="bold">${item.name}</td>
              </tr>
              <tr>
                <td>${item.quantity} x PKR ${Math.round(item.price)}</td>
                <td class="right">PKR ${Math.round(item.subtotal)}</td>
              </tr>
            `).join('')}
          </table>
          <div class="line"></div>
          <table>
            <tr class="bold">
              <td style="font-size: 14px;">TOTAL:</td>
              <td class="right" style="font-size: 14px;">PKR ${Math.round(completedOrder.total_amount)}</td>
            </tr>
            <tr>
              <td>Payment Method:</td>
              <td class="right">${completedOrder.payment_method.toUpperCase()}</td>
            </tr>
            ${completedOrder.payment_method === 'cash' ? `
              <tr>
                <td>Amount Received:</td>
                <td class="right">PKR ${Math.round(completedOrder.amount_received)}</td>
              </tr>
              <tr>
                <td>Change:</td>
                <td class="right">PKR ${Math.round(completedOrder.change)}</td>
              </tr>
            ` : ''}
          </table>
          <div class="line"></div>
          <div class="center" style="margin-top: 20px; font-size: 10px;">
            Thank you for your order!<br>
            Please keep this receipt for your records.
          </div>
        </body>
      </html>
    `;

    await db.printReceipt(receiptHTML);
  };

  const startNewOrder = () => {
    clearCart();
    setOrderComplete(false);
    setCompletedOrder(null);
  };

  if (orderComplete && completedOrder) {
    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <FiCheck className="text-4xl text-green-600" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Completed!</h2>
          <p className="text-gray-600 mb-6">Your order has been successfully processed</p>

          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-8 mb-6">
            <p className="text-sm text-gray-600 mb-2">Token Number</p>
            <p className="text-5xl font-bold text-blue-600 mb-2">#{completedOrder.token_number}</p>
            <p className="text-xs text-gray-400 mb-4">Receipt No: {completedOrder.id}</p>
            <p className="text-2xl font-semibold text-gray-800">
              Total: PKR {Math.round(completedOrder.total_amount)}
            </p>
            {completedOrder.payment_method === 'cash' && (
              <div className="mt-4 space-y-1">
                <p className="text-gray-600">
                  Received: PKR {Math.round(completedOrder.amount_received)}
                </p>
                <p className="text-gray-600">
                  Change: PKR {Math.round(completedOrder.change)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={printReceipt}
              className="btn-primary flex items-center justify-center space-x-2"
            >
              <FiPrinter />
              <span>Print Receipt</span>
            </button>
            <button
              onClick={startNewOrder}
              className="btn-success flex items-center justify-center space-x-2"
            >
              <FiPlus />
              <span>New Order</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-4 md:gap-6 animate-fade-in">
      {/* Products Section */}
      <div className="flex-1 flex flex-col space-y-3 md:space-y-4 min-h-0">
        {/* Search and Filter */}
        <div className="card space-y-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-10"
              placeholder="Search products..."
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                selectedCategory === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id.toString())}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                  selectedCategory === category.id.toString()
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
            {filteredProducts.map(product => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className="card cursor-pointer hover:shadow-lg transition-shadow duration-200 flex flex-col"
              >
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg h-32 flex items-center justify-center mb-3 overflow-hidden">
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl">☕</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">{product.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{product.category_name}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    PKR {Math.round(product.price)}
                  </span>
                  {stockManagementEnabled && (
                    <span className={`text-xs px-2 py-1 rounded ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      Stock: {product.stock}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Section */}
      <div className="w-full lg:w-96 flex flex-col space-y-3 md:space-y-4">
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center">
              <FiShoppingCart className="mr-2" />
              Cart ({cart.length})
            </h2>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium"
              >
                Clear All
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FiShoppingCart className="text-5xl mx-auto mb-3 opacity-30" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add items to get started</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-600">PKR {Math.round(item.price)} each</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 bg-white rounded-lg border">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-2 hover:bg-gray-100 rounded-l-lg"
                      >
                        <FiMinus className="text-sm" />
                      </button>
                      <span className="px-3 font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-2 hover:bg-gray-100 rounded-r-lg"
                      >
                        <FiPlus className="text-sm" />
                      </button>
                    </div>
                    <span className="font-bold text-blue-600">
                      PKR {Math.round(item.subtotal)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <>
            {!showCheckout ? (
              <div className="card">
                <div className="flex justify-between items-center text-xl font-bold mb-4">
                  <span>Total:</span>
                  <span className="text-2xl text-green-600">
                    PKR {Math.round(getTotal())}
                  </span>
                </div>
                <button
                  onClick={() => setShowCheckout(true)}
                  className="w-full btn-success py-3 text-lg font-semibold"
                >
                  Proceed to Checkout
                </button>
              </div>
            ) : (
              <div className="card space-y-4">
                <h3 className="font-bold text-lg text-gray-800">Payment Details</h3>

                {/* Payment Method */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                        paymentMethod === 'cash'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FiDollarSign className="text-2xl mb-1" />
                      <span className="text-xs font-medium">Cash</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                        paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FiCreditCard className="text-2xl mb-1" />
                      <span className="text-xs font-medium">Card</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center ${
                        paymentMethod === 'online'
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <FiSmartphone className="text-2xl mb-1" />
                      <span className="text-xs font-medium">Online</span>
                    </button>
                  </div>
                </div>

                {/* Amount Received (for cash) */}
                {paymentMethod === 'cash' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Amount Received
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={amountReceived}
                      onChange={(e) => setAmountReceived(e.target.value)}
                      className="input-field"
                      placeholder="0"
                    />
                    {amountReceived && parseFloat(amountReceived) >= getTotal() && (
                      <p className="text-sm text-green-600 mt-2">
                        Change: PKR {Math.round(parseFloat(amountReceived) - getTotal())}
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="input-field"
                    rows="2"
                    placeholder="Add any notes..."
                  />
                </div>

                {/* Total */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Amount:</span>
                    <span className="text-2xl text-blue-600">
                      PKR {Math.round(getTotal())}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setShowCheckout(false)}
                    className="btn-secondary"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="btn-success"
                  >
                    {loading ? 'Processing...' : 'Complete Order'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default POS;


