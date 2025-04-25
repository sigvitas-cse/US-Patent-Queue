import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { Menu, X } from "lucide-react"; // Icons

export default function Dashboard() {
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
    // Handle logout logic here (e.g., clear session, navigate to login)
    toast.success("Logged out successfully!");
    navigate("/login"); // Redirect to login screen
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col md:flex-row transition-colors">
      <Toaster />

      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white dark:bg-gray-800 p-4 shadow-md transition-all fixed md:static z-50`}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-purple-600 dark:text-purple-400">Dashboard</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-gray-600 dark:text-gray-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Sidebar Items */}
        {["dashboard", "profile", "settings"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab);
              setSidebarOpen(false); // Close on small screen
            }}
            className={`block w-full text-left px-4 py-2 rounded-lg mb-2 font-medium transition-all duration-300 ease-in-out ${
              activeTab === tab
                ? "bg-purple-600 text-white transform scale-105"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}

        {/* Dark Mode Toggle */}
        <div className="flex items-center justify-between mb-4">
          <label className="text-gray-700 dark:text-gray-300 font-medium">Dark Mode</label>
          <input
            type="checkbox"
            name="darkMode"
            checked={settings.darkMode}
            onChange={handleSettingsChange}
            className="h-5 w-5 accent-purple-600"
          />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-600 dark:text-red-400 transition-all duration-300 ease-in-out"
        >
          Logout
        </button>
      </aside>

      {/* Hamburger button for small screen */}
      <div className="md:hidden p-4">
        <button onClick={() => setSidebarOpen(true)} className="text-gray-600 dark:text-gray-300">
          <Menu size={28} />
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 transform transition-all duration-500 ease-in-out scale-100 hover:scale-105">
            <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200 capitalize">
            {activeTab}
            </h1>

            {/* Profile Tab */}
            {activeTab === "profile" && (
            <div className="space-y-8">
                {["name", "email", "phone"].map((field) => (
                <div key={field}>
                    <label className="block text-lg font-semibold mb-2 text-gray-700 dark:text-gray-300 capitalize">
                    {field}
                    </label>
                    <input
                    type={field === "email" ? "email" : "text"}
                    name={field}
                    value={profile[field]}
                    onChange={handleProfileChange}
                    className="w-full px-5 py-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out"
                    />
                </div>
                ))}
                <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full ${isSaving ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"} text-white py-3 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                >
                {isSaving ? "Saving..." : "💾 Save Profile"}
                </button>
            </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
            <div className="space-y-8">
                {[{ label: "Notifications", name: "notifications" }].map((setting) => (
                <div className="flex items-center justify-between" key={setting.name}>
                    <label className="text-gray-700 dark:text-gray-300 font-medium text-lg">{setting.label}</label>
                    <input
                    type="checkbox"
                    name={setting.name}
                    checked={settings[setting.name]}
                    onChange={handleSettingsChange}
                    className="h-6 w-6 accent-purple-600"
                    />
                </div>
                ))}
                <button
                onClick={handleSave}
                disabled={isSaving}
                className={`w-full ${isSaving ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"} text-white py-3 rounded-lg text-lg transition-all duration-300 ease-in-out transform hover:scale-105`}
                >
                {isSaving ? "Saving..." : "⚙️ Save Settings"}
                </button>
            </div>
            )}
        </div>
        </main>

    </div>
  );
}
