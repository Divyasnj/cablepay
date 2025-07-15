import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ name: string; role: string } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate({ to: '/login' });
  };

  return (
    <header className="bg-white shadow-md px-6 py-4 mb-6 border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        {/* Logo / App Name */}
        <div className="text-2xl font-bold text-blue-600 tracking-tight">
          CablePay
        </div>

        {/* User Info + Logout */}
        <div className="flex items-center gap-6">
          {user && (
            <div className="text-right">
              <p className="text-base font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role}</p>
            </div>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;



