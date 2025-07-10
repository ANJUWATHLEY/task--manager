import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../api/axiosInstance.js';
import { ClipboardCopy, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const TaskForm = () => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState('all');
  const [assignedUserIds, setAssignedUserIds] = useState([]);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const hasFetchedOnce = useRef(false);

  const adminId = localStorage.getItem('id'); // ✅ Getting admin ID from localStorage

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/admin/allemploye');
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
      toast.error('❌ Please select at least one user.');
      return;
    }

    const payload = {
      ...data,
      userids: selectedUserIds,
      create_by: adminId,
    };

    console.log('📦 Payload being sent to backend:', JSON.stringify(payload, null, 2));

    try {
      await axiosInstance.post('/admin/createtask', payload);
      setAssignedUserIds((prev) => [...prev, ...selectedUserIds]);
      toast.success('✅ Task assigned successfully!');

      reset();
      setSelectedUserIds([]);
    } catch (error) {
      console.error('❌ Task assignment failed:', error.response?.data || error.message);
      toast.error('❌ Failed to assign task. Please try again.');
    }
  };

  const filteredUsers = users.filter((user) => {
    if (filterRole === 'all') return true;
    return user.role?.toLowerCase() === filterRole.toLowerCase();
  });

  const toggleUserSelection = (id) => {
    setSelectedUserIds((prev) =>
      prev.includes(id) ? prev.filter((uid) => uid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full">
      {/* Left: Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white w-full lg:w-1/2 p-6 rounded-xl shadow-md space-y-5 border border-gray-200"
      >
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
          {...register('priority', { required: true })}
          className="w-full border px-4 py-2 rounded-md"
        >
          <option value="">Select Priority</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {errors.priority && <p className="text-red-500 text-sm">Priority is required</p>}

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

        <p className="text-sm text-blue-600 flex items-center gap-1">
          👥 Select users from the right to assign task
        </p>

        {selectedUserIds.length > 0 && (
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded"
          >
            ✅ Confirm & Assign Task
          </button>
        )}
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
                className={`mt-4 flex items-center justify-center gap-2 text-sm w-full py-2 px-4 rounded ${
                  selectedUserIds.includes(user.id)
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
                onClick={() => toggleUserSelection(user.id)}
                type="button"
              >
                {selectedUserIds.includes(user.id) ? (
                  <>
                    <CheckCircle size={18} />
                    Selected
                  </>
                ) : (
                  <>
                    <ClipboardCopy size={18} />
                    Assign
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
