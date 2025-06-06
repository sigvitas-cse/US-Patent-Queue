import { Link } from "react-router-dom";

export default function About() {
  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">US Patent Queue</h1>
          <div className="flex gap-6">
            <Link to="/" className="text-gray-600 hover:text-purple-600">Home</Link>
            <Link to="/explore" className="text-gray-600 hover:text-purple-600">Explore</Link>
            <Link to="/news" className="text-gray-600 hover:text-purple-600">News</Link>
            <Link to="/contact" className="text-gray-600 hover:text-purple-600">Contact</Link>
            <Link to="/login" className="text-gray-600 hover:text-purple-600">Login</Link>
          </div>
        </nav>
      </header>
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">About US Patent Queue</h2>
          <p className="text-lg text-gray-600 mb-6">
            US Patent Queue is your trusted platform for accessing comprehensive patent data and staying updated with the latest
            industry trends. Our mission is to empower innovators, researchers, and businesses with actionable insights.
          </p>
          <p className="text-lg text-gray-600 mb-6">
            Founded in 2025, we are committed to providing a user-friendly interface and robust tools to navigate the complex
            world of patents.
          </p>
          <div className="text-center">
            <Link
              to="/contact"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-lg font-medium"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
      <footer className="py-8 bg-gray-800 text-white text-center">
        <p>© 2025 US Patent Queue. All rights reserved.</p>
        <div className="mt-4 flex justify-center gap-6">
          <Link to="/about" className="hover:text-purple-400">About</Link>
          <Link to="/contact" className="hover:text-purple-400">Contact</Link>
          <Link to="/privacy" className="hover:text-purple-400">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}