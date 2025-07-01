import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance.js';

const TaskForm = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [assignedUserIds, setAssignedUserIds] = useState([]);

  const { register, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/admin/emplyee');
        setUsers(res.data);
      } catch (error) {
        console.error('❌ Failed to fetch users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleAssignTask = async (userId) => {
    const form = document.querySelector('form');
    const formData = new FormData(form);
    const taskData = Object.fromEntries(formData.entries());

    const payload = {
      title: taskData.title,
      description: taskData.description,
      status: taskData.status,
      assine_date: taskData.assine_date,
      deadline_date: taskData.deadline_date,
      role: taskData.role,
      userid: userId
    };

    if (
      !payload.title ||
      !payload.description ||
      !payload.assine_date ||
      !payload.deadline_date ||
      !payload.role
    ) {
      alert('Please fill in all fields before assigning.');
      return;
    }

    try {
      await axiosInstance.post('/admin/task', payload);
      setAssignedUserIds((prev) => [...prev, userId]);
      alert('✅ Task assigned successfully!');
      reset();
    } catch (error) {
      console.error('❌ Task assignment failed:', error);
      alert('Failed to assign task.');
    }
  };

  // Filter users based on selected role from form
  const filteredUsers = users.filter(
    (user) => filterRole === 'all' || user.role === filterRole
  );

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-10 bg-gray-100 min-h-screen">
      
      {/* Task Assignment Form */}
      <form className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg space-y-5 border">
        <h2 className="text-2xl font-bold text-center text-purple-700">📋 Assign Task</h2>

        <input
          {...register('title', { required: true })}
          placeholder="Enter Task Title"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.title && <p className="text-red-500 text-sm">Task title is required</p>}

        <input
          {...register('description', { required: true })}
          placeholder="Enter Task Description"
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.description && <p className="text-red-500 text-sm">Description is required</p>}

        <input
          type="date"
          {...register('assine_date', { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.assine_date && <p className="text-red-500 text-sm">Assign date is required</p>}

        <input
          type="date"
          {...register('deadline_date', { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        {errors.deadline_date && <p className="text-red-500 text-sm">Deadline is required</p>}

        <select
          {...register('role', { required: true })}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">Role is required</p>}

        <p className="text-center text-gray-600 text-sm">⬇️ Select user below to assign this task</p>
      </form>

      {/* Filtered Users */}
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Available Users</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="relative bg-black shadow-md rounded-2xl px-10 p-6 w-full hover:shadow-xl transition-all border border-gray-200"
            >
              {assignedUserIds.includes(user.id) && (
                <span className="absolute top-2 right-2 text-xs bg-red-800 text-white px-2 py-1 rounded-full">
                  Task Assigned
                </span>
              )}

              <h2 className="text-xl font-bold text-gray-800">{user.user_name}</h2>
              <p className="text-sm text-gray-500 mt-2">
                Role: <span className="font-semibold text-blue-600">{user.role}</span>
              </p>

              <button
                className="mt-3 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                onClick={() => handleAssignTask(user.id)}
              >
                Select
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
