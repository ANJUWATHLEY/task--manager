import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axiosInstance from '../../api/axiosInstance';

const InviteForm = () => {
  const { register, handleSubmit, reset, watch } = useForm();
  const [inviteLink, setInviteLink] = useState('');

  // Watch the taskname field to conditionally render task details
  const taskName = watch('taskname');

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post('/admin/invite', data);
      setInviteLink(response.data.inviteLink); // API returns generated link
      reset();
    } catch (error) {
      console.error('Error generating invite:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-2xl">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Send Invite Link
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              {...register('email', { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter email"
              required
            />
          </div>

          {/* Role */}
          <div>
            <label className="block mb-1 font-medium">Role</label>
            <select
              {...register('role', { required: true })}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Select role</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block mb-1 font-medium">Department</label>
            <input
              type="text"
              {...register('department')}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter department"
              required
            />
          </div>

          {/* Designation */}
          <div>
            <label className="block mb-1 font-medium">Designation</label>
            <input
              type="text"
              {...register('designation')}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter designation"
              required
            />
          </div>

          {/* Optional Task Field */}
          <div>
            <label className="block mb-1 font-medium">Task (Optional)</label>
            <input
              type="text"
              {...register('taskname')}
              className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter task name (optional)"
            />
          </div>

          {/* Conditionally Rendered Task Fields */}
          {taskName && (
            <>
              <div>
                <label className="block mb-1 font-medium">Task Title</label>
                <input
                  type="text"
                  {...register('title')}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Task title"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Task Description</label>
                <textarea
                  {...register('description')}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Task description"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Assign Date</label>
                <input
                  type="date"
                  {...register('assignDate')}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Priority</label>
                <select
                  {...register('priority')}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">Select priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div>
                <label className="block mb-1 font-medium">Deadline</label>
                <input
                  type="date"
                  {...register('deadline')}
                  className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded transition duration-300"
          >
             Generate Invite Link
          </button>
        </form>

        {/* Show Link After Submission */}
        {inviteLink && (
          <div className="mt-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded break-all">
            Invite Link Generated:
            <br />
            <a
              href={inviteLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              {inviteLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default InviteForm;
