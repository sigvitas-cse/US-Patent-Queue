import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";
  const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      // const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMsg(res.data.message);
      // Redirect to OTP verification page after success
      setTimeout(() => {
        navigate('/verify-otp', { state: { email } }); // Pass email to the next page
      }, 2000);
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            className="w-full p-3 border rounded"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        {msg && (
          <p
            className={`mt-3 ${msg.includes('Error') ? 'text-red-500' : 'text-green-700'} text-center`}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;