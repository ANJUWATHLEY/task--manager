// src/components/AdminNavbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <Link to="/admin/dashboard" className="text-2xl font-bold text-purple-600">
        🧑‍💼 Admin Panel
      </Link>
      <div className="space-x-6 text-gray-700 font-medium">
        <Link to="/admin/manage-users">Manage Users</Link>
        <Link to="/admin/task-form">Assign Task</Link>
        <Link to="/admin/assigned-tasks">View Tasks</Link>
        <button
          onClick={handleLogout}
          className="px-4 py-1 border text-red-600 border-red-600 rounded hover:bg-red-100"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
