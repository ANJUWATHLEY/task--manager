import { useForm } from 'react-hook-form';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from '../../api/axiosInstance';

const ManagerTaskList = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');

  const [highlightedUser, setHighlightedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [roleFilter, setRoleFilter] = useState('all');

  const selectedUserId = location.state?.selectedUserId;

  useEffect(() => {
    if (selectedUserId) {
      setHighlightedUser(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, taskRes] = await Promise.all([
          axios.get('/manager/onlyemploye', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('/manager/readalltask', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setUsers(userRes.data || []);
        const taskList = Array.isArray(taskRes.data)
          ? taskRes.data
          : taskRes.data.tasks || taskRes.data.data || [];

        setTasks(taskList);
      } catch (error) {
        console.error('❌ Error fetching data:', error);
      }
    };

    fetchData();
  }, [token]);

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
        task.status?.toLowerCase() === 'completed'
    ).length;

  const filteredUsers =
    roleFilter === 'all'
      ? users
      : users.filter((user) => user.role?.toLowerCase() === roleFilter);

  return (
    <div className="bg-green-50 min-h-screen w-full">
      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <h2 className="text-2xl font-bold p-4 text-green-700">Employees Under Manager</h2>
        <div className="flex gap-2 text-sm">
          <div className="flex gap-6 font-semibold text-base md:text-lg">
            <button
              onClick={() => setRoleFilter('all')}
              className={`pb-1 border-b-2 transition cursor-pointer ${
                roleFilter === 'all'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-600 hover:text-green-700 hover:border-green-400'
              }`}
            >
              All ({users.length})
            </button>
            <button
              onClick={() => setRoleFilter('employee')}
              className={`pb-1 border-b-2 transition cursor-pointer ${
                roleFilter === 'employee'
                  ? 'border-green-700 text-green-700'
                  : 'border-transparent text-gray-600 hover:text-green-700 hover:border-green-400'
              }`}
            >
              Employees ({users.filter((u) => u.role?.toLowerCase() === 'employee').length})
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
            const isHighlighted = highlightedUser === user.id;

            return (
              <div
                key={user.id}
                id={`user-${user.id}`}
                onClick={() =>
                  navigate(`/manager/user/${user.id}`, {
                    state: { selectedUserId: user.id },
                  })
                }
                className={`cursor-pointer bg-white p-4 rounded-xl shadow border transition duration-300 ${
                  isHighlighted
                    ? 'ring-4 ring-green-500 shadow-lg'
                    : 'hover:shadow-md hover:ring-2 hover:ring-green-200'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.user_name}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full border pointer-events-none"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-green-800">{user.user_name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>

                <div className="flex justify-between mt-3 text-sm font-semibold">
                  <div className="text-purple-600">
                    {countTasks(user.id, 'Pending')}
                    <span className="block text-xs font-normal">Pending</span>
                  </div>
                  <div className="text-blue-600">
                    {countTasks(user.id, 'Inprocess')}
                    <span className="block text-xs font-normal">In Progress</span>
                  </div>
                  <div className="text-green-600">
                    {countTasks(user.id, 'Completed')}
                    <span className="block text-xs font-normal">Completed</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-700 mb-1">
                    Tasks Done: {completed} / {total}
                  </p>
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

export default ManagerTaskList;
