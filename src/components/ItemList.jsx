import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function ItemList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      let url = "http://127.0.0.1:5000/api/products";

      if (search.trim().length >= 3) {
        url = `http://127.0.0.1:5000/api/search-ai?q=${encodeURIComponent(search)}`;
      }

      const response = await fetch(url);
      const data = await response.json();
      setItems(data);
    };

    fetchProducts();
  }, [search]);

  const handleRatingChange = (itemId, newRating) => {
    fetch(`http://127.0.0.1:5000/api/products/${itemId}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: newRating }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "Rating berhasil diperbarui") {
          setItems((prev) =>
            prev.map((item) =>
              item.idProduct === itemId ? { ...item, rating: newRating } : item
            )
          );
        }
      });
  };

  const handleProductClick = (itemName) => {
    axios
      .post(`http://127.0.0.1:5000/api/items/click/${itemName}`)
      .catch((err) => console.error("Error updating click count:", err));
  };

  const filteredItems = items.filter((item) =>
    selectedType ? item.itemType.toLowerCase() === selectedType.toLowerCase() : true
  );

  // Fungsi untuk memeriksa apakah produk baru ditambahkan dalam 1 menit terakhir
  const showNewBadge = (createdAt) => {
    if (!createdAt) return false;
    
    // Mendapatkan waktu produk ditambahkan
    const createdTime = new Date(createdAt);
    const now = new Date();
    
    // Menghitung selisih waktu antara saat ini dan waktu produk ditambahkan
    const timeDiff = now - createdTime;
    
    // Jika selisih waktu kurang dari atau sama dengan 1 menit (60000 ms), tampilkan badge
    return timeDiff <= 3 * 60 * 60 * 1000; // 3 jam
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Daftar Produk</h2>

      {/* Pencarian & Dropdown */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <input
          type="text"
          placeholder="Cari Produk (camilan, makanan, minuman)..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full"
        />

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Semua Kategori --</option>
          <option value="Makanan">Makanan</option>
          <option value="Minuman">Minuman</option>
          <option value="Pakaian">Pakaian</option>
          <option value="Camilan">Camilan</option>
          <option value="Kerajinan">Kerajinan</option>
        </select>
      </div>

      {/* Daftar Produk */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredItems.map((item, index) => {
          const imageUrl =
            item.image && !item.image.startsWith("http")
              ? `http://127.0.0.1:5000/uploads/${item.image}`
              : item.image || "/images/default.jpg";

          return (
            <div
              key={index}
              className="relative border rounded-lg shadow p-6 hover:shadow-lg transition ease-in-out duration-300"
            >
              {/* 🔥 Badge Populer */}
              {item.click_count > 20 && (
                <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow">
                  🔥 Populer
                </div>
              )}

              {/* ✨ Badge Baru */}
              {showNewBadge(item.created_at) && (
                <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg shadow">
                  ✨ Baru
                </div>
              )}

              <img
                src={imageUrl}
                alt={item.itemName}
                className="w-full h-40 object-cover rounded mb-4"
              />

              <h3 className="text-lg font-semibold">{item.itemName}</h3>
              <p className="text-sm text-gray-500 capitalize">{item.itemType}</p>
              <p className="text-md font-bold text-green-600 mb-2">Rp {item.price}</p>

              <Link
                to={`/produk/${encodeURIComponent(item.itemName)}`}
                onClick={() => handleProductClick(item.itemName)}
                className="text-blue-500 text-sm block text-center mb-4"
              >
                Lihat Detail
              </Link>

              <div className="flex justify-center space-x-1 mt-2">
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`cursor-pointer text-2xl ${
                      index < (item.rating || 0)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    } hover:text-yellow-500`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRatingChange(item.idProduct, index + 1);
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ItemList;
