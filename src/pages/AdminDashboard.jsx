import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminLogin from '../components/AdminLogin'; // Pastikan AdminLogin diimpor

const AdminDashboard = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State untuk produk yang difilter
  const [newProduct, setNewProduct] = useState({
    itemName: "", itemType: "", location: "", image: null, description: "", price: "",
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State untuk status login
  const [searchQuery, setSearchQuery] = useState("");  // State untuk pencarian
  const navigate = useNavigate();

  // Mengambil data produk hanya jika sudah login
  useEffect(() => {
    if (isLoggedIn) {
      fetchProducts();
    }
  }, [isLoggedIn]);

  const fetchProducts = () => {
    axios
      .get("http://localhost:5000/api/products")
      .then((response) => {
        setProducts(response.data);
        setFilteredProducts(response.data); // Set produk yang difilter sama dengan produk awal
      })
      .catch((error) => console.error("Error fetching products:", error));
  };

  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewProduct({ ...newProduct, image: e.target.files[0] });
  };

  const handleAddOrUpdateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(newProduct).forEach((key) => {
      if (newProduct[key]) formData.append(key, newProduct[key]);
    });

    if (editingProductId) {
      // Update product
      axios
        .put(`http://localhost:5000/api/products/${editingProductId}`, formData)
        .then(() => fetchProducts())
        .catch((error) => console.error("Error updating product:", error));
    } else {
      // Add new product
      axios
        .post("http://localhost:5000/api/products", formData)
        .then(() => fetchProducts())
        .catch((error) => console.error("Error adding product:", error));
    }
    resetForm();
  };

  const resetForm = () => {
    setNewProduct({
      itemName: "", itemType: "", location: "", image: null, description: "", price: "",
    });
    setEditingProductId(null);
  };

  const handleEdit = (product) => {
    setNewProduct({ ...product, image: null });
    setEditingProductId(product.idProduct);
  };

  const handleDelete = (id) => {
    if (window.confirm("Yakin ingin menghapus produk ini?")) {
      axios
        .delete(`http://localhost:5000/api/products/${id}`)
        .then(() => fetchProducts())
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false); // Set status login ke false saat logout
    navigate("/"); // Redirect ke halaman login
  };

  const handleLogin = () => {
    setIsLoggedIn(true); // Set status login ke true saat login
    navigate("/admin"); // Redirect ke halaman dashboard
  };

  // Fungsi untuk menangani pencarian produk
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    if (query) {
      // Filter produk berdasarkan nama atau tipe produk
      const filtered = products.filter(product =>
        product.itemName.toLowerCase().includes(query) ||
        product.itemType.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products); // Jika tidak ada pencarian, tampilkan semua produk
    }
  };

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />; // Menampilkan halaman login jika belum login
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-5xl mx-auto bg-white shadow-lg p-8 rounded-lg">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Admin Dashboard</h1>

        {/* Form untuk menambah/edit produk */}
        <form onSubmit={handleAddOrUpdateProduct} className="space-y-4 mb-8">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="itemName"
              value={newProduct.itemName}
              onChange={handleChange}
              placeholder="Product Name"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              name="itemType"
              value={newProduct.itemType}
              onChange={handleChange}
              placeholder="Product Type"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="location"
              value={newProduct.location}
              onChange={handleChange}
              placeholder="Location"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="price"
              value={newProduct.price}
              onChange={handleChange}
              placeholder="Price"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
            <input
              type="number"
              name="rating"
              value={newProduct.rating || ""}
              onChange={handleChange}
              placeholder="Rating (optional)"
              className="w-full p-3 border border-gray-300 rounded-md"
            />
          </div>
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <textarea
            name="description"
            value={newProduct.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full p-3 border border-gray-300 rounded-md"
            rows="4"
          ></textarea>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 transition duration-200"
          >
            {editingProductId ? "Update Product" : "Add Product"}
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-3 rounded-md mt-6 hover:bg-red-600 transition duration-200"
          >
            Logout
          </button>
        </form>

        {/* Input Pencarian */}
        <div className="mb-6">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search for a product..."
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Product List</h2>
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <div key={product.idProduct} className="flex justify-between items-center bg-gray-50 p-4 rounded-md shadow-md">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{product.itemName}</h3>
                <p className="text-gray-600">{product.itemType}</p>
                <p className="text-gray-600">Lokasi: {product.location}</p>
                <p className="text-gray-600">Rp {product.price}</p>
                <p className="text-gray-600">{product.description}</p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="text-sm text-white bg-yellow-500 px-3 py-1 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(product.idProduct)}
                    className="text-sm text-white bg-red-500 px-3 py-1 rounded hover:bg-red-600"
                  >
                    Hapus
                  </button>
                </div>
              </div>
              <div className="w-24 h-24 overflow-hidden rounded-lg shadow-md bg-gray-200 flex items-center justify-center">
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  alt={product.itemName}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
