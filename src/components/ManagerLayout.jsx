import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ClipboardCheck, User, LogOut, X, Menu } from 'lucide-react';

const ManagerLayout = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('id');
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`bg-[#2c1c80] text-white p-4 space-y-6 transition-all duration-300 ${isCollapsed ? 'w-15' : 'w-60'}`}>
        {/* Toggle Button */}
        <button onClick={toggleSidebar} className="text-white ml-auto block">
          {isCollapsed ? <Menu /> : <X />}
        </button>


        {/* Nav Links */}
        <nav className="flex flex-col space-y-4">
          <NavLink
            to="dashboard"
            className={({ isActive }) =>
              `${isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200'} flex items-center space-x-2`
            }
          >
            <LayoutDashboard />
            {!isCollapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink
            to="create"
            className={({ isActive }) =>
              `${isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200'} flex items-center space-x-2`
            }
          >
            <ClipboardCheck />
            {!isCollapsed && <span>Assign Task</span>}
          </NavLink>

          <NavLink
            to="assigned-tasks"
            className={({ isActive }) =>
              `${isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200'} flex items-center space-x-2`
            }
          >
            <ClipboardCheck />
            {!isCollapsed && <span>View Task</span>}
          </NavLink>

          <NavLink
            to="/manager/profile"
            className={({ isActive }) =>
              `${isActive ? 'text-yellow-300 font-semibold' : 'hover:text-yellow-200'} flex items-center space-x-2`
            }
          >
            <User />
            {!isCollapsed && <span>Profile</span>}
          </NavLink>

          <button
            onClick={handleLogout}
            className="text-left text-red-400 hover:text-red-200 flex items-center space-x-2"
          >
            <LogOut />
            {!isCollapsed && <span>Logout</span>}
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
