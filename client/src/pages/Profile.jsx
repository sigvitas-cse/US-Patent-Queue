import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Menu, X, User, Settings, LogOut, Home } from "lucide-react"; // Icons

export default function Profile() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: "Darshan",
    email: "darshan@example.com",
    phone: "9876543210",
  });
  const [settings, setSettings] = useState({
    darkMode: false,
    notifications: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleProfileChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSettingsChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
    if (name === "darkMode") {
      document.documentElement.classList.toggle("dark", checked);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((res) => setTimeout(res, 1000));
    toast.success(`${activeTab === "profile" ? "Profile" : "Settings"} saved successfully!`);
    setIsSaving(false);

    if (activeTab !== "profile") {
      setActiveTab("profile");
    }

    setTimeout(() => {
      navigate("/dashboard");
    }, 1500);
  };

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const tabs = [
    { name: "dashboard", label: "Dashboard", icon: <Home size={20} /> },
    { name: "profile", label: "Profile", icon: <User size={20} /> },
    { name: "settings", label: "Settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className={`${settings.darkMode ? "dark" : ""}`}>
      <div className="min-h-screen flex bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-colors">
        <Toaster />

        {/* Toggle Button for Small Screens */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="md:hidden fixed top-2 left-2 sm:top-4 sm:left-4 z-50 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-transform duration-300 transform hover:scale-110 focus:outline-none"
        >
          <Menu size={24} />
        </button>

        {/* Sidebar */}
        <aside
          className={`
            w-64 bg-white dark:bg-gray-800 shadow-md p-6 flex flex-col justify-between
            fixed top-0 left-0 h-full z-40
            transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:static md:h-auto
          `}
        >
          <div>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">🧩 MyDashboard</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden text-gray-600 dark:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => {
                    setActiveTab(tab.name);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium transition-all duration-300
                    ${
                      activeTab === tab.name
                        ? "bg-purple-600 text-white shadow-md"
                        : "text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-800"
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleSettingsChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 dark:peer-focus:ring-purple-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
              </label>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-600 transition-all duration-300"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </aside>

        {/* Overlay for small screens when sidebar is open */}
        {sidebarOpen && (
          <div
            onClick={() => setSidebarOpen(false)}
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30 transition-opacity duration-300"
          ></div>
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 md:p-10 space-y-8 md:ml-0">
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
              <div className="flex items-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-200 dark:bg-purple-500 text-purple-800 dark:text-white rounded-full flex items-center justify-center text-lg sm:text-xl font-bold">
                  {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="ml-4">
                  <h1 className="text-xl sm:text-2xl font-semibold capitalize">
                    {activeTab}, {profile.name || "User"} {activeTab === "profile" ? "👤" : activeTab === "settings" ? "⚙️" : "🏠"}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base">
                    {activeTab === "profile" ? "Manage your profile details" : activeTab === "settings" ? "Customize your preferences" : "Welcome to your dashboard"}
                  </p>
                </div>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="bg-purple-500 text-white px-4 py-2 rounded-full hover:bg-purple-600 transition flex items-center gap-2 text-sm sm:text-base"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                </svg>
                Back to Dashboard
              </button>
            </div>
            <hr className="my-4 border-gray-300 dark:border-gray-600" />

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                {["name", "email", "phone"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-2">
                      {field}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={profile[field]}
                      onChange={handleProfileChange}
                      className="w-full py-3 px-4 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition duration-200 text-sm sm:text-base"
                    />
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full py-3 rounded-lg text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSaving
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg"
                  }`}
                >
                  {isSaving ? "Saving..." : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Save Profile
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                {[{ label: "Notifications", name: "notifications" }].map((setting) => (
                  <div className="flex items-center justify-between" key={setting.name}>
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-white">{setting.label}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        name={setting.name}
                        checked={settings[setting.name]}
                        onChange={handleSettingsChange}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 dark:peer-focus:ring-purple-400 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-500"></div>
                    </label>
                  </div>
                ))}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className={`w-full py-3 rounded-lg text-lg font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    isSaving
                      ? "bg-purple-400 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700 text-white hover:shadow-lg"
                  }`}
                >
                  {isSaving ? "Saving..." : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      Save Settings
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}