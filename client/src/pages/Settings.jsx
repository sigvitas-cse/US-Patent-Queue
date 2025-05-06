import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Settings() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ username: "", email: "" });
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("[Settings] No token found, redirecting to login");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(`[Settings] Fetched user: ${response.data.username}`);
        setUser({ username: response.data.username, email: response.data.email });
      } catch (err) {
        console.error(`[Settings] User Error: ${err.response?.data?.message || err.message}`);
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = () => {
    console.log("[Settings] Logging out");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleClearLocalStorage = () => {
    localStorage.clear();
    console.log("[Settings] Local storage cleared");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        {/* Toggle Button for Small Screens */}
        <button
          onClick={toggleSidebar}
          className="md:hidden fixed top-2 left-2 sm:top-4 sm:left-4 z-50 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform duration-300 transform hover:scale-110 focus:outline-none"
        >
          {isSidebarOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          )}
        </button>

        {/* Sidebar */}
        <aside
          className={`
            w-64 bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col justify-between
            fixed top-0 left-0 h-full z-40
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:static md:h-auto
          `}
        >
          <div>
            <h2 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-10">🧩 MyDashboard</h2>
            <nav className="space-y-4">
              <button
                onClick={() => navigate("/")}
                className="w-full text-left px-4 py-2 rounded hover:bg-green-100 dark:hover:bg-green-800 transition"
              >
                🏠 Home
              </button>
              <button
                onClick={() => navigate("/profile")}
                className="w-full text-left px-4 py-2 rounded hover:bg-green-100 dark:hover:bg-green-800 transition"
              >
                👤 Profile
              </button>
              <button
                onClick={() => navigate("/settings")}
                className="w-full text-left px-4 py-2 rounded bg-green-100 dark:bg-green-800 transition"
              >
                ⚙️ Settings
              </button>
            </nav>
          </div>
          <div className="space-y-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full bg-yellow-400 text-black dark:bg-yellow-600 dark:text-white py-2 rounded hover:opacity-90 transition"
            >
              {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
            </button>
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay for small screens when sidebar is open */}
        {isSidebarOpen && (
          <div
            onClick={toggleSidebar}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-8 md:ml-0">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-200 dark:bg-green-500 text-green-800 dark:text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                  {user.username ? user.username.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="ml-4">
                  <h1 className="text-xl sm:text-2xl font-semibold">
                    Settings, {user.username || "User"} ⚙️
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">Manage your preferences here.</p>
                </div>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition flex items-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Dashboard
              </button>
            </div>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />

            {/* Settings Options */}
            <div className="space-y-6">
              {/* Dark Mode Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Dark Mode</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 dark:peer-focus:ring-green-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Email Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white">Email Notifications</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={() => setEmailNotifications(!emailNotifications)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-green-500 dark:peer-focus:ring-green-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-500"></div>
                </label>
              </div>

              {/* Profile Settings (Placeholder) */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Profile Settings</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                    <input
                      type="email"
                      value={user.email}
                      disabled
                      className="mt-1 w-full py-2 px-3 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-sm sm:text-base"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Email updates are not supported in this demo.</p>
                  </div>
                </div>
              </div>

              {/* Clear Local Storage */}
              <div>
                <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Reset Application</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Clear all local data and log out.</p>
                <button
                  onClick={handleClearLocalStorage}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition text-sm sm:text-base"
                >
                  Clear Local Storage
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}