import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  Users, ClipboardCheck, CheckCircle, LayoutDashboard,
  ListChecks, UserCog, Menu, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeRes = await axios.get('/admin/allemploye', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const employeesData = Array.isArray(employeeRes.data)
          ? employeeRes.data
          : employeeRes.data.employees || [];

        const taskRes = await axios.get('/admin/alltask', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const tasksData = Array.isArray(taskRes.data)
          ? taskRes.data
          : taskRes.data.tasks || [];

        setEmployees(employeesData);
        setTasks(tasksData);
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    fetchData();
  }, [token]);

  const completedTasks = tasks.filter((task) => task.status?.toLowerCase() === 'completed');
  const pendingTasks = tasks.filter((task) => task.status?.toLowerCase() === 'pending');
  const inProgressTasks = tasks.filter((task) => task.status?.toLowerCase() === 'in-progress');
  const overdueTasks = tasks.filter((task) => task.status?.toLowerCase() === 'overdue');

  const pieData = [
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    { name: 'Pending', value: pendingTasks.length, color: '#6366f1' },
    { name: 'In Progress', value: inProgressTasks.length, color: '#f59e0b' },
    { name: 'Overdue', value: overdueTasks.length, color: '#ef4444' },
  ];

  const getMonthName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'short' });
  };

  const monthlyCounts = {};
  completedTasks.forEach(task => {
    const month = getMonthName(task.updatedAt || task.completedAt || task.createdAt);
    monthlyCounts[month] = (monthlyCounts[month] || 0) + 1;
  });

  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyData = allMonths.map(month => ({
    month,
    completed: monthlyCounts[month] || 0,
  }));

  return (
    <div className="min-h-screen flex bg-gray-100 relative">
      {/* Sidebar Toggle */}
      <button
        className="absolute top-4 left-4 z-50 text-white bg-[#1c0c36] px-4 py-2 rounded flex items-center gap-2 shadow-md hover:bg-[#291444]"
        onClick={() => setSidebarOpen(!sidebarOpen)}>
        <Menu size={20} />
        <span className="hidden sm:inline">Open Menu</span>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full z-40 transition-transform duration-300 transform ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'} bg-[#1c0c36] text-white p-6 shadow-lg`}>
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-lg font-semibold">Jackson D.</h2>
            <p className="text-sm text-purple-400">Admin</p>
          </div>
          <button onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <nav className="space-y-6 mt-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <LayoutDashboard size={20} /> Dashboard
          </Link>
          <Link to="/admin/tasks" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <ListChecks size={20} /> Tasks
          </Link>
          <Link to="/admin/view-tasks" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <ClipboardCheck size={20} /> View Tasks
          </Link>
          <Link to="/admin/user" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <UserCog size={20} /> Users
          </Link>
        </nav>
      </aside>

      {/* Dashboard Content */}
      <main className="flex-1 p-8 bg-gradient-to-tr from-[#1f0836] via-[#2c0e58] to-[#3a0a6e] text-white min-h-screen">
        <h1 className="text-4xl font-bold text-center mb-10">Admin Dashboard</h1>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-[#6a0dad] bg-opacity-30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <Users size={38} className="text-purple-300" />
              <div>
                <h2 className="text-lg font-semibold text-purple-200">Total Employees</h2>
                <p className="text-3xl font-bold text-white">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#7e22ce] bg-opacity-30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <ClipboardCheck size={38} className="text-purple-300" />
              <div>
                <h2 className="text-lg font-semibold text-purple-200">Tasks Assigned</h2>
                <p className="text-3xl font-bold text-white">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#9333ea] bg-opacity-30 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4">
              <CheckCircle size={38} className="text-purple-300" />
              <div>
                <h2 className="text-lg font-semibold text-purple-200">Completed Tasks</h2>
                <p className="text-3xl font-bold text-white">{completedTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div className="bg-slate-800 bg-opacity-40 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Task Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-slate-800 bg-opacity-40 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Monthly Completed Tasks</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="month" stroke="#e5e7eb" />
                <YAxis stroke="#e5e7eb" />
                <Tooltip />
                <Bar dataKey="completed" fill="#10b981" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
