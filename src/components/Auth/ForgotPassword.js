import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLock, FiCoffee, FiArrowLeft, FiShield, FiKey } from 'react-icons/fi';
import db from '../../utils/db';

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: username, 2: security answer, 3: new password
  const [resetMethod, setResetMethod] = useState(''); // 'security' or 'master'
  const [username, setUsername] = useState('');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [masterCode, setMasterCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const result = await db.getUserByUsername(username);
      
      if (result.success && result.data) {
        setUserData(result.data);
        setStep(2);
      } else {
        setError('Username not found. Please contact your administrator.');
      }
    } catch (err) {
      setError('Failed to process request. Please try again.');
      console.error('Reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSecuritySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check security answer (stored in lowercase for comparison)
      const storedAnswer = userData.security_answer?.toLowerCase().trim();
      const providedAnswer = securityAnswer.toLowerCase().trim();
      
      if (storedAnswer && storedAnswer === providedAnswer) {
        setStep(3);
      } else {
        setError('Incorrect answer. Please contact your administrator.');
      }
    } catch (err) {
      setError('Failed to verify answer. Please try again.');
      console.error('Verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMasterCodeSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Master reset code - you can change this in production
      const MASTER_RESET_CODE = 'CAFE2025RESET';
      
      if (masterCode === MASTER_RESET_CODE) {
        setStep(3);
      } else {
        setError('Invalid master code. Please contact system administrator.');
      }
    } catch (err) {
      setError('Failed to verify code. Please try again.');
      console.error('Verify error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await db.updatePassword(userData.id, newPassword);
      
      setSuccess('Password reset successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError('Failed to reset password. Please try again.');
      console.error('Password reset error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
            <FiCoffee className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
          <p className="text-gray-600">
            {step === 1 && 'Enter your username to begin password reset'}
            {step === 2 && !resetMethod && 'Choose a recovery method'}
            {step === 2 && resetMethod === 'security' && 'Answer your security question'}
            {step === 2 && resetMethod === 'master' && 'Enter master reset code'}
            {step === 3 && 'Create a new password'}
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 animate-slide-up">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 animate-slide-up">
            {success}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleUsernameSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter your username"
                  required
                />
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">📌 Offline Password Reset</p>
              <p className="text-xs">You'll need to answer your security question or use the master reset code.</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold"
            >
              {loading ? 'Processing...' : 'Continue'}
            </button>
          </form>
        )}

        {step === 2 && !resetMethod && (
          <div className="space-y-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800 mb-4">
              <p className="font-semibold mb-1">⚠️ Account: {userData?.username}</p>
              <p className="text-xs">Choose a method to verify your identity</p>
            </div>

            {userData?.security_answer && (
              <button
                onClick={() => setResetMethod('security')}
                className="w-full p-4 border-2 border-blue-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3 mr-4">
                    <FiShield className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">Security Question</h3>
                    <p className="text-sm text-gray-600">{userData.security_question || 'What is your favorite cafe drink?'}</p>
                  </div>
                </div>
              </button>
            )}

            <button
              onClick={() => setResetMethod('master')}
              className="w-full p-4 border-2 border-purple-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-left"
            >
              <div className="flex items-start">
                <div className="bg-purple-100 rounded-full p-3 mr-4">
                  <FiKey className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-1">Master Reset Code</h3>
                  <p className="text-sm text-gray-600">Use the system administrator code</p>
                </div>
              </div>
            </button>

            {!userData?.security_answer && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-800 mt-4">
                <p className="font-semibold mb-1">⚠️ No Security Question Set</p>
                <p className="text-xs">You must use the master reset code. Contact your administrator if you don't have it.</p>
              </div>
            )}
          </div>
        )}

        {step === 2 && resetMethod === 'security' && (
          <form onSubmit={handleSecuritySubmit} className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800 mb-4">
              <p className="font-semibold mb-2">Security Question:</p>
              <p className="text-base text-blue-900">{userData?.security_question || 'What is your favorite cafe drink?'}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer
              </label>
              <input
                type="text"
                value={securityAnswer}
                onChange={(e) => setSecurityAnswer(e.target.value)}
                className="input-field"
                placeholder="Enter your answer"
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 mt-1">Answer is not case-sensitive</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setResetMethod('')}
                className="flex-1 btn-secondary py-3"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}

        {step === 2 && resetMethod === 'master' && (
          <form onSubmit={handleMasterCodeSubmit} className="space-y-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800 mb-4">
              <p className="font-semibold mb-1">🔐 Master Reset Code</p>
              <p className="text-xs">Enter the system administrator code to reset this password.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Master Code
              </label>
              <input
                type="password"
                value={masterCode}
                onChange={(e) => setMasterCode(e.target.value)}
                className="input-field text-center text-lg tracking-wider"
                placeholder="Enter master code"
                autoFocus
                required
              />
              <p className="text-xs text-gray-500 mt-1">Default code: CAFE2025RESET</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setResetMethod('')}
                className="flex-1 btn-secondary py-3"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary py-3"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="text-gray-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 text-lg font-semibold"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            <FiArrowLeft className="mr-1" />
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;


