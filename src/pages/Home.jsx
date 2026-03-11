import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import umkmImage1 from '../assets/images/1umkm.jpg';
import umkmImage2 from '../assets/images/2umkm.png';

function Home() {
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/products")  // Mengambil produk dari backend
      .then((res) => {
        console.log(res.data);  // Log data produk untuk memeriksa apakah click_count ada
        const sorted = res.data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));  // Pastikan urut berdasarkan created_at
        const topItems = sorted.slice(0, 4).map(item => ({
          ...item,
          click_count: Number(item.click_count) // Pastikan click_count adalah angka
        }));
        setItems(topItems);
      })
      .catch((err) => console.error("Gagal ambil produk:", err));
  }, []);  

  const handleClickProduct = (itemName) => {
    // Kirim data klik ke backend (jika endpoint tersedia)
    axios.post(`http://localhost:5000/api/items/click/${itemName}`).catch((err) => {
      console.error("Gagal update click count:", err);
    });

    // Arahkan ke halaman detail produk
    navigate(`/produk/${itemName}`);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center text-white flex flex-col items-center justify-center px-4 py-10"
      style={{ backgroundImage: "url('/images/background.jpg')" }}
    >
      {/* Navbar */}
      <nav className="w-full fixed top-0 left-0 bg-gray-800 bg-opacity-90 text-white p-4 z-50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <h1 className="text-3xl text-amber-500 font-bold">KatalogLokal.</h1>
          <a
            href="/admin"
            className="text-white text-lg font-semibold hover:text-amber-500 transition"
          >
            Login Admin
          </a>
        </div>
      </nav>
      
      <h1 className="text-5xl text-amber-500 font-bold drop-shadow-lg text-center mb-5 mt-32">
        Informasi Produk UMKM
      </h1>

      <p className="text-lg text-amber-900 mb-8 text-center max-w-xl drop-shadow">
        Temukan berbagai pilihan kue terbaik dan nikmati rekomendasi dari sistem cerdas kami.
      </p>

      {/* Banner 1 */}
      <div className="w-full flex justify-start mb-8 mt-10">
        <div className="bg-white bg-opacity-80 text-amber-900 rounded-xl shadow-lg p-8 max-w-3xl w-full flex flex-col sm:flex-row items-center gap-6">
          <img
            src={umkmImage1}
            alt="UMKM Banner"
            className="w-full sm:w-48 h-60 object-cover rounded-lg"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-2">Dukung Produk Lokal!</h2>
            <p className="text-base">
              Temukan, dukung, dan banggakan produk terbaik dari UMKM lokal.  
              Bersama kita majukan ekonomi bangsa!
            </p>
            <div className="w-full flex justify-center sm:justify-start mt-4">
              <button
                onClick={() => navigate("/produk")}
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg shadow-md transition mt-6"
              >
                Lihat Produk
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Produk Unggulan */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {items.map((item, index) => (
          <div
            key={item.idProduct || index}
            className="relative bg-white text-black rounded-xl overflow-hidden shadow-lg hover:scale-105 transition p-4 cursor-pointer"
            onClick={() => handleClickProduct(item.itemName)}
          >
            {/* Badge: Paling Populer jika click_count lebih dari 20*/}
            {item.click_count > 20 && (
             <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-bl-lg shadow">
             🔥 Populer
             </div>
            )}

            {/* Badge: Baru jika index 0 (produk terbaru) */}
            {index === 0 && (
              <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg shadow">
                ✨ Baru
              </div>
            )}

            <img
              src={item.imageUrl || `http://localhost:5000/uploads/${item.image}` || "/images/default-cake.jpg"}
              alt={item.itemName}
              className="w-full h-32 object-cover mb-3 rounded"
            />
            <h3 className="text-lg font-semibold">{item.itemName}</h3>
            <p className="text-sm text-gray-600">{item.itemType}</p>
            <p className="text-green-500 font-bold">Rp {item.price}</p>
          </div>
        ))}
      </div>
      
      {/* Banner 2 */}
      <div className="w-full flex justify-center mt-20 mb-8">
        <div className="bg-white bg-opacity-80 text-amber-900 rounded-xl shadow-lg p-8 max-w-3xl w-full flex flex-col sm:flex-row items-center gap-6">
          <img
            src={umkmImage2}
            alt="UMKM Banner"
            className="w-full sm:w-48 h-60 object-cover rounded-lg mb-6 sm:mb-0"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-bold mb-2">Dukung Produk Lokal!</h2>
            <p className="text-base">
              Temukan, dukung, dan banggakan produk terbaik dari UMKM lokal.  
              Bersama kita majukan ekonomi bangsa!
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Home;
