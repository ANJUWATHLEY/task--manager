import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, User, LogOut } from 'lucide-react';

const ManagerLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#2c1c80] text-white p-6 space-y-6">
        <h2 className="text-2xl font-bold mb-6">Manager Panel</h2>
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-yellow-300' : 'hover:text-yellow-200'
            }
          >
            <LayoutDashboard className="inline-block mr-2" />
            Dashboard
          </NavLink>

          <NavLink
            to="create"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-yellow-300' : 'hover:text-yellow-200'
            }
          >
            <ClipboardCheck className="inline-block mr-2" />
            Assign Task
          </NavLink>

          <NavLink
            to="/manager/my-tasks"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-yellow-300' : 'hover:text-yellow-200'
            }
          >
            <ClipboardCheck className="inline-block mr-2" />
            My Tasks
          </NavLink>

          <NavLink
            to="/manager/profile"
            className={({ isActive }) =>
              isActive ? 'font-semibold text-yellow-300' : 'hover:text-yellow-200'
            }
          >
            <User className="inline-block mr-2" />
            Profile
          </NavLink>

          <button onClick={handleLogout} className="text-left text-red-400 hover:text-red-200">
            <LogOut className="inline-block mr-2" />
            Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default ManagerLayout;
