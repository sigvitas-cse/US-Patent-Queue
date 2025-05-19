import { Link } from "react-router-dom";
import { useState } from "react";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    // Simulate form submission
    alert(`Message sent from ${name} (${email}): ${message}`);
    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">US Patent Queue</h1>
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
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-gray-800 mb-6 text-center">Contact Us</h2>
          <p className="text-lg text-gray-600 mb-8 text-center">
            Have questions or feedback? Reach out to us, and we’ll get back to you soon.
          </p>
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <div className="space-y-6">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your Message"
                rows="5"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              ></textarea>
              <div className="text-center">
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-lg font-medium"
                >
                  Send Message
                </button>
              </div>
            </div>
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