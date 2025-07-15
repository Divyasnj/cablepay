import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from '@tanstack/react-router';
import Navbar from '../components/Navbar';
import useAutoLogout from '../hooks/useAutoLogout';
interface Customer {
  _id?: string;
  name: string;
  area: string;
  phone: string;
}

interface Area {
  _id: string;
  areaName: string;
}

// ... all your existing imports and interfaces

const Customers = () => {
  useAutoLogout();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState<Customer>({
    name: '',
    area: '',
    phone: '',
  });

  const [areaQuery, setAreaQuery] = useState('');
  const [showAreaDropdown, setShowAreaDropdown] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedAreaFilter, setSelectedAreaFilter] = useState(''); // 🌟 NEW state

  const fetchCustomers = async () => {
    const res = await axios.get('/customers');
    setCustomers(res.data);
  };

  const fetchAreas = async () => {
    const res = await axios.get('/areas');
    setAreas(res.data);
  };

  const handleAdd = async () => {
    setError(null);
    if (!form.name || !form.area || !form.phone) {
      setError('❗ Name, Area, and Phone are required.');
      return;
    }

    try {
      await axios.post('/customers', form);
      await fetchCustomers();
      setForm({ name: '', area: '', phone: '' });
      setAreaQuery('');
    } catch (err: any) {
      if (err.response?.status === 400) {
        setError('⚠️ Duplicate customer: Same name, area, and phone already exists.');
      } else {
        setError('❌ Failed to add duplicate customer. Please try again.');
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchAreas();
  }, []);

  // 🌟 Filter customers by selected area
  const filteredCustomers = selectedAreaFilter
    ? customers.filter((c) => c.area === selectedAreaFilter)
    : customers;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <Link
  to="/dashboard"
  className="inline-block mb-4 text-black font-semibold hover:underline hover:text-blue-700 transition-colors"
>
  ← Back to Dashboard
</Link>


        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          📋 Customer Management
        </h1>

        {/* Add Customer Form */}
        <div className="bg-white shadow-md rounded-2xl p-6 mb-8 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">➕ Add New Customer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <div className="relative">
              <input
                className="border p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Search Area"
                value={areaQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  setAreaQuery(value);
                  setForm({ ...form, area: value });
                  setShowAreaDropdown(true);
                }}
                onFocus={() => setShowAreaDropdown(true)}
                onBlur={() => setTimeout(() => setShowAreaDropdown(false), 200)}
              />
              {showAreaDropdown && areaQuery && (
                <ul className="absolute z-10 w-full bg-white border rounded shadow max-h-48 overflow-y-auto">
                  {areas
                    .filter((a) =>
                      a.areaName.toLowerCase().includes(areaQuery.toLowerCase())
                    )
                    .map((a) => (
                      <li
                        key={a._id}
                        className="p-2 hover:bg-blue-100 cursor-pointer"
                        onClick={() => {
                          setForm({ ...form, area: a.areaName });
                          setAreaQuery(a.areaName);
                          setShowAreaDropdown(false);
                        }}
                      >
                        {a.areaName}
                      </li>
                    ))}
                  {areas.filter((a) =>
                    a.areaName.toLowerCase().includes(areaQuery.toLowerCase())
                  ).length === 0 && (
                    <li className="p-2 text-gray-500">No matching areas</li>
                  )}
                </ul>
              )}
            </div>

            <input
              className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 col-span-1 sm:col-span-2"
              placeholder="Phone Number"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />

            <button
              className="bg-blue-600 hover:bg-blue-700 transition text-white p-3 rounded-lg col-span-1 sm:col-span-2"
              onClick={handleAdd}
            >
              ✅ Add Customer
            </button>

            {error && (
              <div className="col-span-1 sm:col-span-2 text-red-600 font-medium mt-2">
                {error}
              </div>
            )}
          </div>
        </div>

        {/* 🌟 Area Filter Dropdown */}
        <div className="mb-4">
          <label className="mr-2 font-medium text-gray-700">Filter by Area:</label>
          <select
            className="border p-2 rounded"
            value={selectedAreaFilter}
            onChange={(e) => setSelectedAreaFilter(e.target.value)}
          >
            <option value="">All Areas</option>
            {Array.from(new Set(customers.map((c) => c.area)))
              .sort()
              .map((area, idx) => (
                <option key={idx} value={area}>
                  {area}
                </option>
              ))}
          </select>
        </div>

        {/* Customer List */}
        <div className="overflow-x-auto bg-white shadow-md rounded-2xl border">
          <table className="w-full text-sm text-left">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Area</th>
                <th className="p-3 border">Phone</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50">
                  <td className="p-3 border">{c.name}</td>
                  <td className="p-3 border">{c.area}</td>
                  <td className="p-3 border">{c.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Customers;
