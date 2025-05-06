import { useEffect, useState, Component } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import PerfectScrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

// Error Boundary Component
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 text-red-500">
          <h2>Something went wrong while rendering this component.</h2>
          <p>{this.state.error?.message || "Unknown error"}</p>
          <p>Please check the console for more details and try refreshing the page.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

// Utility to sanitize inventor data
const sanitizeInventor = (inventor) => {
  const cleanField = (field) => {
    if (typeof field !== 'string') return field || '';
    return field.split(/\r?\n/)[0].trim();
  };

  return {
    first_name: cleanField(inventor.first_name),
    last_name: cleanField(inventor.last_name),
    city: cleanField(inventor.city),
    state: cleanField(inventor.state),
    country: cleanField(inventor.country)
  };
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ username: "", email: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("[Dashboard] No token found, redirecting to login");
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        // console.log(`[Dashboard] Fetched user: ${response.data.username}`);
        setUser({ username: response.data.username, email: response.data.email });
      } catch (err) {
        // console.error(`[Dashboard] User Error: ${err.response?.data?.message || err.message}`);
        setError(err.response?.data?.message || "Error fetching user data");
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setError("Please enter at least one patent number");
      return;
    }

    try {
      setError("");
      const token = localStorage.getItem("token");
      const response = await axios.get(`http://localhost:5000/api/patents/search?patent_numbers=${encodeURIComponent(searchQuery)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // console.log(`[Dashboard] Raw API response:`, JSON.stringify(response.data, null, 2));
      const results = Array.isArray(response.data) ? response.data : [response.data];
      let deepCopyResults;
      try {
        deepCopyResults = JSON.parse(JSON.stringify(results));
      } catch (copyError) {
        // console.error(`[Dashboard] Deep copy error:`, copyError);
        setError("Error processing search results. Please try again.");
        setSearchResults([]);
        return;
      }
      // console.log(`[Dashboard] Processed search results:`, JSON.stringify(deepCopyResults, null, 2));
      setSearchResults(deepCopyResults);
    } catch (err) {
      // console.error(`[Dashboard] Search Error:`, err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Error searching patents");
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    console.log("[Dashboard] Logging out");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ErrorBoundary>
      <div className={`${darkMode ? "dark" : ""}`}>
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
          {/* Toggle Button for Small Screens */}
          <button
            onClick={toggleSidebar}
            className="md:hidden fixed top-4 left-4 z-50 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-transform duration-300 transform hover:scale-110 focus:outline-none"
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

          {/* Overlay for small screens when sidebar is open */}
          {isSidebarOpen && (
            <div
              onClick={toggleSidebar}
              className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
            ></div>
          )}

          {/* Main Content */}
          <main className="flex-1 p-10 space-y-8 md:ml-0">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8">
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
            </div>
            {/* Search Bar */}
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

            {/* Patents Table with Scrollbar */}
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-8 mt-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                Search Results
              </h2>
              <PerfectScrollbar
                className="max-h-[51.3vh] w-full"
                options={{
                  wheelSpeed: 0.5,
                  wheelPropagation: false,
                  suppressScrollX: false,
                  suppressScrollY: false,
                }}
              >
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-100 dark:bg-gray-700">
                      <th className="p-4 border-b">S. No.</th>
                      <th className="p-4 border-b">Patent Number</th>
                      <th className="p-4 border-b">Assignee</th>
                      <th className="p-4 border-b">Inventors</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((patent, index) => {
                      // console.log(`[Dashboard] Rendering patent ${patent.patent_number}:`, JSON.stringify(patent.inventors, null, 2));
                      return (
                        <tr key={patent.patent_number} className="border-b dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="p-4">{index + 1}</td>
                          <td className="p-4">{patent.patent_number}</td>
                          <td className="p-4">
                            {patent.assignee ? (
                              <table className="w-full">
                                <thead>
                                  <tr>
                                    <th className="p-2">Organization</th>
                                    <th className="p-2">City</th>
                                    <th className="p-2">State</th>
                                    <th className="p-2">Country</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td className="p-2">{patent.assignee.organization}</td>
                                    <td className="p-2">{patent.assignee.city || "N/A"}</td>
                                    <td className="p-2">{patent.assignee.state || "N/A"}</td>
                                    <td className="p-2">{patent.assignee.country}</td>
                                  </tr>
                                </tbody>
                              </table>
                            ) : (
                              "N/A"
                            )}
                          </td>
                          <td className="p-4">
                            {Array.isArray(patent.inventors) && patent.inventors.length > 0 ? (
                              <div className="w-full">
                                <p className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                                  {patent.inventors.length} Inventor{patent.inventors.length > 1 ? "s" : ""}
                                </p>
                                <table className="w-full min-w-full table-auto">
                                  <thead>
                                    <tr>
                                      <th className="p-2 border-b">S. No.</th>
                                      <th className="p-2 border-b">First Name</th>
                                      <th className="p-2 border-b">Last Name</th>
                                      <th className="p-2 border-b">City</th>
                                      <th className="p-2 border-b">State</th>
                                      <th className="p-2 border-b">Country</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {patent.inventors.map((inv, i) => {
                                      const sanitizedInv = sanitizeInventor(inv);
                                      // console.log(`[Dashboard] Rendering inventor ${i + 1} for patent ${patent.patent_number}:`, sanitizedInv);
                                      return (
                                        <tr key={`${patent.patent_number}-inv-${i}`} className="border-b dark:border-gray-600">
                                          <td className="p-2">{i + 1}</td>
                                          <td className="p-2">{sanitizedInv.first_name || "N/A"}</td>
                                          <td className="p-2">{sanitizedInv.last_name || "N/A"}</td>
                                          <td className="p-2">{sanitizedInv.city || "N/A"}</td>
                                          <td className="p-2">{sanitizedInv.state || "N/A"}</td>
                                          <td className="p-2">{sanitizedInv.country || "N/A"}</td>
                                        </tr>
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              "No inventors"
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                {searchResults.length === 0 && (
                  <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
                    {searchQuery ? "No patents found" : "Enter patent numbers to search"}
                  </p>
                )}
              </PerfectScrollbar>
            </div>
          </main>
        </div>

        {/* Inline styles for custom scrollbar appearance */}
        <style>
          {`
            .ps__rail-y,
            .ps__rail-x {
              background-color: transparent !important;
              opacity: 0.9;
              z-index: 10;
            }
            .ps__thumb-y,
            .ps__thumb-x {
              background-color: #a0aec0 !important; /* Gray color for light mode */
              border-radius: 4px;
              width: 8px; /* Slim scrollbar */
              cursor: pointer;
            }
            .dark .ps__thumb-y,
            .dark .ps__thumb-x {
              background-color: #718096 !important; /* Lighter gray for dark mode */
            }
            .ps__thumb-y:hover,
            .ps__thumb-x:hover {
              background-color: #7f9cf5 !important; /* Indigo hover effect for light mode */
            }
            .dark .ps__thumb-y:hover,
            .dark .ps__thumb-x:hover {
              background-color: #90cdf4 !important; /* Lighter indigo for dark mode */
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
}