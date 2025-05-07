import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";


  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setMsg('OTP expired. Please request a new one.');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (timeLeft <= 0) {
      setMsg('OTP expired. Please request a new one.');
      return;
    }
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setMsg('Please enter a valid 6-digit OTP');
      return;
    }
    setLoading(true);
    setMsg('');
    try {
      console.log(`[VerifyOtp] Submitting OTP: ${otp}, Email: ${email}, Client Time: ${new Date().toISOString()}`);

      
        const res = await axios.post(`${API_URL}/api/auth/verify-otp`, { email, otp });
      // const res = await axios.post('http://localhost:5000/api/auth/verify-otp', { email, otp });
      setMsg(res.data.message);
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 2000);
    } catch (err) {
      console.error(`[VerifyOtp] Error: ${err.response?.status} - ${err.response?.data?.message || err.message}`);
      const errorMsg = err.response?.status === 500 
        ? 'Server error. Please try again or contact support.' 
        : err.response?.data?.message === 'No OTP request found'
        ? 'No OTP found. Please request a new one.'
        : err.response?.data?.message || 'Error verifying OTP';
      setMsg(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setMsg('');
    try {
      console.log(`[VerifyOtp] Resending OTP for email: ${email}`);

      
      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      // const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setMsg('New OTP sent to your email');
      setTimeLeft(120);
      setOtp('');
    } catch (err) {
      console.error(`[VerifyOtp] Resend Error: ${err.response?.data?.message || err.message}`);
      setMsg(err.response?.data?.message || 'Error sending OTP');
    } finally {
      setLoading(false);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (/^\d{6}$/.test(text)) {
        setOtp(text);
        setMsg('');
      } else {
        setMsg('Pasted text is not a valid 6-digit OTP');
      }
    } catch (err) {
      setMsg('Failed to paste OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 to-blue-500">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md transform transition-all hover:scale-105">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify OTP</h2>
        <p className="text-center text-gray-600 mb-4">
          Enter the 6-digit OTP sent to <span className="font-semibold">{email}</span>
        </p>
        <p className="text-center text-gray-500 text-sm mb-6">
          Check your email (including spam). Copy and paste the OTP for accuracy.
        </p>
        <div className="text-center mb-4">
          <span className="text-sm font-medium text-gray-700">Time remaining: </span>
          <span className={`text-sm font-semibold ${timeLeft <= 10 ? 'text-red-500' : 'text-purple-600'}`}>
            {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
          </span>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">OTP Code</label>
            <div className="relative">
              <input
                type="text"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 transition ${
                  msg.includes('valid') || msg.includes('Invalid') || msg.includes('Expired') || msg.includes('Server') || msg.includes('No OTP')
                    ? 'border-red-500'
                    : ''
                }`}
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength="6"
                required
              />
              <button
                type="button"
                onClick={handlePaste}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-purple-600 hover:text-purple-800 text-sm"
                disabled={loading}
              >
                Paste
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition duration-200 disabled:bg-purple-400 disabled:cursor-not-allowed"
            disabled={loading || timeLeft <= 0}
          >
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
          <button
            type="button"
            onClick={handleResend}
            className="w-full text-purple-600 font-medium hover:underline disabled:text-gray-400 disabled:cursor-not-allowed"
            disabled={loading || timeLeft <= 0}
          >
            Resend OTP
          </button>
        </form>
        {msg && (
          <p
            className={`mt-6 text-center text-sm ${
              msg.includes('Error') || msg.includes('expired') || msg.includes('valid') || msg.includes('Invalid') || msg.includes('Server') || msg.includes('No OTP')
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

export default VerifyOtp;