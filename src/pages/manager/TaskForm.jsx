import { useForm } from 'react-hook-form';
import axios from '../../api/axiosInstance';

const TaskForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitTask = async (data) => {
    try {
      const token = localStorage.getItem('token');

      const res = await axios.post('/manager/task', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Task Created:', res.data);
      alert('Task created successfully ✅');
      reset();
    } catch (error) {
      console.error('❌ Task Error:', error.response?.data || error.message);
      alert('Failed to create task');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <form
        onSubmit={handleSubmit(submitTask)}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-xl space-y-4"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Assign New Task
        </h2>

        {/* Title */}
        <input
          type="text"
          placeholder="Task Title"
          {...register('title', { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        {errors.title && (
          <p className="text-sm text-red-500">Title is required</p>
        )}

        {/* Description */}
        <textarea
          placeholder="Task Description"
          {...register('des')}
          rows="3"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        ></textarea>

        {/* Status */}
        <select
          {...register('status', { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Status</option>
          <option value="process">Process</option>
          <option value="in_process">In Process</option>
          <option value="complete">Complete</option>
        </select>
        {errors.status && (
          <p className="text-sm text-red-500">Status is required</p>
        )}

        {/* Assigned Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Assign Date
          </label>
          <input
            type="date"
            {...register('assinedate', { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Deadline Date */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">
            Deadline
          </label>
          <input
            type="date"
            {...register('deadlinedata', { required: true })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role */}
        <select
          {...register('role', { required: true })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign to Role</option>
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        {errors.role && (
          <p className="text-sm text-red-500">Role is required</p>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Create Task
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
