import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      setError("");
      console.log("[Login] Attempting login with email:", formData.email);
      console.log("[Login] API URL:", `${API_URL}/api/auth/login`);

      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      // const res = await axios.post("http://localhost:5000/api/auth/login", formData);

      const token = res.data.token;
      console.log("[Login] Token received:", token);
      localStorage.setItem("token", token);
      console.log("[Login] Token stored in localStorage");
      navigate("/dashboard", { replace: true });
      console.log("[Login] Navigated to /dashboard");
    } catch (err) {
      console.error("[Login] Login error:", err);
      const errorMessage = err.response?.data?.message || "Invalid credentials. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Navigation functions
  const signup = () => navigate("/register");
  const login = () => navigate("/login");
  const home = () => navigate("/");

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
              onClick={home}
              className="text-xl font-semibold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition"
              aria-label="Go to home page"
            >
              PatentQ
            </button>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={signup}
              className="text-sm text-purple-600 hover:text-purple-800 dark:hover:text-purple-400 transition"
            >
              Create Account
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Welcome Back
          </h2>
          {error && (
            <p className="text-red-500 text-sm text-center mb-4 bg-red-50 dark:bg-red-900/50 p-2 rounded">
              {error}
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
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-md bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-md hover:bg-purple-700 transition disabled:opacity-50 text-sm font-medium"
            >
              {loading ? "Logging in..." : "Sign In"}
            </button>
          </form>
          <div className="mt-4 text-center space-y-2">
            <button
              onClick={() => navigate("/forgot-password")}
              className="text-purple-600 hover:underline text-sm"
            >
              Forgot Password?
            </button>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={signup}
                className="text-purple-600 hover:underline"
              >
                Sign Up
              </button>
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