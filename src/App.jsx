// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import './index.css';
import Home from "./pages/Home";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ItemList from "./components/ItemList";
import NotFound from "./pages/NotFound";
import ProductDetail from "./pages/ProductDetail";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    setLoggedIn(true); // Update status login
  };

  const handleLogout = () => {
    setLoggedIn(false); // Update status logout
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        {/* Admin Section */}
        <Route
          path="/admin"
          element={
            loggedIn ? (
              <AdminDashboard onLogout={handleLogout} />
            ) : (
              <AdminLogin onLogin={handleLogin} />
            )
          }
        />

        {/* Produk Section */}
        <Route path="/produk" element={<ItemList />} />
        <Route path="/produk/:itemName" element={<ProductDetail />} />

        {/* Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
