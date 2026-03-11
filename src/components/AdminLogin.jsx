// src/components/AdminLogin.jsx
import { useState } from "react";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "LokalKatalog" && password === "admin123") {
      onLogin(); // Memanggil onLogin yang akan mengubah status login
    } else {
      alert("Login gagal");
    }
  };

  return (
    <div className="bg-[#fffaf0] min-h-screen flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-amber-500">
          Login Admin
        </h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-amber-500 mb-1">
            Username
          </label>
          <input
            type="text"
            placeholder="username"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4a373]"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-amber-500 mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#f49f4b]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[#6b4226] hover:bg-[#8b5e3c] text-white font-semibold py-2 rounded-lg transition-colors duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default AdminLogin;
