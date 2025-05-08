const Header = ({ user, error, darkMode, loading }) => {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-3 sm:p-6">
      {loading ? (
        <div className="text-center">
          <svg
            className="animate-spin h-6 w-6 text-green-500 mx-auto"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">Loading user data...</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col sm:flex-row items-center mb-4">
            <div className="w-10 h-10 sm:w-14 sm:h-14 bg-green-200 dark:bg-green-500 text-green-800 dark:text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold">
              {user.username ? user.username.charAt(0).toUpperCase() : "U"}
            </div>
            <div className="ml-0 sm:ml-3 mt-3 sm:mt-0 text-center sm:text-left">
              <h1 className="text-lg sm:text-xl font-semibold">
                Welcome, {user.username || "User"} 👋
              </h1>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Glad to see you back!</p>
            </div>
          </div>
          {error && (
            <p className="text-red-500 text-center mb-3 text-sm">{error}</p>
          )}
          <hr className="my-3 border-gray-300 dark:border-gray-600" />
          <p className="text-sm sm:text-base">This is your personalized dashboard. Search for patents below!</p>
          <p className="text-sm sm:text-base">Total Patents: <strong>{user.totalPatents || "N/A"}</strong></p>
        </>
      )}
    </div>
  );
};

export default Header;