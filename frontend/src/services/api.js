import axios from 'axios';

// 1. Vite environment variable se URL uthayega
// 2. Agar .env load nahi hui, toh fallback ke liye tumhara Render URL use karega
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://omnidoc-ai-yg7p.onrender.com';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Debugging ke liye (Optional): Console mein dikhayega ki kaunsa URL use ho raha hai
console.log("🚀 API Base URL:", API_BASE_URL);

export default api;