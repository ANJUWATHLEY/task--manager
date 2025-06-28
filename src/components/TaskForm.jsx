import { useForm } from 'react-hook-form';
import axios from '../api/axiosInstance';

const TaskForm = ({ onSubmit }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitTask = async (data) => {
   
    
      
      try {
      const res = await axios.post('/manager/task', data ,{ withCredentials: true });
      console.log('✅ Task Submitted:', res.data);

      onSubmit(data); // parent update
      reset(); // clear form
      alert('Task Created Successfully ');
    } catch (error) {
      console.error("❌ Task Error:", error.response?.data || error.message);
      alert("Task submission failed!");
    }
  };

  return (
  <div className=' '>

    <form
      onSubmit={handleSubmit(submitTask)}
      className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg space-y-4"
      >
      <h2 className="text-xl font-semibold text-gray-800">Create New Task</h2>

      {/* Title */}
      <input
        type="text"
        placeholder="Task Title"
        {...register('title', { required: true })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
         
      {errors.title && <p className="text-red-500 text-sm">Title is required</p>}

      {/* Description */}
      <textarea
        placeholder="Task Description"
        {...register('des')}
        rows="3"
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>

      {/* Status */}
      <select
        {...register('status')}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Status</option>
        <option value="process">Process</option>
        <option value="in_process">In Process</option>
        <option value="complete">Complete</option>
      </select>
      {errors.status && <p className="text-red-500 text-sm">Status is required</p>}

      {/* Assigned Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Assign Date</label>
        <input
          type="date"
          {...register('assinedate')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Deadline Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deadline Date</label>
        <input
          type="date"
          {...register('deadlinedata')}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Role to Assign */}
      <select
        {...register('role', { required: true })}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Assign To Role</option>
        <option value="manager">Manager</option>
        <option value="employee">Employee</option>
        <option value="admin">Admin</option>
      </select>
      {errors.role && <p className="text-red-500 text-sm">Please select a role</p>}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
      >
        Add Task
      </button>
         </form>
        </div>  
  );
};

export default TaskForm;
