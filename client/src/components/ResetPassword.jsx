import { useState } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMsg('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setMsg('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      // console.log(`[ResetPassword] Submitting new password for email: ${email}`);


      const res = await axios.post(`${API_URL}/api/auth/reset-password`, {
      // const res = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        newPassword: password,
      });
      setMsg(res.data.message);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      console.error(`[ResetPassword] Error: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      setMsg(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Reset Password</h2>
        <p className="text-center text-gray-600 mb-6">
          Set a new password for <span className="font-semibold">{email}</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              type="password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                msg.includes('match') || msg.includes('characters') ? 'border-red-500' : ''
              }`}
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <input
              type="password"
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                msg.includes('match') || msg.includes('characters') ? 'border-red-500' : ''
              }`}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-purple-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
        {msg && (
          <p
            className={`mt-6 text-center text-sm ${
              msg.includes('Error') || msg.includes('match') || msg.includes('characters')
                ? 'text-red-500'
                : 'text-green-600'
            }`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;