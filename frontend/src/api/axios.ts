import axios from 'axios';
const instance = axios.create({
  baseURL: 'https://cablepay.onrender.com/api',
  withCredentials: false, // You can set this true if using cookies later
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optionally add interceptors (e.g., attach JWT token automatically)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
