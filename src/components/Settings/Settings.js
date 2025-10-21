import React, { useState, useEffect } from 'react';
import {
  FiSettings,
  FiRefreshCw,
  FiCheck,
  FiPackage,
  FiAlertCircle,
  FiShield,
  FiToggleLeft,
  FiToggleRight,
  FiImage,
  FiEdit3
} from 'react-icons/fi';
import db from '../../utils/db';

const Settings = ({ currentUser }) => {
  const [tokenNumber, setTokenNumber] = useState(0);
  const [resetting, setResetting] = useState(false);
  const [showResetSuccess, setShowResetSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [stockManagementEnabled, setStockManagementEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [brandName, setBrandName] = useState('Cafe POS');
  const [brandLogo, setBrandLogo] = useState('');
  const [editingBrand, setEditingBrand] = useState(false);
  const [tempBrandName, setTempBrandName] = useState('');
  const [logoPreview, setLogoPreview] = useState(null);
  const [savingBrand, setSavingBrand] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // Load token number
      const tokenResult = await db.getCurrentTokenNumber();
      if (tokenResult.success) {
        setTokenNumber(tokenResult.data);
      }

      // Load stock management setting
      const stockResult = await db.getStockManagementEnabled();
      if (stockResult.success) {
        setStockManagementEnabled(stockResult.data);
      }

      // Load brand name
      const nameResult = await db.getBrandName();
      if (nameResult.success) {
        setBrandName(nameResult.data);
        setTempBrandName(nameResult.data);
      }

      // Load brand logo
      const logoResult = await db.getBrandLogo();
      if (logoResult.success) {
        setBrandLogo(logoResult.data);
        setLogoPreview(logoResult.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStock = async () => {
    try {
      const newValue = !stockManagementEnabled;
      const result = await db.setStockManagementEnabled(newValue);
      if (result.success) {
        setStockManagementEnabled(newValue);
      }
    } catch (error) {
      console.error('Error toggling stock management:', error);
    }
  };

  const handleResetTokenClick = () => {
    setShowResetConfirm(true);
  };

  const handleResetTokenConfirm = async () => {
    setShowResetConfirm(false);
    setResetting(true);
    try {
      const result = await db.resetTokenCounter();
      if (result.success) {
        const tokenResult = await db.getCurrentTokenNumber();
        if (tokenResult.success) {
          setTokenNumber(tokenResult.data);
        }
        setShowResetSuccess(true);
        setTimeout(() => {
          setShowResetSuccess(false);
        }, 5000);
      } else {
        console.error('Failed to reset token counter');
      }
    } catch (error) {
      console.error('Error resetting token:', error);
    } finally {
      setResetting(false);
    }
  };

  const handleResetTokenCancel = () => {
    setShowResetConfirm(false);
  };

  const handleEditBrand = () => {
    setEditingBrand(true);
  };

  const handleCancelEditBrand = () => {
    setEditingBrand(false);
    setTempBrandName(brandName);
    setLogoPreview(brandLogo);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 1MB for logo)
      if (file.size > 1 * 1024 * 1024) {
        alert('Logo size should be less than 1MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveLogo = () => {
    setLogoPreview('');
  };

  const handleSaveBrand = async () => {
    setSavingBrand(true);
    try {
      // Save brand name
      const nameResult = await db.setBrandName(tempBrandName);
      if (nameResult.success) {
        setBrandName(tempBrandName);
        // Update document title immediately
        document.title = `${tempBrandName} - POS System`;
        // Trigger a custom event to notify other components
        window.dispatchEvent(new CustomEvent('brandUpdated', { 
          detail: { 
            brandName: tempBrandName, 
            brandLogo: logoPreview || '' 
          } 
        }));
      }

      // Save brand logo
      const logoResult = await db.setBrandLogo(logoPreview || '');
      if (logoResult.success) {
        setBrandLogo(logoPreview || '');
      }

      setEditingBrand(false);
      
      // Show success message briefly
      setBrandName('✓ Saved!');
      setTimeout(() => {
        setBrandName(tempBrandName);
      }, 2000);
    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Failed to save brand settings');
    } finally {
      setSavingBrand(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in relative">
      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md mx-4 animate-slide-up">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 bg-orange-100 rounded-full p-3 mr-4">
                <FiAlertCircle className="text-2xl text-orange-600" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Reset Token Counter?</h3>
                <p className="text-gray-600 text-sm mb-1">
                  This will reset the token counter back to 0. The next order will be Token #1.
                </p>
                <p className="text-gray-500 text-xs">
                  <strong>Note:</strong> Receipt numbers will NOT be affected and will continue incrementing normally.
                </p>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleResetTokenCancel}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleResetTokenConfirm}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 flex items-center">
            <FiSettings className="mr-3" />
            Settings
          </h1>
          <p className="text-gray-600 mt-1">Manage system configuration and preferences</p>
        </div>
      </div>

      {/* Success Message */}
      {showResetSuccess && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-lg animate-fade-in">
          <div className="flex items-center">
            <FiCheck className="mr-2 text-xl" />
            <div>
              <p className="font-bold">Token counter reset successfully!</p>
              <p className="text-sm">Next order will be Token #1</p>
            </div>
          </div>
        </div>
      )}

      {/* Brand Customization */}
      <div className="card bg-gradient-to-r from-pink-50 to-rose-50 border-2 border-pink-200">
        <div className="flex items-start mb-4">
          <div className="bg-pink-100 rounded-full p-3 mr-4">
            <FiImage className="text-2xl text-pink-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Brand Customization</h3>
            <p className="text-sm text-gray-600 mb-3">
              Customize your business name and logo
            </p>
            
            {!editingBrand ? (
              <div className="bg-white rounded-lg p-4">
                <div className="flex items-center space-x-4 mb-4">
                  {/* Logo Preview */}
                  <div className="flex-shrink-0">
                    <div className="h-16 w-16 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                      {brandLogo ? (
                        <img 
                          src={brandLogo} 
                          alt="Brand Logo"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <img 
                          src="./aurelium.png" 
                          alt="Default Logo" 
                          className="w-8 h-8 object-contain"
                        />
                      )}
                    </div>
                  </div>
                  
                  {/* Brand Name */}
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Business Name</p>
                    <p className="text-xl font-bold text-gray-800">{brandName}</p>
                  </div>
                </div>
                
                <button
                  onClick={handleEditBrand}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
                >
                  <FiEdit3 />
                  <span>Edit Brand</span>
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-lg p-4 space-y-4">
                {/* Logo Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Logo
                  </label>
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="h-20 w-20 rounded-lg overflow-hidden bg-gradient-to-br from-blue-100 to-purple-100 border-2 border-gray-200">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Preview"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <img 
                              src="./aurelium.png" 
                              alt="Default Logo" 
                              className="w-8 h-8 object-contain"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoChange}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="inline-block px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
                      >
                        Choose Logo
                      </label>
                      {logoPreview && (
                        <button
                          type="button"
                          onClick={handleRemoveLogo}
                          className="ml-2 px-3 py-2 bg-red-100 text-red-600 text-sm rounded-lg hover:bg-red-200 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        Max 1MB. Square logo recommended.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Brand Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={tempBrandName}
                    onChange={(e) => setTempBrandName(e.target.value)}
                    className="input-field"
                    placeholder="Enter your business name"
                    maxLength="50"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCancelEditBrand}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveBrand}
                    disabled={savingBrand}
                    className="flex-1 px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 font-medium transition-colors disabled:opacity-50"
                  >
                    {savingBrand ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
              <p className="font-semibold mb-1">📌 Note:</p>
              <p>
                Your brand name and logo will appear on the sidebar, receipts, and throughout the system.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stock Management Setting */}
        <div className="card bg-gradient-to-r from-indigo-50 to-cyan-50 border-2 border-indigo-200">
          <div className="flex items-start mb-4">
            <div className="bg-indigo-100 rounded-full p-3 mr-4">
              <FiPackage className="text-2xl text-indigo-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Stock Management</h3>
              <p className="text-sm text-gray-600 mb-3">
                {stockManagementEnabled 
                  ? 'Inventory tracking is currently enabled' 
                  : 'Inventory tracking is currently disabled'}
              </p>
              
              <div className="bg-white rounded-lg p-3 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">Status:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    stockManagementEnabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {stockManagementEnabled ? '✅ Enabled' : '⚪ Disabled'}
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  {stockManagementEnabled 
                    ? 'Products show stock levels, low stock alerts enabled' 
                    : 'No stock tracking, unlimited quantities allowed'}
                </p>
              </div>

              <button
                onClick={handleToggleStock}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-semibold transition-all ${
                  stockManagementEnabled
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-gray-400 hover:bg-gray-500 text-white'
                }`}
              >
                {stockManagementEnabled ? <FiToggleRight className="text-2xl" /> : <FiToggleLeft className="text-2xl" />}
                <span>{stockManagementEnabled ? 'Enabled' : 'Disabled'} - Click to Toggle</span>
              </button>

              <div className="mt-4 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                <p className="font-semibold mb-1">💡 When to use:</p>
                <p className="mb-2">
                  <strong>Enable:</strong> Bakeries, cafes with limited inventory, retail shops
                </p>
                <p>
                  <strong>Disable:</strong> Fast food, juice bars, made-to-order businesses
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Token Management Setting */}
        <div className="card bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200">
          <div className="flex items-start mb-4">
            <div className="bg-purple-100 rounded-full p-3 mr-4">
              <FiRefreshCw className="text-2xl text-purple-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Token Management</h3>
              <p className="text-sm text-gray-600 mb-3">
                Manage daily customer token numbers
              </p>
              
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Current Token:</span>
                  <span className="text-3xl font-bold text-purple-600">
                    {tokenNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Next Token:</span>
                  <span className="text-xl font-semibold text-gray-800">
                    #{tokenNumber + 1}
                  </span>
                </div>
                <p className="text-xs text-gray-500 pt-2 border-t">
                  Token numbers reset daily for customer tracking. Receipt IDs continue incrementing.
                </p>
              </div>

              <button
                onClick={handleResetTokenClick}
                disabled={resetting}
                className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
              >
                <FiRefreshCw className={resetting ? 'animate-spin' : ''} />
                <span>{resetting ? 'Resetting...' : 'Reset Token Counter'}</span>
              </button>

              <div className="mt-4 text-xs text-gray-500 bg-yellow-50 p-3 rounded-lg">
                <p className="font-semibold mb-1">⚠️ Important:</p>
                <p>
                  Resetting tokens will start customer numbers from #1 again. 
                  Useful at the start of each day or shift.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* System Information */}
      <div className="card bg-gradient-to-r from-gray-50 to-slate-50 border-2 border-gray-200">
        <div className="flex items-start">
          <div className="bg-gray-100 rounded-full p-3 mr-4">
            <FiShield className="text-2xl text-gray-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-800 mb-2">System Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Current User</p>
                <p className="text-sm font-semibold text-gray-800">{currentUser?.username || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Role</p>
                <p className="text-sm font-semibold text-gray-800 capitalize">{currentUser?.role || 'N/A'}</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Version</p>
                <p className="text-sm font-semibold text-gray-800">1.0.0</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <p className="text-xs text-gray-500 mb-1">Database</p>
                <p className="text-sm font-semibold text-green-600">✓ Connected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Additional Settings Placeholder */}
      <div className="card bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200">
        <div className="text-center py-8">
          <FiSettings className="text-5xl text-blue-400 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-bold text-gray-800 mb-2">More Settings Coming Soon</h3>
          <p className="text-sm text-gray-600">
            Additional configuration options will be available in future updates
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;

