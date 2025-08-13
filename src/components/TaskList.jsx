import axios from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const TaskList = () => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const selectedUserId = location.state?.selectedUserId;


  const [highlightedUser, setHighlightedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const USERREF = localStorage.getItem("user_table");
  const token = localStorage.getItem('token');
const createdBy = localStorage.getItem('id')
const REFTASK = localStorage.getItem('taskId')
  useEffect(() => {
    const fetchData = async () => {
      try {
         const userRes = await axios.get(`/admin/allemploye/${USERREF}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(userRes.data)
        setUsers(userRes.data || []);
   
         const taskRes = await axios.get(`/admin/alltask/${createdBy}/${REFTASK}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(taskRes.data)
        const taskList = Array.isArray(taskRes.data)
          ? taskRes.data
          : taskRes.data.tasks || taskRes.data.data || [];

        setTasks(taskList);
      } catch (err) {
        console.error('❌ Failed to fetch:', err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedUserId) {
      setHighlightedUser(selectedUserId);

      setTimeout(() => {
        const el = document.getElementById(`user-${selectedUserId}`);
        if (el) {
          const offset = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offset, behavior: 'smooth' });
        }
      }, 500);

      const timeout = setTimeout(() => setHighlightedUser(null), 3000);
      return () => clearTimeout(timeout);
    }
  }, [selectedUserId]);

  const countTasks = (userId, status) =>
    tasks.filter(
      (task) =>
        task.user_id === userId &&
        task.status?.toLowerCase() === status.toLowerCase()
    ).length;

  const countTotalTasks = (userId) =>
    tasks.filter((task) => task.user_id === userId).length;

  const countCompletedTasks = (userId) =>
    tasks.filter(
      (task) =>
        task.user_id === userId &&
        task.status?.toLowerCase() === 'Complete'
    ).length;

  const filteredUsers =
    roleFilter === 'all'
      ? users
      : users.filter(
          (user) => user.role?.toLowerCase() === roleFilter
        );

  const totalManagers = users.filter(
    (u) => u.role?.toLowerCase() === 'manager'
  ).length;

  const totalEmployees = users.filter(
    (u) => u.role?.toLowerCase() === 'employee'
  ).length;

  
   return (
  <div className="bg-gray-50 min-h-screen px-4 py-6">
    {/* Title and Filters */}
    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
      <h2 className="text-3xl font-bold text-blue-800">Staff Task Summary</h2>
      <div className="flex gap-4">
        {[
          { label: 'All', value: 'all', count: users.length },
          { label: 'Managers', value: 'manager', count: totalManagers },
          { label: 'Employees', value: 'employee', count: totalEmployees }
        ].map(({ label, value, count }) => (
          <button
            key={value}
            onClick={() => setRoleFilter(value)}
            className={`text-sm md:text-base font-medium px-3 py-1 rounded transition border-b-2 ${
              roleFilter === value
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-400'
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>
    </div>

    {/* User Cards */}
    {filteredUsers.length === 0 ? (
      <p className="text-gray-600 text-center">No users found.</p>
    ) : (
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {filteredUsers.map((user) => {
          const total = countTotalTasks(user.id);
          const completed = countCompletedTasks(user.id);
          const pending = countTasks(user.id, 'Pending');
          const inprocess = countTasks(user.id, 'Inprocess');
          const progress = total === 0 ? 0 : Math.round((completed / total) * 100);
          const isHighlighted = highlightedUser === user.id;

          return (
           <div
  key={user.id}
  id={`user-${user.id}`}
  onClick={() => navigate(`/user/specific/${user.id}/${REFTASK}`)}
  className={`cursor-pointer bg-white p-5 rounded-xl shadow-sm border transition-all duration-300 ${
    isHighlighted
      ? 'ring-4 ring-blue-500 shadow-lg'
      : 'hover:shadow-md hover:ring-2 hover:ring-purple-200'
  }`}
>
              {/* Avatar & Name */}
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.user_name}`}
                  alt="avatar"
                  className="w-12 h-12 rounded-full border pointer-events-none"
                />
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{user.user_name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>

              {/* Task Status Counts */}
              <div className="flex justify-between text-sm font-semibold mb-4">
                <div className="text-yellow-600">
                  {pending}
                  <div className="text-xs font-normal text-gray-500">Pending</div>
                </div>
                <div className="text-blue-600">
                  {inprocess}
                  <div className="text-xs font-normal text-gray-500">In Progress</div>
                </div>
                <div className="text-green-600">
                  {completed}
                  <div className="text-xs font-normal text-gray-500">Completed</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <p className="text-sm text-gray-700 font-medium mb-1">
                  Progress: {completed} / {total}
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full">
                  <div
                    className="h-2 bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);

};

export default TaskList;
