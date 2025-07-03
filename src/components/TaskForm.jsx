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
        const res = await axiosInstance.get('/admin/allemploye');
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

    if (!payload.title || !payload.description || !payload.assine_date || !payload.deadline_date || !payload.role) {
      alert('Please fill in all fields before assigning.');
      return;
    }

    try {
      await axiosInstance.post('/admin/createtask', payload);
      setAssignedUserIds((prev) => [...prev, userId]);
      alert('✅ Task assigned successfully!');
      reset();
    } catch (error) {
      console.error('❌ Task assignment failed:', error);
      alert('Failed to assign task.');
    }
  };

  const filteredUsers = users.filter((user) => filterRole === 'all' || user.role === filterRole);

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left: Form */}
      <form className="bg-white w-full lg:w-1/2 p-6 rounded-xl shadow-md space-y-5 border border-gray-200">
        <h2 className="text-2xl font-bold text-center text-purple-700">Assign Task</h2>

        <input
          {...register('title', { required: true })}
          placeholder="Enter Task Title"
          className="w-full border px-4 py-2 rounded-md"
        />
        {errors.title && <p className="text-red-500 text-sm">Task title is required</p>}

        <input
          {...register('description', { required: true })}
          placeholder="Enter Task Description"
          className="w-full border px-4 py-2 rounded-md"
        />
        {errors.description && <p className="text-red-500 text-sm">Description is required</p>}

        <input
          type="date"
          {...register('assine_date', { required: true })}
          className="w-full border px-4 py-2 rounded-md"
        />
        {errors.assine_date && <p className="text-red-500 text-sm">Assign date is required</p>}

        <input
          type="date"
          {...register('deadline_date', { required: true })}
          className="w-full border px-4 py-2 rounded-md"
        />
        {errors.deadline_date && <p className="text-red-500 text-sm">Deadline is required</p>}

        <select
          {...register('role', { required: true })}
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="all">All</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">Role is required</p>}

        <p className="text-center text-gray-600 text-sm">⬇️ Select a user to assign this task</p>
      </form>

      {/* Right: Scrollable User Cards */}
      <div className="w-full lg:w-1/2 max-h-[600px] overflow-y-auto bg-white p-6 rounded-xl shadow-md border border-gray-200">
        <h2 className="text-2xl font-bold mb-4 text-purple-700">Available Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="relative bg-white p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              {assignedUserIds.includes(user.id) && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow">
                  ✅ Assigned
                </div>
              )}

              <h2 className="text-lg font-bold text-purple-700">{user.user_name}</h2>
              <p className="text-sm text-gray-600 mt-2">
                Role: <span className="text-blue-600 font-semibold">{user.role}</span>
              </p>

              <button
                className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full text-sm"
                onClick={() => handleAssignTask(user.id)}
              >
                Assign Task
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
