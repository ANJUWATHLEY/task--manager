import { Link } from 'react-router-dom';

const NavbarPublic = () => {
  return (
    <nav className="flex items-center justify-between px-8 h-16 bg-blue-100 border-b border-gray-200 shadow-sm">
      {/* Logo */}
      <div className="text-2xl font-bold">
        <Link
          to="/"
          className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
        >
          TaskFlow
        </Link>
      </div>

      {/* Right Side Buttons */}
      <div className="flex items-center gap-4">
        {/* Login */}
        <Link
          to="/login"
          className="px-5 py-2 rounded-lg border border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition"
        >
          Login
        </Link>

        {/* Sign Up */}
        <Link
          to="/signup"
          className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium shadow-md hover:shadow-lg hover:scale-105 transition"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default NavbarPublic;
