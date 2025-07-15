import axios from 'axios';

// ✅ Load API base URL from .env
const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // set to true if using cookies in the future
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Auto attach token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default instance;
