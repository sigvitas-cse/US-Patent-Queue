import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ErrorBoundary from "../components/Dashboard/ErrorBoundary";
import Sidebar from "../components/Dashboard/Sidebar";
import Header from "../components/Dashboard/Header";
import SearchBar from "../components/Dashboard/SearchBar";
import PatentsTable from "../components/Dashboard/PatentsTable";
import sanitizeInventor from "../components/Dashboard/utils/sanitizeInventor";

export default function Dashboard() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [user, setUser] = useState({ username: "", email: "", totalPatents: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("[Dashboard] Token found:", !!token);

    if (!token) {
      console.log("[Dashboard] No token, redirecting to login");
      navigate("/login", { replace: true });
      return;
    }
    
  // const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";
  const API_URL = import.meta.env.VITE_API_URL || "https://usptoq.onrender.com";



    const fetchUser = async () => {
      try {
        setLoading(true);
        console.log("[Dashboard] Fetching user data...");
        const response = await axios.get(`${API_URL}/api/auth/user`, {
        // const response = await axios.get("http://localhost:5000/api/auth/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("[Dashboard] User data fetched:", response.data);
        setUser({
          username: response.data.username,
          email: response.data.email,
          totalPatents: response.data.totalPatents,
        });
      } catch (err) {
        console.error("[Dashboard] Error fetching user:", err);
        setError(err.response?.data?.message || "Failed to load user data. Please try again.");
        // Don't redirect; show error on dashboard
      } finally {
        setLoading(false);
        setIsTokenChecked(true);
        console.log("[Dashboard] Token check complete, rendering dashboard");
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
      console.log("[Dashboard] Searching patents with query:", searchQuery);
      const response = await axios.get( 
          `${API_URL}/api/patents/search?patent_numbers=${encodeURIComponent(searchQuery)}`,
        // `http://localhost:5000/api/patents/search?patent_numbers=${encodeURIComponent(searchQuery)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const results = Array.isArray(response.data) ? response.data : [response.data];
      let deepCopyResults;
      try {
        deepCopyResults = JSON.parse(JSON.stringify(results));
      } catch (copyError) {
        console.error("[Dashboard] Error copying search results:", copyError);
        setError("Error processing search results. Please try again.");
        setSearchResults([]);
        return;
      }
      setSearchResults(deepCopyResults);
      console.log("[Dashboard] Search results set:", deepCopyResults);
    } catch (err) {
      console.error("[Dashboard] Error searching patents:", err);
      setError(err.response?.data?.message || "Error searching patents");
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    console.log("[Dashboard] Logging out");
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Render nothing until token is checked
  if (!isTokenChecked) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
        <svg
          className="animate-spin h-8 w-8 text-green-500"
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
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`${darkMode ? "dark" : ""}`}>
        <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors w-full overflow-x-hidden">
          <Sidebar
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            navigate={navigate}
            handleLogout={handleLogout}
          />
          <main className="flex-1 p-3 sm:p-8 space-y-6 md:ml-0">
            <Header user={user} error={error} darkMode={darkMode} loading={loading} />
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              handleSearch={handleSearch}
              darkMode={darkMode}
            />
            <PatentsTable
              searchResults={searchResults}
              searchQuery={searchQuery}
              darkMode={darkMode}
              sanitizeInventor={sanitizeInventor}
            />
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
              background-color: #a0aec0 !important;
              border-radius: 4px;
              width: 6px;
              cursor: pointer;
            }
            .dark .ps__thumb-y,
            .dark .ps__thumb-x {
              background-color: #718096 !important;
            }
            .ps__thumb-y:hover,
            .ps__thumb-x:hover {
              background-color: #7f9cf5 !important;
            }
            .dark .ps__thumb-y:hover,
            .dark .ps__thumb-x:hover {
              background-color: #90cdf4 !important;
            }
          `}
        </style>
      </div>
    </ErrorBoundary>
  );
}