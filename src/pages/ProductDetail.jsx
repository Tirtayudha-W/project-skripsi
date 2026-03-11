import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProductDetail() {
  const { itemName } = useParams();
  const [product, setProduct] = useState(null);
  const [aiRecommended, setAiRecommended] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [reviewForm, setReviewForm] = useState({ name: "", location: "", rating: 0 });

  // Fetch semua produk dan cari produk berdasarkan itemName dari URL
  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/products")
      .then((res) => {
        if (!res.ok) throw new Error("Gagal ambil produk");
        return res.json();
      })
      .then((data) => {
        const found = data.find(item => item.itemName.toLowerCase() === itemName.toLowerCase());
        setProduct(found);
      })
      .catch((err) => console.error("Error fetching products:", err));
  }, [itemName]);

  // Fetch rekomendasi berdasarkan itemName produk
  useEffect(() => {
    if (product?.itemName) {
      axios
        .get(`http://localhost:5000/api/rekomendasi/${encodeURIComponent(product.itemName)}`)
        .then((res) => setAiRecommended(res.data))
        .catch((err) => console.error("Gagal ambil rekomendasi:", err));
    }
  }, [product]);

  // Fetch review untuk produk saat ini
  useEffect(() => {
    if (product?.idProduct) {
      axios
        .get(`http://127.0.0.1:5000/api/reviews/${product.idProduct}`)
        .then(res => setReviews(res.data))
        .catch(err => console.error("Gagal ambil review:", err));
    }
  }, [product]);

  // Submit review
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewForm.name || !reviewForm.location || !reviewForm.rating) return;

    axios.post("http://127.0.0.1:5000/api/reviews", {
      product_id: product.idProduct,
      name: reviewForm.name,
      location: reviewForm.location,
      rating: reviewForm.rating,
    })
    .then(() => {
      setReviewForm({ name: "", location: "", rating: 0 });
      return axios.get(`http://127.0.0.1:5000/api/reviews/${product.idProduct}`);
    })
    .then(res => setReviews(res.data))
    .catch(err => console.error("Gagal kirim review:", err));
  };

  const getImageSrc = (image) => {
    if (!image) return "/images/default.jpg";
    return image.startsWith("http") ? image : `http://127.0.0.1:5000/uploads/${image}`;
  };

  const uniqueAiRecommended = Array.from(
    new Map(aiRecommended.map(item => [item.itemName.toLowerCase(), item])).values()
  );

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Detail Produk */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <img
          src={getImageSrc(product.image)}
          alt={product.itemName}
          className="w-full h-96 object-cover rounded-lg shadow"
        />
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.itemName}</h1>
          <p className="text-gray-600 text-sm mb-2">Tipe: {product.itemType}</p>
          <p className="text-gray-600 text-sm mb-2">Lokasi: {product.location}</p>
          <p className="text-green-600 text-xl font-semibold mb-4">
            Rp {product.price}
          </p>
          <p className="text-gray-700">{product.description}</p>
        </div>
      </div>

      {/* Review Produk */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold mb-4">Review Pengguna</h2>
        {reviews.length > 0 ? (
          <div className="space-y-4 mb-6">
            {reviews.map((rev, idx) => (
              <div key={idx} className="border p-4 rounded shadow-sm">
                <p className="font-semibold">{rev.name} <span className="text-sm text-gray-500">({rev.location})</span></p>
                <div className="flex space-x-1 mt-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <span key={i} className={`text-sm ${i < rev.rating ? "text-yellow-400" : "text-gray-300"}`}>★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mb-4">Belum ada review untuk produk ini.</p>
        )}

        {/* Form Review */}
        <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-md">
          <input
            type="text"
            placeholder="Nama Anda"
            value={reviewForm.name}
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Asal Daerah"
            value={reviewForm.location}
            onChange={(e) => setReviewForm({ ...reviewForm, location: e.target.value })}
            className="w-full border p-2 rounded"
            required
          />
          <select
            value={reviewForm.rating}
            onChange={(e) => setReviewForm({ ...reviewForm, rating: parseInt(e.target.value) })}
            className="w-full border p-2 rounded"
            required
          >
            <option value="">Pilih Rating</option>
            {[1, 2, 3, 4, 5].map(num => (
              <option key={num} value={num}>{num} ⭐</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Kirim Review
          </button>
        </form>
      </div>

      {/* Rekomendasi Berdasarkan AI */}
      <h2 className="text-2xl font-semibold mt-10 mb-4">Rekomendasi Berdasarkan AI</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {uniqueAiRecommended.length > 0 ? (
          uniqueAiRecommended.map((item, index) => (
            <Link
              to={`/produk/${encodeURIComponent(item.itemName)}`}
              key={index}
              className="border rounded-lg shadow p-4 hover:shadow-md transition"
            >
              <img
                src={getImageSrc(item.image)}
                alt={item.itemName}
                className="w-full h-40 object-cover mb-2 rounded"
              />
              <h3 className="text-lg font-semibold">{item.itemName}</h3>
              <p className="text-sm text-gray-500">{item.itemType}</p>
              <p className="text-md font-bold text-green-600">Rp {item.price}</p>
              <p className="text-blue-500 text-sm mt-2">Lihat Detail</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500">Tidak ada rekomendasi berdasarkan AI.</p>
        )}
      </div>
    </div>
  );
}

export default ProductDetail;
