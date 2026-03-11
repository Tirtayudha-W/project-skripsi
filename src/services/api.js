import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api'; // Pastikan port 5000

// Ambil semua produk kue
export const fetchAllItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items`);
    return response.data;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error; // Lempar error agar komponen dapat menanganinya
  }
};

// Ambil rekomendasi berdasarkan itemName (bukan userId)
export const fetchRecommendations = async (itemName) => { // Menggunakan itemName
  try {
    const response = await axios.get(`${API_BASE_URL}/rekomendasi/${itemName}`); // Menggunakan endpoint yang benar
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    throw error; // Lempar error agar komponen dapat menanganinya
  }
};