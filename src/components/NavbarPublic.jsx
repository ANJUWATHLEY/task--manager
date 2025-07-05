import { Link } from 'react-router-dom';

const NavbarPublic = () => {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow-md">
      <div className="text-2xl font-bold text-purple-600">
        <Link to="/">TaskFlow</Link>
      </div>
      <div className="space-x-4">
        <Link
          to="/login"
          className="px-5 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="px-5 py-2 rounded-lg text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:scale-105 shadow-md transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default NavbarPublic;
