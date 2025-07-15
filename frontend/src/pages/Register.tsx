import { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      return alert('⚠️ All fields are required');
    }

    try {
      setLoading(true);
      await axios.post('http://localhost:5000/api/auth/register', form);
      alert('✅ Registered successfully');
      setForm({ name: '', email: '', password: '' }); // clear form
    } catch (err: any) {
      alert(err.response?.data?.message || '❌ Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Register</h1>
      <input
        className="border p-2 w-full mb-2"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
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
        disabled={loading}
        className="bg-green-600 text-white py-2 w-full rounded disabled:opacity-50"
        onClick={handleRegister}
      >
        {loading ? 'Registering...' : 'Register'}
      </button>

      
      <div className="text-center mt-4 text-sm">
        Already have an account?{' '}
        <a href="/login" className="text-blue-600 hover:underline">
          Login here
        </a>
      </div>
    </div>
  );
};

export default Register;
