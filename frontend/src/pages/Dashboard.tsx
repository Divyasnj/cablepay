import { useEffect, useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import useAutoLogout from '../hooks/useAutoLogout';
const Dashboard = () => {
  useAutoLogout();
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [customerCount, setCustomerCount] = useState<number>(0);
  const [totalIncome, setTotalIncome] = useState<number>(0);
  const [todayIncome, setTodayIncome] = useState<number>(0);
  const [todayStr, setTodayStr] = useState<string>(''); // 👈 Add date state

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));

    fetchCustomerCount();
    fetchTotalIncome();
    fetchTodayIncome();

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formatted = new Date().toLocaleDateString('en-IN', options);
    setTodayStr(formatted);
  }, []);

  const fetchCustomerCount = async () => {
    try {
      const res = await axios.get('/customers');
      setCustomerCount(res.data.length);
    } catch (err) {
      console.error('Failed to fetch customer count');
    }
  };

  const fetchTotalIncome = async () => {
    try {
      const res = await axios.get('/payments/income');
      setTotalIncome(res.data.totalIncome || 0);
    } catch (err) {
      console.error('Failed to fetch income');
    }
  };

  const fetchTodayIncome = async () => {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    try {
      const res = await axios.get(`/payments/income?date=${dateStr}`);
      setTodayIncome(res.data.totalIncome || 0);
    } catch (err) {
      console.error("Failed to fetch today's income");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-blue-800">📊 Dashboard</h1>

        {/* 📅 Today's Date */}
        {todayStr && (
          <div className="text-center text-xl md:text-2xl font-bold text-gray-700 mb-6">
            📅 {todayStr}
          </div>
        )}

        {/* 👤 User Info */}
        {user ? (
          <div className="mb-6">
            <p className="text-lg">
              Welcome, <span className="font-semibold">{user.name}</span>
            </p>
            <p className="text-sm text-gray-500 capitalize">Role: {user.role}</p>
          </div>
        ) : (
          <p className="text-gray-500 mb-6">Loading user info...</p>
        )}

        {/* 📦 Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div
            onClick={() => navigate({ to: '/income' })}
            className="bg-blue-100 p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">Total Income</h2>
            <p className="text-xl text-blue-900">₹{totalIncome}</p>
          </div>

          <div
            onClick={() => navigate({ to: '/collection' })}
            className="bg-green-100 p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">Today’s Collection</h2>
            <p className="text-xl text-green-900">₹{todayIncome}</p>
          </div>

          <div
            onClick={() => navigate({ to: '/customers' })}
            className="bg-yellow-100 p-4 rounded-xl shadow cursor-pointer hover:shadow-lg transition"
          >
            <h2 className="text-lg font-semibold">Customers</h2>
            <p className="text-xl text-yellow-900">{customerCount}</p>
          </div>
        </div>

        {/* 🔧 Management Buttons */}
        <div className="grid gap-4 sm:grid-cols-2 text-center">
          <Link
            to="/areas"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full shadow transition"
          >
            ➕ Add Areas
          </Link>

          <Link
            to="/customers"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full shadow transition"
          >
            ➕ Add Customers
          </Link>

          <Link
            to="/add-payment"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition"
          >
            ➕ Add Payment
          </Link>

          <Link
            to="/payments"
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-full shadow transition"
          >
            💰 Monthly Payment Status
          </Link>

          <Link
            to="/income"
            className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-full shadow transition col-span-full"
          >
            📈 View Full Income Report
          </Link>

          <Link
            to="/daily-income"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full shadow transition col-span-full"
          >
            📅 View Daily Income
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
