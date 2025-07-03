import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Users, ClipboardCheck, CheckCircle, LayoutDashboard, ListChecks, UserCog, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeRes = await axios.get('/admin/allemploye', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const taskRes = await axios.get('/admin/alltask', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEmployees(employeeRes.data);
        setTasks(Array.isArray(taskRes.data) ? taskRes.data : taskRes.data.tasks || []);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };

    fetchData();
  }, []);

  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1c0c36] text-white p-6 flex flex-col gap-6 shadow-xl">
        <div className="flex items-center gap-3 mb-8">
          <img src="https://ui-avatars.com/api/?name=Admin" alt="avatar" className="w-10 h-10 rounded-full" />
          <div>
            <h2 className="text-lg font-semibold">Jackson D.</h2>
            <p className="text-sm text-purple-400">Admin</p>
          </div>
        </div>

        <nav className="space-y-4">
          <div className="flex items-center gap-3 text-purple-300 hover:text-white cursor-pointer">
            <LayoutDashboard size={20} /> Dashboard
          </div>
          <div className="flex items-center gap-3 text-purple-300 hover:text-white cursor-pointer">
            <ListChecks size={20} /> Tasks
          </div>
          <div className="flex items-center gap-3 text-purple-300 hover:text-white cursor-pointer">
            <UserCog size={20} /> Employees
          </div>
          <div className="flex items-center gap-3 text-purple-300 hover:text-white cursor-pointer">
            <MessageSquare size={20} /> Inbox
          </div>
        </nav>
      </aside>

      {/* Dashboard Content */}
      <main className="flex-1 bg-gradient-to-tr from-[#1f0836] via-[#2c0e58] to-[#3a0a6e] text-white p-8">
        <h1 className="text-4xl font-bold text-center mb-10 tracking-wider">🚀 Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#6a0dad] bg-opacity-30 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <Users size={38} className="text-purple-300" />
              <div>
                <h2 className="text-lg font-semibold text-purple-200">Total Employees</h2>
                <p className="text-3xl font-bold text-white">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#7e22ce] bg-opacity-30 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <ClipboardCheck size={38} className="text-purple-300" />
              <div>
                <h2 className="text-lg font-semibold text-purple-200">Tasks Assigned</h2>
                <p className="text-3xl font-bold text-white">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#9333ea] bg-opacity-30 backdrop-blur-md rounded-2xl p-6 shadow-lg hover:scale-105 transition-all duration-300">
            <div className="flex items-center gap-4">
              <CheckCircle size={38} className="text-purple-300" />
              <div>
                <h2 className="text-lg font-semibold text-purple-200">Completed Tasks</h2>
                <p className="text-3xl font-bold text-white">{completedTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-10 text-purple-300 text-sm italic">
          More widgets coming soon (Calendar, Project Summary, Charts...) 🚧
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
