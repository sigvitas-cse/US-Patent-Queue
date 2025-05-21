import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setMsg("Please enter your email");
      return;
    }

    try {
      setLoading(true);
      setMsg("");
      console.log("[ForgotPassword] Sending OTP request for email:", email);
      console.log("[ForgotPassword] API URL:", `${API_URL}/api/auth/forgot-password`);

      const res = await axios.post(`${API_URL}/api/auth/forgot-password`, { email });
      // const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });

      setMsg(res.data.message);
      console.log("[ForgotPassword] OTP request successful:", res.data.message);
      setTimeout(() => {
        navigate("/verify-otp", { state: { email }, replace: true });
        console.log("[ForgotPassword] Navigated to /verify-otp");
      }, 2000);
    } catch (err) {
      console.error("[ForgotPassword] Error:", err);
      const errorMessage = err.response?.data?.message || "Error sending OTP. Please try again.";
      setMsg(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              aria-label="Go back"
            >
              <ArrowLeftIcon className="h-5 w-5 text-gray-600 dark:text-gray-300" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="text-xl font-semibold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition"
              aria-label="Go to home page"
            >
              PatentQ
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <a
              href="/login"
              className="text-sm text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 transition"
            >
              Sign In
            </a>
            <a
              href="/signup"
              className="text-sm text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 transition"
            >
              Sign Up
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Reset Your Password
          </h2>
          {msg && (
            <p
              className={`text-sm text-center mb-4 p-2 rounded ${
                msg.includes("Error")
                  ? "text-red-500 bg-red-50 dark:bg-red-900/50"
                  : "text-green-700 bg-green-50 dark:bg-green-900/50"
              }`}
            >
              {msg}
            </p>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <a href="/login" className="text-purple-600 hover:underline">
                Sign In
              </a>
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600 dark:text-gray-400">
          © {new Date().getFullYear()} PatentQ. All rights reserved.
        </div>
      </footer>
    </div>
  );
}