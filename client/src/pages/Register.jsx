import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com/";
  const API_URL = import.meta.env.VITE_API_URL || "https://uspatentq.com";



  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/auth/register`, formData);
      // await axios.post("http://localhost:5000/api/auth/register", formData);
      alert("Registration successful!");
      navigate("/login");
    } catch (err) {
      alert("Error: " + err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <input type="text" name="username" placeholder="Username" value={formData.username}
          onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
        <input type="email" name="email" placeholder="Email" value={formData.email}
          onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
        <input type="password" name="password" placeholder="Password" value={formData.password}
          onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
        <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition">Register</button>
      </form>
    </div>
  );
}
