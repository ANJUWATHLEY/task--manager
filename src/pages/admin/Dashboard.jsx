import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import CreateTasksPage from './CreateTasksPage';

import {
  Users, ClipboardCheck, CheckCircle, LayoutDashboard,
  ListChecks, UserCog, Menu, X, Target, ArrowUp, ArrowDown, LogOut 
} from 'lucide-react';

import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip,
  AreaChart, Area, CartesianGrid, XAxis, YAxis
} from 'recharts';

const AdminDashboard = () => {
  const [emplength, setEmpLength] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [createtask , setCreateTask] = useState(false);
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');
  const role = localStorage.getItem('role');
  const orgid = localStorage.getItem('orgRef');
  const [userRef, setUserRef] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`/organization/getUser/${orgid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      
      const userTable = response.data?.data?.[0]?.user_table;
      if (userTable) {
        localStorage.setItem('user_table', userTable);
        setUserRef(userTable);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchData = async (USERREF) => {
    try {
      // Employees API
      const res = await axios.get(`/admin/allemploye/${USERREF}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const employeesData = Array.isArray(res.data) ? res.data : res.data.employees || [];
      setEmpLength(employeesData.length);

      // Tasks API
      const create_by = localStorage.getItem('id');
      const REFTASK = localStorage.getItem('taskId');

      const taskRes = await axios.get(`/admin/alltask/${create_by}/${REFTASK}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasksData = Array.isArray(taskRes.data) ? taskRes.data : taskRes.data.tasks || [];
      setTasks(tasksData);

      setLoading(false);
    } catch (error) {
      console.error('Fetch error:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      await fetchUsers(); // fetch user_table and store
    };
    init();
  }, []);

  useEffect(() => {
    const USERREF = localStorage.getItem('user_table');
    if (USERREF) {
      fetchData(USERREF);
    }
  }, [localStorage.getItem('user_table')]);

  // Task Filters
  const completedTasks = tasks.filter(task => task.status?.toLowerCase() === 'complete');
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
        {/* Stat Cards */}
       <button
  onClick={() => setCreateTask(true)}
  className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
>
  Create Task
</button>

{createtask && (
  <div className="fixed inset-0 flex items-start justify-center z-50 pointer-events-none">
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-xl mt-10 relative max-h-[90vh] overflow-y-auto pointer-events-auto">
      <CreateTasksPage onClose={() => setCreateTask(false)} />
    </div>
  </div>
)}
<div className="flex justify-end -mt-12">
  <button
    onClick={() => {
      navigator.clipboard.writeText(orgid);
      alert('Invite code copied to clipboard!');
    }}
    className="mb-8 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
  >
    Invite Code
  </button>
</div>



        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Employees"
            value={emplength}
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

export default AdminDashboard;
