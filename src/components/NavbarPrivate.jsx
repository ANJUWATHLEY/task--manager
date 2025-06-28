import { Link, useNavigate } from 'react-router-dom';

const NavbarPrivate = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-purple-600">
        <Link to="/">📝 TaskFlow</Link>
      </div>

      <div className="hidden md:flex space-x-6 text-gray-700 font-medium">
        <Link to="/">Home</Link>
        <Link to="/features">Features</Link>
        <Link to="/employee/assigned-tasks">Tasks</Link>
      </div>

      <button
        onClick={handleLogout}
        className="px-4 py-2 rounded-lg text-red-600 border border-red-600 hover:bg-red-50 transition"
      >
        Logout
      </button>
    </nav>
  );
};

export default NavbarPrivate;
