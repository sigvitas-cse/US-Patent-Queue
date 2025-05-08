const Sidebar = ({ isSidebarOpen, toggleSidebar, darkMode, setDarkMode, navigate, handleLogout }) => {
  return (
    <>
      {/* Toggle Button for Small Screens */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-3 left-3 z-50 p-1.5 sm:p-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform duration-300 transform hover:scale-110 focus:outline-none"
      >
        {isSidebarOpen ? (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        ) : (
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          w-[80vw] sm:w-64 bg-white dark:bg-gray-800 shadow-md p-3 sm:p-5 flex flex-col justify-between
          fixed top-0 left-0 h-full z-40
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-auto
        `}
      >
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-green-600 dark:text-green-400 mb-4 sm:mb-8">🧩 MyDashboard</h2>
          <nav className="space-y-1 sm:space-y-3">
            <button
              onClick={() => navigate("/")}
              className="w-full text-left px-2 sm:px-3 py-1 rounded hover:bg-green-100 dark:hover:bg-green-800 transition text-xs sm:text-sm"
            >
              🏠 Home
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="w-full text-left px-2 sm:px-3 py-1 rounded hover:bg-green-100 dark:hover:bg-green-800 transition text-xs sm:text-sm"
            >
              👤 Profile
            </button>
            <button
              onClick={() => navigate("/settings")}
              className="w-full text-left px-2 sm:px-3 py-1 rounded hover:bg-green-100 dark:hover:bg-green-800 transition text-xs sm:text-sm"
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>
        <div className="space-y-1 sm:space-y-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="w-full bg-yellow-400 text-black dark:bg-yellow-600 dark:text-white py-1 rounded hover:opacity-90 transition text-xs sm:text-sm"
          >
            {darkMode ? "🌞 Light Mode" : "🌙 Dark Mode"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-1 rounded hover:bg-red-600 transition text-xs sm:text-sm"
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
    </>
  );
};

export default Sidebar;