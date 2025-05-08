import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Use localhost for development, fallback to production URL
  // const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";
  const API_URL = import.meta.env.VITE_API_URL || "https://usptoq.onrender.com";


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

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 dark:bg-gray-900 p-3 sm:p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-lg shadow-md w-full max-w-sm"
      >
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          Login
        </h2>
        {error && (
          <p className="text-red-500 text-xs sm:text-sm text-center mb-3">{error}</p>
        )}
        <div className="space-y-3">
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-1.5 sm:py-2 px-3 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
              required
            />
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-1.5 sm:py-2 px-3 rounded bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 text-xs sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-1.5 sm:py-2 rounded hover:bg-purple-700 transition disabled:opacity-50 text-xs sm:text-sm"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
        <div className="mt-3 text-center">
          <a href="/forgot-password" className="text-purple-600 hover:underline text-xs sm:text-sm">
            Forgot Password?
          </a>
        </div>
      </form>
    </div>
  );
}