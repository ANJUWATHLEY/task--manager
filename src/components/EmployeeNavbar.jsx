import { Link, useNavigate } from 'react-router-dom';

const EmployeeNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow-md">
      <Link to="/employee/dashboard" className="text-2xl font-bold text-green-600">
        👷 Employee Panel
      </Link>
      <div className="space-x-6 text-gray-700 font-medium">
        <Link to="/employee/dashboard">Dashboard</Link>
        <Link to="/employee/mytask">My Tasks</Link>
        <Link to="/employee/profile">Profile</Link>
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

export default EmployeeNavbar;
