import { useEffect, useState } from 'react';
import axios from '../api/axios';
import { Link } from '@tanstack/react-router';
import useAutoLogout from '../hooks/useAutoLogout';
interface IncomeData {
  monthlyIncome: { [month: string]: number };
  totalIncome: number;
}

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

const Income = () => {
  useAutoLogout();
  const [income, setIncome] = useState<IncomeData | null>(null);

  const fetchIncome = async () => {
    const res = await axios.get('/payments/income');
    setIncome(res.data);
  };

  useEffect(() => {
    fetchIncome();
  }, []);

  return (
    <div className="p-6 max-w-2xl mx-auto">
        <Link
  to="/dashboard"
  className="inline-block mb-4 text-black font-semibold hover:underline hover:text-blue-700 transition-colors"
>
  ← Back to Dashboard
</Link>

      <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">
        💰 Income Overview
      </h1>

      {income && (
        <div className="bg-white shadow rounded-xl p-6 border">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">📅 Monthly Income</h2>
          <table className="w-full text-sm text-left border">
            <thead className="bg-blue-100 text-blue-700">
              <tr>
                <th className="p-3 border">Month</th>
                <th className="p-3 border">Amount</th>
              </tr>
            </thead>
            <tbody>
              {months.map((m) => (
                <tr key={m}>
                  <td className="p-3 border">{m}</td>
                  <td className="p-3 border">₹{income.monthlyIncome[m] || 0}</td>
                </tr>
              ))}
              <tr className="font-bold bg-gray-100">
                <td className="p-3 border">Total</td>
                <td className="p-3 border">₹{income.totalIncome}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Income;
