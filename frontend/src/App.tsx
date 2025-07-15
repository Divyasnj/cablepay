import { Outlet } from '@tanstack/react-router';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* ✅ Optional: Header/Navbar */}
      <header className="bg-blue-600 text-white p-4 text-xl font-bold shadow">
        Cable Pay
      </header>

      {/* ✅ Route-specific pages go here */}
      <main className="p-4 max-w-4xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
