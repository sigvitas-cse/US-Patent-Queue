import { Link } from "react-router-dom";

export default function Privacy() {
  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">US Patent Quew</h1>
          <div className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-purple-600">Home</Link>
            <Link to="/explore" className="text-gray-600 hover:text-purple-600">Explore</Link>
            <Link to="/news" className="text-gray-600 hover:text-purple-600">News</Link>
            <Link to="/about" className="text-gray-600 hover:text-purple-600">About</Link>
            <Link to="/login" className="text-gray-600 hover:text-purple-600">Login</Link>
          </div>
        </nav>
      </header>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Privacy Policy</h2>
          <p className="text-lg text-gray-600 mb-6">
            At US Patent Quew, we are committed to protecting your privacy. This policy outlines how we collect, use, and
            safeguard your personal information.
          </p>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h3>
          <p className="text-lg text-gray-600 mb-6">
            We may collect personal information such as your name, email address, and usage data when you interact with our
            platform.
          </p>
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h3>
          <p className="text-lg text-gray-600 mb-6">
            Your information is used to provide and improve our services, communicate with you, and ensure a secure experience.
          </p>
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-lg font-medium"
            >
              Contact Us for Questions
            </Link>
          </div>
        </div>
      </section>
      <footer className="py-8 bg-gray-800 text-white text-center">
        <p>© 2025 US Patent Quew. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link to="/about" className="hover:text-purple-400">About</Link>
          <Link to="/contact" className="hover:text-purple-400">Contact</Link>
          <Link to="/privacy" className="hover:text-purple-400">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}