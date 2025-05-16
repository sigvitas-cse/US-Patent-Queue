import { Link } from "react-router-dom";
import NewsCard from "../components/NewsCard";

export default function News() {
  // Extended static news data with patent-related Pexels image URLs and valid article URLs
  const newsArticles = [
    {
      id: 1,
      title: "New Patent Reform Bill Introduced in Congress",
      excerpt: "A bipartisan bill aims to streamline patent litigation processes...",
      date: "May 15, 2025",
      image: "https://images.pexels.com/photos/159358/gavel-auction-hammer-judge-lawyer-159358.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      url: "https://www.uspto.gov/about-us/news-updates",
    },
    {
      id: 2,
      title: "AI Inventions: USPTO Issues New Guidelines",
      excerpt: "The USPTO clarifies patent eligibility for AI-based inventions...",
      date: "May 14, 2025",
      image: "https://images.pexels.com/photos/2155741/pexels-photo-2155741.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      url: "https://www.uspto.gov/initiatives/artificial-intelligence",
    },
    {
      id: 3,
      title: "Top Patent Trends to Watch in 2025",
      excerpt: "Emerging technologies driving patent filings this year...",
      date: "May 14, 2025",
      image: "https://images.pexels.com/photos/356043/pexels-photo-356043.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      url: "https://www.wipo.int/global_ip/en/",
    },
    {
      id: 4,
      title: "Federal Circuit Rules on Patent Eligibility",
      excerpt: "Recent ruling clarifies Section 101 for software patents...",
      date: "May 13, 2025",
      image: "https://images.pexels.com/photos/3771088/pexels-photo-3771088.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&dpr=1",
      url: "https://www.cafc.uscourts.gov/news",
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen flex flex-col">
      <header className="bg-white shadow">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-purple-600">US Patent Quew</h1>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4 sm:mt-0">
            <Link to="/" className="text-base sm:text-lg text-gray-600 hover:text-purple-600">Home</Link>
            <Link to="/explore" className="text-base sm:text-lg text-gray-600 hover:text-purple-600">Explore</Link>
            <Link to="/about" className="text-base sm:text-lg text-gray-600 hover:text-purple-600">About</Link>
            <Link to="/contact" className="text-base sm:text-lg text-gray-600 hover:text-purple-600">Contact</Link>
            <Link to="/login" className="text-base sm:text-lg text-gray-600 hover:text-purple-600">Login</Link>
          </div>
        </nav>
      </header>
      <section className="py-12 sm:py-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">Patent News</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {newsArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </section>
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