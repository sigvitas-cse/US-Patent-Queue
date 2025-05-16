import { Link } from "react-router-dom";
import NewsCard from "../components/NewsCard";
import { useState } from "react";

export default function Landing() {
  // Static news data with reliable image URLs
  const newsArticles = [
    {
      id: 1,
      title: "New Patent Reform Bill Introduced in Congress",
      excerpt: "A bipartisan bill aims to streamline patent litigation processes...",
      date: "May 15, 2025",
      image: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      url: "#",
    },
    {
      id: 2,
      title: "AI Inventions: USPTO Issues New Guidelines",
      excerpt: "The USPTO clarifies patent eligibility for AI-based inventions...",
      date: "May 14, 2025",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      url: "#",
    },
    {
      id: 3,
      title: "Top Patent Trends to Watch in 2025",
      excerpt: "Emerging technologies driving patent filings this year...",
      date: "May 14, 2025",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=200&q=80",
      url: "#",
    },
  ];

  // Newsletter signup state
  const [email, setEmail] = useState("");

  const handleSignup = () => {
    // Simulate newsletter signup (replace with API call if needed)
    alert(`Subscribed with ${email}!`);
    setEmail("");
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="py-12 sm:py-16 md:py-20 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            Discover the World of <span className="text-purple-600">US Patent Quew</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Your premier source for patent insights, news, and trends. Explore cutting-edge innovations and stay ahead.
          </p>
          <Link
            to="/explore"
            className="inline-block px-6 py-2 sm:px-8 sm:py-3 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition text-base sm:text-lg font-medium"
          >
            Explore Now
          </Link>
        </div>
      </section>

      {/* News Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8 text-center">Latest Patent News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {newsArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              to="/news"
              className="inline-block px-4 py-2 sm:px-6 sm:py-2 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition text-base sm:text-lg"
            >
              View All News
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-12 sm:py-16 flex-grow">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-purple-100 p-6 sm:p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Stay Updated</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6">Get the latest patent news delivered to your inbox.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 w-full sm:w-auto"
              />
              <button
                onClick={handleSignup}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-800 text-white text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm sm:text-base">© 2025 US Patent Quew. All rights reserved.</p>
          <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
            <Link to="/about" className="text-sm sm:text-base hover:text-purple-400">About</Link>
            <Link to="/contact" className="text-sm sm:text-base hover:text-purple-400">Contact</Link>
            <Link to="/privacy" className="text-sm sm:text-base hover:text-purple-400">Privacy Policy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}