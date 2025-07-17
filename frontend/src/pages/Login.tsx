import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from '@tanstack/react-router';
import { GoogleLogin } from '@react-oauth/google';

// ✅ Use env variable for backend URL
const API_URL = import.meta.env.VITE_API_URL;

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API_URL}/auth/login`, form);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ name: res.data.name, role: res.data.role })
      );
      alert(`✅ Welcome ${res.data.name} (${res.data.role})`);
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      alert(err.response?.data?.message || '❌ Login failed');
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    const googleToken = response.credential;
    try {
      const res = await axios.post(`${API_URL}/auth/google`, {
        token: googleToken,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem(
        'user',
        JSON.stringify({ name: res.data.name, role: res.data.role })
      );
      alert(`✅ Logged in as ${res.data.name} (${res.data.role})`);
      navigate({ to: '/dashboard' });
    } catch (err: any) {
      alert(err.response?.data?.message || '❌ Google login failed');
    }
  };

  const handleGoogleError = () => {
    alert('❌ Google Login Failed');
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Login</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        className="border p-2 w-full mb-2"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        className="bg-blue-600 text-white py-2 w-full mb-4"
        onClick={handleLogin}
      >
        Login
      </button>

      <div className="text-center text-gray-500 mb-2">or</div>

      <GoogleLogin onSuccess={handleGoogleSuccess} onError={handleGoogleError} />

      <div className="text-center mt-4 text-sm">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-600 hover:underline">
          Register here
        </a>
      </div>
    </div>
  );
};

export default Login;
