const SearchBar = ({ searchQuery, setSearchQuery, handleSearch, darkMode }) => {
    return (
      <div className="mb-10 flex items-center justify-between flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Dashboard Overview</h2>
        <div className="relative w-full md:w-96 transition-all duration-300 focus-within:w-full">
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400">
            🔍
          </div>
          <input
            type="text"
            placeholder="Enter Patent Numbers (e.g., 12185648,12185655)"
            className="w-full py-3 pl-12 pr-24 rounded-full bg-white dark:bg-gray-800 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
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
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-green-500 text-white px-4 py-1 rounded-full hover:bg-green-600 transition whitespace-nowrap"
          >
            Search
          </button>
        </div>
      </div>
    );
  };
  
  export default SearchBar;