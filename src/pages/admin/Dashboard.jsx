import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  Users, ClipboardCheck, CheckCircle, LayoutDashboard,
  ListChecks, UserCog, Menu, X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true); // Sidebar initially open
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
  const inProgressTasks = tasks.filter((task) => task.status?.toLowerCase() === 'inprocess');

  const taskStatusData = [
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    { name: 'In Process', value: inProgressTasks.length, color: '#f97316' },
    { name: 'Pending', value: pendingTasks.length, color: '#6366f1' },
  ];

  const monthlyCompletedData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'short' });
    const count = completedTasks.filter(task => {
      if (!task.updated_at) return false;
      const taskMonth = new Date(task.updated_at).getMonth();
      return taskMonth === i;
    }).length;
    return { month, completed: count };
  });

  return (
    <div className="min-h-screen flex bg-white relative">

      {/* Sidebar */}
      <aside
        className={`transition-all duration-300 h-screen bg-[#1c0c36] text-white p-4 shadow-lg flex flex-col ${sidebarOpen ? 'w-64' : 'w-16'}`}
      >
        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mb-6 text-white hover:bg-[#291444]  rounded self-start"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Sidebar Links */}
        <nav className="space-y-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <LayoutDashboard size={20} />
            {sidebarOpen && <span>Dashboard</span>}
          </Link>
          <Link to="/admin/tasks" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <ListChecks size={20} />
            {sidebarOpen && <span>Tasks</span>}
          </Link>
          <Link to="/admin/view-tasks" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <ClipboardCheck size={20} />
            {sidebarOpen && <span>View Tasks</span>}
          </Link>
          <Link to="/admin/user" className="flex items-center gap-3 text-purple-300 hover:text-white text-lg">
            <UserCog size={20} />
            {sidebarOpen && <span>Users</span>}
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gradient-to-tr from-[#1f0836] via-[#2c0e58] to-[#3a0a6e] text-white min-h-screen transition-all duration-300">
        <h1 className="text-4xl font-bold text-center mb-10 tracking-wider">Admin Dashboard</h1>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-purple-700 p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <Users size={38} className="text-white" />
              <div>
                <p className="text-lg font-medium">Total Employees</p>
                <p className="text-3xl font-bold">{employees.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-600 p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <ClipboardCheck size={38} className="text-white" />
              <div>
                <p className="text-lg font-medium">Tasks Assigned</p>
                <p className="text-3xl font-bold">{tasks.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-500 p-6 rounded-xl shadow-md">
            <div className="flex items-center gap-4">
              <CheckCircle size={38} className="text-white" />
              <div>
                <p className="text-lg font-medium">Completed Tasks</p>
                <p className="text-3xl font-bold">{completedTasks.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Task Status Pie */}
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, value }) => (value > 0 ? `${name}: ${value}` : '')}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Completed Tasks Line Chart */}
          <div className="bg-[#1e293b] p-6 rounded-xl shadow-md">
            <h3 className="text-xl font-semibold text-white mb-4">Monthly Completed Tasks</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyCompletedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis allowDecimals={false} stroke="#cbd5e1" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1f2937',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: '#10b981', r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
