import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from '@tanstack/react-router';
import useAutoLogout from '../hooks/useAutoLogout';
interface Customer {
  _id: string;
  name: string;
  area: string;
}

const AddPayment = () => {
  useAutoLogout();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [month, setMonth] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  const fetchCustomers = async () => {
    const res = await axios.get('/customers');
    setCustomers(res.data);
  };

  const handleSubmit = async () => {
    if (!customerId || !month || !amount || !date) {
      alert('Please fill all fields');
      return;
    }

    try {
      const formattedDate = new Date(date);

      await axios.post('/payments', {
        customerId,
        month,
        amount: Number(amount),
        date: formattedDate.toISOString(), // Ensure ISO string format
      });

      alert('✅ Payment marked successfully');
      setCustomerId('');
      setMonth('');
      setAmount('');
      setDate('');
    } catch (err: any) {
      if (err.response?.status === 409) {
        alert('⚠️ Payment for this customer and month already exists');
      } else {
        console.error(err);
        alert('❌ Failed to mark payment');
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="p-6 max-w-xl mx-auto">
      <Link
  to="/dashboard"
  className="inline-block mb-4 text-black font-semibold hover:underline hover:text-blue-700 transition-colors"
>
  ← Back to Dashboard
</Link>

      <h1 className="text-2xl font-bold mb-6 text-blue-700">➕ Add Payment</h1>

      <div className="flex flex-col gap-4">
        <select
          className="border p-3 rounded"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
        >
          <option value="">-- Select Customer --</option>
          {customers.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c.area})
            </option>
          ))}
        </select>

        <select
          className="border p-3 rounded"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        >
          <option value="">-- Select Month --</option>
          {[
            'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
          ].map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <input
          type="number"
          className="border p-3 rounded"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <input
          type="date"
          className="border p-3 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
          onClick={handleSubmit}
        >
          ✅ Mark Payment
        </button>
      </div>
    </div>
  );
};

export default AddPayment;
