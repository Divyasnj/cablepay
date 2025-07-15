import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from '@tanstack/react-router';
import useAutoLogout from '../hooks/useAutoLogout';
interface PaymentStatus {
  _id: string;
  name: string;
  area: string;
  phone: string;
  payments: {
    [month: string]: {
      paid: boolean;
      amount?: number;
      date?: string;
    };
  };
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const MonthlyStatus = () => {
  useAutoLogout();
  const [statusList, setStatusList] = useState<PaymentStatus[]>([]);
  const [filterArea, setFilterArea] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterUnpaidMonth, setFilterUnpaidMonth] = useState('');
  const [year, setYear] = useState<number>(2025);
  const [selectedRow, setSelectedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchStatus();
  }, [year]);

  const fetchStatus = async () => {
    try {
      const res = await axios.get(`/payments/status?year=${year}`);
      setStatusList(res.data);
    } catch (err) {
      console.error('Error fetching payment status:', err);
    }
  };

  const handleMarkPaid = async (customerId: string, month: string) => {
    const confirm = window.confirm(`Mark ${month} as paid?`);
    if (!confirm) return;

    try {
      await axios.post('/payments', {
        customerId,
        month,
        amount: 0,
        date: new Date().toISOString(),
      });
      fetchStatus();
    } catch (err) {
      console.error('Failed to mark payment', err);
      alert('❌ Error marking payment');
    }
  };

  const areas = Array.from(new Set(statusList.map((c) => c.area))).sort();

  const filteredList = statusList.filter((c) => {
    if (filterArea && c.area !== filterArea) return false;
    if (filterDate) {
      const hasDateMatch = Object.values(c.payments).some(
        (p) => p.paid && p.date?.startsWith(filterDate)
      );
      if (!hasDateMatch) return false;
    }
    if (filterUnpaidMonth && c.payments[filterUnpaidMonth]?.paid) return false;
    return true;
  });

  return (
    <div className="p-4 md:p-6 max-w-full md:max-w-7xl mx-auto">
      <Link
  to="/dashboard"
  className="inline-block mb-4 text-black font-semibold hover:underline hover:text-blue-700 transition-colors"
>
  ← Back to Dashboard
</Link>


      <h1 className="text-2xl md:text-3xl font-bold mb-4 text-center text-blue-700">
        📊 Monthly Payment Status - {year}
      </h1>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div>
          <label className="block text-gray-700 font-medium mb-1">Area:</label>
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All Areas</option>
            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Paid on:</label>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-full border p-2 rounded"
          />
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Unpaid in Month:</label>
          <select
            value={filterUnpaidMonth}
            onChange={(e) => setFilterUnpaidMonth(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">All</option>
            {months.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Year:</label>
          <select
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="w-full border p-2 rounded"
          >
            {[2025, 2026, 2027].map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl border">
        <table className="min-w-[900px] w-full text-sm text-left">
          <thead className="bg-blue-100 text-blue-700 text-xs sm:text-sm">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Area</th>
              <th className="p-3 border">Phone</th>
              {months.map((month) => (
                <th key={month} className="p-3 border text-center">{month}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredList.map((c) => (
              <tr
                key={c._id}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedRow === c._id ? 'bg-yellow-100' : ''
                }`}
                onClick={() =>
                  setSelectedRow(selectedRow === c._id ? null : c._id)
                }
              >
                <td className="p-3 border break-words">{c.name}</td>
                <td className="p-3 border break-words">{c.area}</td>
                <td className="p-3 border break-words">{c.phone}</td>
                {months.map((month) => {
                  const payment = c.payments[month];
                  return (
                    <td key={month} className="p-3 border text-center">
                      {payment?.paid ? (
                        <div className="text-green-700 text-xs">
                          ✅
                          <div className="text-[10px] leading-tight">
                            ₹{payment.amount}<br />
                            <span className="text-gray-500">
                              {payment.date?.split('T')[0]}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <button
                          className="text-red-500 hover:text-green-600 underline text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkPaid(c._id, month);
                          }}
                        >
                          ❌
                        </button>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MonthlyStatus;
