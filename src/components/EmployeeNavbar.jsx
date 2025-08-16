import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { HiMenu, HiX, HiHome, HiClipboardList, HiUser, HiBell } from "react-icons/hi";

const EmployeeNavbar = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setUserMenuOpen(!userMenuOpen);

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link
            to="/employee/dashboard"
            className="text-3xl font-bold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Employee Panel
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-gray-700 font-medium text-lg">
            <Link
              to="/employee/dashboard"
              className={`flex items-center pb-1 border-b-2 border-transparent transition-all duration-300 ${
                isActive("/employee/dashboard")
                  ? "text-blue-600 border-blue-600"
                  : "hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              <HiHome className="mr-1 w-6 h-6" /> Dashboard
            </Link>

            <Link
              to="/employee/mytask"
              className={`flex items-center pb-1 border-b-2 border-transparent transition-all duration-300 ${
                isActive("/employee/mytask")
                  ? "text-blue-600 border-blue-600"
                  : "hover:text-blue-600 hover:border-blue-600"
              }`}
            >
              <HiClipboardList className="mr-1 w-6 h-6" /> My Tasks
            </Link>

            {/* Notification Icon */}
            <button className="relative text-gray-700 hover:text-blue-600">
              <HiBell className="w-6 h-6" />
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs font-bold px-2 rounded-full">
                5
              </span>
            </button>

            {/* User Avatar */}
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {user?.name?.charAt(0)}
                </div>
                <span className="text-lg font-semibold">{user?.name}</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg py-2 z-50">
                  <Link
                    to="/employee/profile"
                    className="block px-4 py-2 hover:bg-blue-100 text-gray-700"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-1 rounded-md"
            >
              {isOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4 space-y-2 bg-white border-t border-gray-200">
          <Link
            to="/employee/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center border-transparent hover:text-blue-600 hover:border-blue-600"
          >
            <HiHome className="mr-1 w-6 h-6" /> Dashboard
          </Link>
          <Link
            to="/employee/mytask"
            onClick={() => setIsOpen(false)}
            className="flex items-center pb-1 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600"
          >
            <HiClipboardList className="mr-1 w-6 h-6" /> My Tasks
          </Link>
          {/* Notification */}
          <button className="flex items-center pb-1 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600 relative">
            <HiBell className="mr-1 w-6 h-6" /> Notifications
            <span className="absolute -top-1 -right-3 bg-red-500 text-white text-xs font-bold px-2 rounded-full">
              5
            </span>
          </button>
          {/* User Avatar */}
          <Link
            to="/employee/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center pb-1 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600"
          >
            <HiUser className="mr-1 w-6 h-6" /> Profile
          </Link>
          <button
            onClick={() => {
              handleLogout();
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 border-2 border-red-500 text-red-600 rounded-md hover:bg-red-500 hover:text-white font-semibold transition-all duration-300"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default EmployeeNavbar;
