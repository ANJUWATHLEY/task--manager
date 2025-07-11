// src/components/ManagerNavbar.jsx
import { Link, useNavigate } from 'react-router-dom';

const ManagerNavbar = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <Link to="/manager/dashboard" className="text-2xl font-bold text-blue-600">
         Manager Panel
      </Link>
      <div className="space-x-6 text-gray-700 font-medium">
        <Link to="/manager/dashboard">Dashbord</Link>
        <Link to="/manager/team-view">Task View</Link>
        <Link to="/assigned-tasks">Team View </Link>
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

export default ManagerNavbar;
