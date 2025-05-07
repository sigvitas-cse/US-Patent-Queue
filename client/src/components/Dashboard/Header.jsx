const Header = ({ user, error, darkMode, loading }) => {
    return (
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
        {loading ? (
          <p className="text-center text-gray-500 dark:text-gray-400">Loading user data...</p>
        ) : (
          <>
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-green-200 dark:bg-green-500 text-green-800 dark:text-white rounded-full flex items-center justify-center text-xl font-bold">
                {user.username ? user.username.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-semibold">
                  Welcome, {user.username || "User"} 👋
                </h1>
                <p className="text-gray-500 dark:text-gray-400">Glad to see you back!</p>
              </div>
            </div>
            {error && (
              <p className="text-red-500 text-center mb-4">{error}</p>
            )}
            <hr className="my-4 border-gray-300 dark:border-gray-600" />
            <p className="text-lg">This is your personalized dashboard. Search for patents below!</p>
            <p>Total Patents: <strong>{user.totalPatents || "N/A"}</strong></p>
          </>
        )}
      </div>
    );
  };
  
  export default Header;