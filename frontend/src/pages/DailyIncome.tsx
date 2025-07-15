import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from '@tanstack/react-router';
import useAutoLogout from '../hooks/useAutoLogout';
const months = [
  { name: 'January', value: 1 },
  { name: 'February', value: 2 },
  { name: 'March', value: 3 },
  { name: 'April', value: 4 },
  { name: 'May', value: 5 },
  { name: 'June', value: 6 },
  { name: 'July', value: 7 },
  { name: 'August', value: 8 },
  { name: 'September', value: 9 },
  { name: 'October', value: 10 },
  { name: 'November', value: 11 },
  { name: 'December', value: 12 },
];

const currentYear = new Date().getFullYear();
const startYear = 2025;

const DailyIncome = () => {
  useAutoLogout();
  const [dailyIncome, setDailyIncome] = useState<{ [day: string]: number }>({});
  const [month, setMonth] = useState<number>(7); // Default: July
  const [year, setYear] = useState<number>(2025);

  useEffect(() => {
    const fetchIncome = async () => {
      try {
        const res = await axios.get(`/payments/daily-income?month=${month}&year=${year}`);
        setDailyIncome(res.data);
      } catch (error) {
        console.error('Failed to fetch income data', error);
      }
    };

    fetchIncome();
  }, [month, year]);

  const getDaysInMonth = (m: number, y: number): number => {
    return new Date(y, m, 0).getDate(); // Day 0 of next month = last day of current month
  };

  const daysInMonth = getDaysInMonth(month, year);

  return (
    <div className="p-6 max-w-3xl mx-auto">
        <Link
  to="/dashboard"
  className="inline-block mb-4 text-black font-semibold hover:underline hover:text-blue-700 transition-colors"
>
  ← Back to Dashboard
</Link>

      <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">
        Daily Income Report
      </h1>

      {/* 🕽️ Month & Year Filters */}
      <div className="flex gap-4 mb-6">
        <select
          className="border p-2 rounded"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.name}
            </option>
          ))}
        </select>

        <select
          className="border p-2 rounded"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: currentYear + 3 - startYear }, (_, i) => startYear + i).map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>

      {/* 📊 Income Table */}
      <table className="w-full border text-left">
        <thead className="bg-blue-100 text-blue-700">
          <tr>
            <th className="p-3 border">Date</th>
            <th className="p-3 border">Income (₹)</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(daysInMonth)].map((_, i) => {
            const day = i + 1;
            return (
              <tr key={day} className="hover:bg-gray-50">
                <td className="p-3 border">{`${day}/${month}/${year}`}</td>
                <td className="p-3 border">{dailyIncome[day] || 0}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DailyIncome;
