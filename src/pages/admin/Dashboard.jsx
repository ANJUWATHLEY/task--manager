import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  Users, ClipboardCheck, CheckCircle, LayoutDashboard, 
  ListChecks, UserCog, Menu, X, TrendingUp, Activity,
  Calendar, Target, ArrowUp, ArrowDown
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, CartesianGrid, XAxis, YAxis
} from 'recharts';

const AdminDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error('Fetch error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const completedTasks = tasks.filter(task => task.status?.toLowerCase() === 'completed');
  const pendingTasks = tasks.filter(task => task.status?.toLowerCase() === 'pending');
  const inProgressTasks = tasks.filter(task => task.status?.toLowerCase() === 'inprocess');
  const highPriorityTasks = tasks.filter(task => task.priority === 'high');

  const taskStatusData = [
    { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    { name: 'In Process', value: inProgressTasks.length, color: '#f59e0b' },
    { name: 'Pending', value: pendingTasks.length, color: '#3b82f6' },
  ];

  const monthlyCompletedData = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(0, i).toLocaleString('default', { month: 'short' });
    const completed = completedTasks.filter(task => {
      if (!task.updated_at) return false;
      const taskMonth = new Date(task.updated_at).getMonth();
      return taskMonth === i;
    }).length;
    const inProgress = inProgressTasks.filter(task => {
      if (!task.updated_at) return false;
      const taskMonth = new Date(task.updated_at).getMonth();
      return taskMonth === i;
    }).length;
    return { month, completed, inProgress };
  });

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, subtitle }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
            <Icon className={`h-6 w-6 ${color.replace('bg-', 'text-')}`} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center space-x-1 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div></div>;
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className={`transition-all duration-300 h-screen bg-white border-r border-gray-200 shadow-sm flex flex-col ${sidebarOpen ? 'w-64' : 'w-20'}`}>
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {sidebarOpen && <h2 className="text-lg font-semibold text-gray-800">Admin Panel</h2>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-gray-100 rounded-lg flex items-center justify-center">
            {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {[{ icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
            { icon: ListChecks, label: 'Tasks', path: '/admin/tasks' },
            { icon: ClipboardCheck, label: 'View Tasks', path: '/admin/view-tasks' },
            { icon: UserCog, label: 'Users', path: '/admin/user' }].map((item, i) => (
            <a key={i} href={item.path} className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
              <item.icon size={24} />
              {sidebarOpen && <span className="font-medium">{item.label}</span>}
            </a>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening today.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Employees" value={employees.length} icon={Users} color="bg-blue-500" trend="up" trendValue="12%" subtitle="Active team members" />
          <StatCard title="Tasks Assigned" value={tasks.length} icon={ClipboardCheck} color="bg-purple-500" trend="up" trendValue="8%" subtitle="This month" />
          <StatCard title="Completed Tasks" value={completedTasks.length} icon={CheckCircle} color="bg-green-500" trend="up" trendValue="15%" subtitle={`${Math.round((completedTasks.length / tasks.length) * 100)}% completion rate`} />
          <StatCard title="High Priority" value={highPriorityTasks.length} icon={Target} color="bg-red-500" trend="down" trendValue="3%" subtitle="Urgent tasks" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={taskStatusData} cx="50%" cy="50%" outerRadius={100} fill="#8884d8" dataKey="value" labelLine={false} label={({ name, value }) => (value > 0 ? `${name}: ${value}` : '')}>
                  {taskStatusData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Monthly Progress</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyCompletedData}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="colorInProgress" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Area type="monotone" dataKey="completed" stroke="#10b981" fill="url(#colorCompleted)" />
                <Area type="monotone" dataKey="inProgress" stroke="#f59e0b" fill="url(#colorInProgress)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
