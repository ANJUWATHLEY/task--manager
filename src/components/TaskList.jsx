// src/components/TaskList.jsx
import axios from '../api/axiosInstance';
import React, { useEffect, useState } from 'react';

const TaskList = () => {
  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Fetch all users
        const userRes = await axios.get('/admin/allemploye', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const allUsers = userRes.data || [];
        setUsers(allUsers);

        // 2. Fetch all tasks
        const taskRes = await axios.get('/admin/alltask', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const tasks = Array.isArray(taskRes.data)
          ? taskRes.data
          : Array.isArray(taskRes.data.tasks)
            ? taskRes.data.tasks
            : Array.isArray(taskRes.data.data)
              ? taskRes.data.data
              : [];

        // 3. Collect assigned user IDs
        const assignedIds = tasks.map(task => task.user_id);
        setAssignedUserIds(assignedIds);
      } catch (err) {
        console.error('❌ Failed to fetch users or tasks:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">👥 Users & Task Status</h2>

      {users.length === 0 ? (
        <p className="text-gray-600">No users found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {users.map(user => {
            const isAssigned = assignedUserIds.includes(user.id);
            return (
              <div key={user.id} className="bg-white p-4 rounded-xl shadow border">
                <h3 className="text-lg font-bold text-purple-800">{user.user_name}</h3>
                <p className="text-sm text-gray-500">
                  Role: <span className="text-blue-600">{user.role}</span>
                </p>
                <p className={`font-medium mt-1 ${isAssigned ? 'text-green-600' : 'text-red-500'}`}>
                  {isAssigned ? ' Task Assigned' : ' No Task Assigned'}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskList;
