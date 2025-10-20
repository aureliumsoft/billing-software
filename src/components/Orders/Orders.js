import React, { useState, useEffect } from 'react';
import {
  FiSearch,
  FiFileText,
  FiEye,
  FiX,
  FiPrinter,
  FiXCircle,
  FiCheckCircle,
  FiClock
} from 'react-icons/fi';
import db from '../../utils/db';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchQuery, statusFilter, orders]);

  const loadOrders = async () => {
    try {
      const result = await db.getAllOrders();
      if (result.success) {
        setOrders(result.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    if (searchQuery) {
      filtered = filtered.filter(order =>
        order.token_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.username?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredOrders(filtered);
  };

  const handleViewOrder = async (order) => {
    try {
      const result = await db.getOrderItems(order.id);
      if (result.success) {
        setSelectedOrder(order);
        setOrderItems(result.data);
        setShowModal(true);
      }
    } catch (error) {
      console.error('Error loading order items:', error);
      alert('Failed to load order details');
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order? Stock will be restored.')) {
      return;
    }

    try {
      const result = await db.cancelOrder(orderId);
      if (result.success) {
        await loadOrders();
        if (selectedOrder && selectedOrder.id === orderId) {
          setShowModal(false);
        }
        alert('Order cancelled successfully!');
      } else {
        alert('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Failed to cancel order');
    }
  };

  const printReceipt = async () => {
    if (!selectedOrder) return;

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
          </style>
        </head>
        <body>
          <div class="center bold" style="font-size: 16px;">CAFE POS SYSTEM</div>
          <div class="center" style="font-size: 10px;">Order Receipt</div>
          <div class="line"></div>
          <div class="center bold" style="font-size: 24px; margin: 10px 0;">
            TOKEN #${selectedOrder.token_number}
          </div>
          <div class="center" style="font-size: 9px; color: #888; margin: -5px 0 10px 0;">
            Receipt No: ${selectedOrder.id}
          </div>
          <div class="line"></div>
          <table>
            <tr>
              <td>Date:</td>
              <td class="right">${new Date(selectedOrder.created_at).toLocaleString()}</td>
            </tr>
            <tr>
              <td>Cashier:</td>
              <td class="right">${selectedOrder.username || 'N/A'}</td>
            </tr>
            <tr>
              <td>Status:</td>
              <td class="right">${selectedOrder.status.toUpperCase()}</td>
            </tr>
          </table>
          <div class="line"></div>
          <table>
            ${orderItems.map(item => `
              <tr>
                <td colspan="2" class="bold">${item.product_name}</td>
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
              <td class="right" style="font-size: 14px;">PKR ${Math.round(selectedOrder.total_amount)}</td>
            </tr>
            <tr>
              <td>Payment Method:</td>
              <td class="right">${selectedOrder.payment_method.toUpperCase()}</td>
            </tr>
          </table>
          ${selectedOrder.notes ? `
            <div class="line"></div>
            <div>
              <strong>Notes:</strong><br>
              ${selectedOrder.notes}
            </div>
          ` : ''}
          <div class="line"></div>
          <div class="center" style="margin-top: 20px; font-size: 10px;">
            Thank you for your business!<br>
            Come again soon!
          </div>
        </body>
      </html>
    `;

    await db.printReceipt(receiptHTML);
  };

  const getStatusBadge = (status) => {
    const styles = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };

    const icons = {
      completed: <FiCheckCircle className="inline mr-1" />,
      cancelled: <FiXCircle className="inline mr-1" />,
      pending: <FiClock className="inline mr-1" />
    };

    return (
      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || styles.pending}`}>
        {icons[status]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="text-gray-600 mt-1">View and manage all orders</p>
      </div>

      {/* Filters */}
      <div className="card space-y-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-field pl-10"
            placeholder="Search by token number or cashier..."
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              statusFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setStatusFilter('completed')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              statusFilter === 'completed'
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Completed
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
              statusFilter === 'cancelled'
                ? 'bg-red-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Token Number
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cashier
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Payment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    <FiFileText className="text-5xl mx-auto mb-3 opacity-30" />
                    <p>No orders found</p>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-blue-600">
                          Token #{order.token_number}
                        </span>
                        <span className="text-xs text-gray-400">
                          Receipt: {order.id}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.username || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      PKR {Math.round(order.total_amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {order.payment_method}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleViewOrder(order)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <FiEye className="mr-1" />
                        View
                      </button>
                      {order.status === 'completed' && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="text-red-600 hover:text-red-900 inline-flex items-center ml-3"
                        >
                          <FiXCircle className="mr-1" />
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {showModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-screen overflow-y-auto animate-slide-up">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>

              {/* Order Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 sm:p-6 rounded-lg mb-6">
                <div className="text-center mb-4">
                  <p className="text-sm text-gray-600 mb-1">Token Number</p>
                  <p className="text-3xl sm:text-4xl font-bold text-blue-600">#{selectedOrder.token_number}</p>
                  <p className="text-xs text-gray-400 mt-1">Receipt No: {selectedOrder.id}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Status</p>
                    <div>{getStatusBadge(selectedOrder.status)}</div>
                  </div>
                  <div>
                    <p className="text-gray-600">Date & Time</p>
                    <p className="font-semibold">
                      {new Date(selectedOrder.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Cashier</p>
                    <p className="font-semibold">{selectedOrder.username || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-semibold capitalize">{selectedOrder.payment_method}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-bold text-green-600 text-lg">
                      PKR {Math.round(selectedOrder.total_amount)}
                    </p>
                  </div>
                </div>
                {selectedOrder.notes && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <p className="text-gray-600 text-sm">Notes</p>
                    <p className="font-medium">{selectedOrder.notes}</p>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-4">Order Items</h3>
                <div className="space-y-3">
                  {orderItems.map((item, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-semibold text-gray-800">{item.product_name}</p>
                          <p className="text-sm text-gray-600">
                            {item.quantity} × PKR {Math.round(item.price)}
                          </p>
                        </div>
                        <p className="font-bold text-blue-600">
                          PKR {Math.round(item.subtotal)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={printReceipt}
                  className="flex-1 btn-primary flex items-center justify-center space-x-2"
                >
                  <FiPrinter />
                  <span>Print Receipt</span>
                </button>
                {selectedOrder.status === 'completed' && (
                  <button
                    onClick={() => {
                      handleCancelOrder(selectedOrder.id);
                    }}
                    className="flex-1 btn-danger flex items-center justify-center space-x-2"
                  >
                    <FiXCircle />
                    <span>Cancel Order</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;


