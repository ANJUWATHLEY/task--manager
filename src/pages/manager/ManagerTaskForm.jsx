

// src/components/ManagerTaskForm.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';

import axiosInstance from '../../api/axiosInstance'; // ✅ correct

import { ClipboardCopy, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const ManagerTaskForm = () => {
  const [users, setUsers] = useState([]);
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const hasFetchedOnce = useRef(false);

  const reftask = localStorage.getItem('taskTable');
  const managerId = localStorage.getItem('id');

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/manager/onlyemploye');
        setUsers(res.data);
        if (!hasFetchedOnce.current) {
          toast.success('✅ Users loaded successfully');
          hasFetchedOnce.current = true;
        }
      } catch (error) {
        console.error('❌ Failed to fetch users:', error);
        toast.error('❌ Failed to load users');
      }
    };

    fetchUsers();
  }, []);

  const onSubmit = async (data) => {
    if (selectedUserIds.length === 0) {
      toast.error('Please select at least one user.');
      return;
    }

    const payload = {
      ...data,
      userids: selectedUserIds,
      create_by: managerId,
      reftask: reftask,
    };

    try {
      await axiosInstance.post('/manager/createtask', payload);
      setAssignedUserIds((prev) => [...prev, ...selectedUserIds]);
      toast.success('✅ Task assigned successfully!');
      reset();
      setSelectedUserIds([]);
    } catch (error) {
      console.error('❌ Task assignment failed:', error.response?.data || error.message);
      toast.error('❌ Failed to assign task. Please try again.');
    }
  };

  const toggleUserSelection = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full lg:w-1/2 p-6 rounded-xl shadow-md space-y-5 border"
      >
        <h2 className="text-2xl font-bold text-center">Manager: Assign Task</h2>

        <input {...register('title', { required: true })} placeholder="Title" className="w-full border px-4 py-2 rounded-md" />
        <input {...register('description', { required: true })} placeholder="Description" className="w-full border px-4 py-2 rounded-md" />
        <input type="date" {...register('assine_date', { required: true })} className="w-full border px-4 py-2 rounded-md" />
        <input type="date" {...register('deadline_date', { required: true })} className="w-full border px-4 py-2 rounded-md" />
        <select {...register('priority', { required: true })} className="w-full border px-4 py-2 rounded-md">
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <button type="submit" className="bg-purple-600 text-white py-2 px-4 rounded w-full">
          Assign Task
        </button>
      </form>

      <div className="w-full lg:w-1/2 max-h-[600px] overflow-y-auto bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-2xl font-bold mb-4">Employees Under You</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {users.map((user) => (
            <div key={user.id} className="bg-white p-4 border rounded-lg shadow-sm">
              <h2 className="text-lg font-bold">{user.user_name}</h2>
              <p className="text-sm text-gray-600">Role: {user.role}</p>
              <button
                className={`mt-4 w-full py-2 rounded text-white ${
                  selectedUserIds.includes(user.id) ? 'bg-green-600' : 'bg-blue-600'
                }`}
                onClick={() => toggleUserSelection(user.id)}
                type="button"
              >
                {selectedUserIds.includes(user.id) ? '✅ Selected' : 'Assign'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};




export default ManagerTaskForm ;


