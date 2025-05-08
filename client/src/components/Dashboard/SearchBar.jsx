const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, darkMode }) => {
  return (
    <div className="mb-4 sm:mb-8 flex flex-col sm:flex-row items-center justify-between gap-3">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
      <div className="relative w-full max-w-sm">
        <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
          🔍
        </div>
        <input
          type="text"
          placeholder="Enter Patent Numbers (e.g., 12185648,12185655)"
          className="w-full py-1.5 sm:py-2 pl-8 sm:pl-10 pr-16 sm:pr-20 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 text-xs sm:text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />
        <button
          onClick={handleSearch}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full hover:bg-green-600 transition whitespace-nowrap text-xs sm:text-sm"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;