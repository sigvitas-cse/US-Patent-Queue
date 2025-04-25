import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 text-center">
      <h1 className="text-5xl font-bold text-gray-800 mb-6">Welcome to <span className="text-purple-600">USPTOQ</span></h1>
      <p className="text-lg text-gray-600 mb-8">Your trusted platform to access insightful data. Login to explore more.</p>
      <div className="flex gap-6">
        <Link to="/register" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">Register</Link>
        <Link to="/login" className="px-6 py-2 border-2 border-purple-600 text-purple-600 rounded-full hover:bg-purple-600 hover:text-white transition">Login</Link>
      </div>
    </div>
  );
}
