import { Link, useNavigate, useLocation } from 'react-router-dom';

const EmployeeNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-white shadow-lg border-b border-gray-100">
      <Link
        to="/employee/dashboard"
        className="text-3xl font-black text-blue-600 tracking-tight hover:text-blue-700 transition-colors duration-300"
      >
        Employee Panel
      </Link>

      <div className="flex items-center gap-8 text-gray-700 text-lg font-medium">
        <Link
          to="/employee/dashboard"
          className={`pb-1 border-b-2 transition-all duration-300 ${
            isActive('/employee/dashboard')
              ? 'text-blue-600 border-blue-600'
              : 'border-transparent hover:text-blue-600 hover:border-blue-600'
          }`}
        >
          Dashboard
        </Link>
        <Link
          to="/employee/mytask"
          className={`pb-1 border-b-2 transition-all duration-300 ${
            isActive('/employee/mytask')
              ? 'text-blue-600 border-blue-600'
              : 'border-transparent hover:text-blue-600 hover:border-blue-600'
          }`}
        >
          My Tasks
        </Link>
        <Link
          to="/employee/profile"
          className={`pb-1 border-b-2 transition-all duration-300 ${
            isActive('/employee/profile')
              ? 'text-blue-600 border-blue-600'
              : 'border-transparent hover:text-blue-600 hover:border-blue-600'
          }`}
        >
          Profile
        </Link>

        <button
          onClick={handleLogout}
          className="px-6 py-2 border-2 border-red-500 text-red-600 rounded-lg hover:bg-red-500 hover:text-white font-semibold transition-all duration-300"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default EmployeeNavbar;
