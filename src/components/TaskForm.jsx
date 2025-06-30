import { useForm } from 'react-hook-form';
import axios from '../api/axiosInstance';
import User from '../pages/admin/User';

const TaskForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitTask = async (data) => {
    try {
      const res = await axios.post('/admin/task', data, { withCredentials: true });
      console.log('✅ Task Submitted:', res.data);
      onSubmit(data);
      reset();
      alert('Task Created Successfully!');
    } catch (error) {
      console.error("❌ Task Error:", error.response?.data || error.message);
      alert("Task submission failed!");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 px-6 py-10 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit(submitTask)}
        className="bg-white w-full max-w-xl p-8 rounded-2xl shadow-lg space-y-5 border"
      >
        <h2 className="text-2xl font-bold text-center text-purple-700">📋 Assign Task</h2>

        {/* Title Selector */}
        <select
          {...register('title', { required: true })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Task Title</option>
          <option value="UI Update">UI Update</option>
          <option value="Database Design">Database Design</option>
          <option value="React Integration">React Integration</option>
          <option value="Testing & QA">Testing & QA</option>
        </select>
        {errors.title && <p className="text-red-500 text-sm">Task title is required</p>}

        {/* Description Selector */}
        <select
          {...register('des')}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Description</option>
          <option value="Work on UI cleanup and responsiveness">UI cleanup</option>
          <option value="Design schema for new module">Database Schema</option>
          <option value="Integrate backend with React app">Backend + React</option>
          <option value="Run full test cases before release">Testing</option>
        </select>

        {/* Status Selector */}
        <select
          {...register('status', { required: true })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Status</option>
          <option value="process">Process</option>
          <option value="in_process">In Process</option>
          <option value="complete">Complete</option>
        </select>
        {errors.status && <p className="text-red-500 text-sm">Status is required</p>}

        {/* Assign Date */}
        <input
          type="date"
          {...register('assinedate', { required: true })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.assinedate && <p className="text-red-500 text-sm">Assign date is required</p>}

        {/* Deadline Date */}
        <input
          type="date"
          {...register('deadlinedata', { required: true })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.deadlinedata && <p className="text-red-500 text-sm">Deadline is required</p>}

        {/* Role Selector */}
        <select
          {...register('role', { required: true })}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Assign To Role</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
        {errors.role && <p className="text-red-500 text-sm">Role is required</p>}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md"
        >
          ✅ Assign Task
        </button>
      </form>

      {/* Optional User Info Display */}
      <div className="w-full max-w-md mt-10 lg:mt-0">
        <User />
      </div>
    </div>
  );
};

export default TaskForm;
