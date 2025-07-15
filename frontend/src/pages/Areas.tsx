import { useEffect, useState } from 'react';
import axios from '../api/axios';
import Navbar from '../components/Navbar';
import { Link } from '@tanstack/react-router';
import useAutoLogout from '../hooks/useAutoLogout';
interface Area {
  _id?: string;
  areaName: string;
}

const Areas = () => {
  useAutoLogout();
  const [areas, setAreas] = useState<Area[]>([]);
  const [areaName, setAreaName] = useState('');
  const [error, setError] = useState('');

  const fetchAreas = async () => {
    try {
      const res = await axios.get('/areas');
      setAreas(res.data);
    } catch {
      alert('❌ Failed to load areas');
    }
  };

  const handleAdd = async () => {
    const trimmed = areaName.trim();
    if (!trimmed) {
      alert('Please enter area name');
      return;
    }

    try {
      await axios.post('/areas', { areaName: trimmed });
      setAreaName('');
      setError('');
      fetchAreas();
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message); // Show backend error
      } else {
        setError('❌ Failed to add area');
      }
    }
  };

  useEffect(() => {
    fetchAreas();
  }, []);

  return (
    <div>
      <Navbar />
      <div className="p-6 max-w-2xl mx-auto">
        <Link
  to="/dashboard"
  className="inline-block mb-4 text-black font-semibold hover:underline hover:text-blue-700 transition-colors"
>
  ← Back to Dashboard
</Link>


        <h1 className="text-2xl font-bold mb-4">📍 Area Management</h1>

        <div className="flex gap-2 mb-2">
          <input
            className="border p-2 w-full"
            placeholder="Enter new area"
            value={areaName}
            onChange={(e) => setAreaName(e.target.value)}
          />
          <button className="bg-green-600 text-white px-4 py-2" onClick={handleAdd}>
            ➕ Add
          </button>
        </div>

        {error && <p className="text-red-600 mb-2">{error}</p>}

        <ul className="list-disc pl-6">
          {areas.map((area) => (
            <li key={area._id} className="mb-1">
              {/* Capitalize each word in the area name */}
              {area.areaName
                .split(' ')
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(' ')}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Areas;
