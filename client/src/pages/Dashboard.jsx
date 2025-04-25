import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        {/* Sidebar */}
        <aside className="w-64 bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col justify-between">
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
                className="w-full text-left px-4 py-2 rounded hover:bg-green-100 dark:hover:bg-green-800 transition"
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

        {/* Main Content */}
        <main className="flex-1 p-10 space-y-8">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-200 dark:bg-green-500 text-green-800 dark:text-white rounded-full flex items-center justify-center text-xl font-bold">
                D
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-semibold">Welcome, Darshan 👋</h1>
                <p className="text-gray-500 dark:text-gray-400">Glad to see you back!</p>
              </div>
            </div>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
            <p className="text-lg">This is your personalized dashboard. You can add stats, charts, and much more!</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-2">📦 Projects</h2>
              <p className="text-3xl font-bold">6</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-2">🕒 Hours</h2>
              <p className="text-3xl font-bold">124</p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
              <h2 className="text-xl font-bold mb-2">🚀 Progress</h2>
              <p className="text-3xl font-bold">80%</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
