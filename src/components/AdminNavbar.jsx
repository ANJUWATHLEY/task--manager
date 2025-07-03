// src/components/AdminNavbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="w-full bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 shadow-md px-6 py-4 flex flex-wrap items-center justify-between transition-all duration-300">
      {/* Left Title */}
      <Link
        to="/admin/dashboard"
        className="text-3xl font-extrabold text-white tracking-wide hover:text-yellow-200 transition"
      >
        Admin
      </Link>

      {/* Right Menu */}
      <div className="flex flex-wrap items-center gap-4 mt-2 sm:mt-0 text-white font-medium text-sm">
        <Link to="/admin/dashboard" className="hover:text-yellow-300 transition">
          Dashboard
        </Link>
        <Link to="/admin/tasks" className="hover:text-yellow-300 transition">
          Tasks
        </Link>
        <Link to="/admin/view-tasks" className="hover:text-yellow-300 transition">
          View Tasks
        </Link>
        <Link to="/admin/user" className="hover:text-yellow-300 transition">
          Users
        </Link>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-red-500 px-3 py-1 rounded-full hover:bg-red-600 transition"
        >
          <LogOut size={16} />
          <span className="text-white">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
