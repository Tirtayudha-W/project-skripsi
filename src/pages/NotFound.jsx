import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
      <p className="text-lg mb-6">Oops! Halaman yang kamu cari tidak ditemukan.</p>
      <Link to="/">
        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
          Kembali ke Beranda
        </button>
      </Link>
    </div>
  );
}

export default NotFound;
