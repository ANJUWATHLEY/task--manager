// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ListChecks, ClipboardCheck, UserCog, LogOut, Menu, X,Eye
} from 'lucide-react';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className={`transition-all duration-300 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {sidebarOpen && <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center">
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[ 
            { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
            { icon: ListChecks, label: 'Tasks', path: '/admin/tasks' },
            { icon: Eye, label: 'View Tasks', path: '/admin/view-tasks' },
            { icon: UserCog, label: 'Users', path: '/admin/user' },
            { icon: ClipboardCheck, label: 'Completed Tasks', path: '/admin/completed-tasks' }



          ].map((item, i) => (
            <Link key={i} to={item.path} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
              <item.icon size={24} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}

          <button
            onClick={handleLogout}
            className="mt-6 flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut size={24} />
            {sidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </nav>
      </aside>

      {/* ✅ Page Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <Outlet /> {/* ✅ This will render the current page here only */}
      </main>
    </div>
  );
};

export default AdminLayout; 