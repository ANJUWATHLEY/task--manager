import axios from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';

const TaskList = () => {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await axios.get('/admin/allemploye', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(userRes.data || []);

        const taskRes = await axios.get('/admin/alltask', {
          headers: { Authorization: `Bearer ${token}` },
        });

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

  const countTasks = (userId, status) => {
    return tasks.filter(
      (task) =>
        task.user_id === userId && task.status?.toLowerCase() === status.toLowerCase()
    ).length;
  };

  const countTotalTasks = (userId) => {
    return tasks.filter((task) => task.user_id === userId).length;
  };

  const countCompletedTasks = (userId) => {
    return tasks.filter(
      (task) => task.user_id === userId && task.status?.toLowerCase() === 'completed'
    ).length;
  };

  const filteredUsers = roleFilter === 'all'
    ? users
    : users.filter((user) => user.role?.toLowerCase() === roleFilter);

  const totalManagers = users.filter((u) => u.role?.toLowerCase() === 'manager').length;
  const totalEmployees = users.filter((u) => u.role?.toLowerCase() === 'employee').length;

  return (
 <div className="bg-gray-100 min-h-screen w-full">

      {/* Title and Role Filters */}
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h2 className="text-2xl font-bold p-4 text-blue-700">Staff List</h2>
        <div className="flex gap-2 text-sm">
          <div className="flex gap-6 font-semibold text-base md:text-lg">
  <button
    onClick={() => setRoleFilter('all')}
    className={`pb-1 border-b-2 transition cursor-pointer ${
      roleFilter === 'all'
        ? 'border-blue-700 text-blue-700'
        : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-400'
    }`}
  >
    All ({users.length})
  </button>

  <button
    onClick={() => setRoleFilter('manager')}
    className={`pb-1 border-b-2 transition cursor-pointer ${
      roleFilter === 'manager'
        ? 'border-blue-700 text-blue-700'
        : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-400'
    }`}
  >
    Managers ({totalManagers})
  </button>

  <button
    onClick={() => setRoleFilter('employee')}
    className={`pb-1 border-b-2 transition cursor-pointer ${
      roleFilter === 'employee'
        ? 'border-blue-700 text-blue-700'
        : 'border-transparent text-gray-600 hover:text-blue-700 hover:border-blue-400'
    }`}
  >
    Employees ({totalEmployees})
  </button>
</div>

        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredUsers.map((user) => {
            const total = countTotalTasks(user.id);
            const completed = countCompletedTasks(user.id);
            const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

            return (
              <div
                key={user.id}
                className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.user_name}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-purple-800">{user.user_name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    
                  </div>
                </div>

                {/* Task status counts */}
                <div className="flex justify-between mt-3 text-sm font-semibold">
                  <div className="text-purple-600">
                    {countTasks(user.id, 'Pending')} <span className="block text-xs font-normal">Pending</span>
                  </div>
                  <div className="text-blue-600">
                    {countTasks(user.id, 'Inprocess')} <span className="block text-xs font-normal">In Progress</span>
                  </div>
                  <div className="text-green-600">
                    {countTasks(user.id, 'Completed')} <span className="block text-xs font-normal">Completed</span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs font-medium text-gray-600 mb-1">
                    <p className="text-sm font-semibold text-gray-700 mt-1">
                     tasks Done: {completed} / {total} 
                    </p>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
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