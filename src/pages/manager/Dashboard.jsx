import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import {
  Users, ClipboardCheck, CheckCircle, Target,
  ArrowUp, ArrowDown
} from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, CartesianGrid, XAxis, YAxis
} from 'recharts';

const ManagerDashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const id = localStorage.getItem('id');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const employeeRes = await axios.get('/manager/allemploye', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const employeesData = Array.isArray(employeeRes.data)
          ? employeeRes.data
          : employeeRes.data.employees || [];

        const taskRes = await axios.get('/manager/alltask', {
          headers: { Authorization: `Bearer ${token}` },
        });

        const managerDetail = await axios.get(`/manager/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log('Manager detail:', managerDetail.data);

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

  const highPriorityTasks = tasks.filter(task => task.priority?.toLowerCase() === 'high');
  const mediumPriorityTasks = tasks.filter(task => task.priority?.toLowerCase() === 'medium');
  const lowPriorityTasks = tasks.filter(task => task.priority?.toLowerCase() === 'low');

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

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color, bgColor, subtitle }) => (
    <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${bgColor}`}>
            <Icon className={`h-6 w-6 ${color}`} />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">{title}</p>
            <p className="text-2xl font-semibold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend === 'up' ? 'text-green-600' : 'text-red-500'}`}>
            {trend === 'up' ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span className="text-sm font-medium">{trendValue}</span>
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin h-12 w-12 border-b-2 border-indigo-600 rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={employees.length}
            icon={Users}
            color="text-blue-600"
            bgColor="bg-blue-100"
            trend="up"
            trendValue="12%"
            subtitle="Active team members"
          />
          <StatCard
            title="Tasks Assigned"
            value={tasks.length}
            icon={ClipboardCheck}
            color="text-purple-600"
            bgColor="bg-purple-100"
            trend="up"
            trendValue="8%"
            subtitle="This month"
          />
          <StatCard
            title="Completed Tasks"
            value={completedTasks.length}
            icon={CheckCircle}
            color="text-green-600"
            bgColor="bg-green-100"
            trend="up"
            trendValue="15%"
            subtitle={`${Math.round((completedTasks.length / tasks.length) * 100)}% completion rate`}
          />
          <StatCard
            title="Priority Summary"
            value=""
            icon={Target}
            color="text-red-600"
            bgColor="bg-red-100"
            subtitle={
              <div className="space-y-1">
                <p className="text-sm"><span className="text-red-600 font-semibold">High</span>: {highPriorityTasks.length}</p>
                <p className="text-sm"><span className="text-yellow-500 font-semibold">Medium</span>: {mediumPriorityTasks.length}</p>
                <p className="text-sm"><span className="text-green-600 font-semibold">Low</span>: {lowPriorityTasks.length}</p>
              </div>
            }
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
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

export default ManagerDashboard;
