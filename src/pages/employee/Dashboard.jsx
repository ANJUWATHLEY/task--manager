import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { CheckCircle, ClipboardCheck, Hourglass, XCircle } from 'lucide-react';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(`/employe/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      const formatted = data.map((item) => ({
        ...item,
        assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || '',
      }));

      setTasks(formatted);
    } catch (error) {
      console.error('Error fetching employee tasks:', error);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const totalTasks = tasks.length;
  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const inProcess = tasks.filter((t) => t.status === 'inprocess').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;

  return (
    <div className="min-h-screen bg-[#f0f4ff] px-10 py-8">
     
      {/* Cards with Hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition duration-200">
          <ClipboardCheck className="mx-auto text-blue-500" size={36} />
          <p className="text-2xl font-bold mt-2">{totalTasks}</p>
          <p className="text-sm text-gray-500">Total Tasks</p>
        </div>

        <div className="bg-green-50 rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition duration-200">
          <CheckCircle className="mx-auto text-green-600" size={36} />
          <p className="text-2xl font-bold mt-2">{completed}</p>
          <p className="text-sm text-gray-500">Completed</p>
        </div>

        <div className="bg-red-50 rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition duration-200">
          <XCircle className="mx-auto text-red-600" size={36} />
          <p className="text-2xl font-bold mt-2">{pending}</p>
          <p className="text-sm text-gray-500">Pending</p>
        </div>

        <div className="bg-yellow-50 rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition duration-200">
          <Hourglass className="mx-auto text-yellow-600" size={36} />
          <p className="text-2xl font-bold mt-2">{inProcess}</p>
          <p className="text-sm text-gray-500">In Progress</p>
        </div>
      </div>

      {/* Task Table */}
      <div className="p-6 rounded-xl shadow-md bg-blue-50">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          Your Recent Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-base">
              <thead className="bg-blue-100 text-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Assigned</th>
                  <th className="py-3 px-4 text-left">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task, i) => (
                  <tr
                    key={i}
                    className="border-b border-blue-200 hover:bg-blue-100 transition duration-200"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800">{task.title}</td>
                    <td
                      className={`py-3 px-4 font-medium capitalize ${
                        task.status === 'Completed'
                          ? 'text-green-600'
                          : task.status === 'pending'
                          ? 'text-red-600'
                          : 'text-yellow-600'
                      }`}
                    >
                      {task.status}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{task.assign_date}</td>
                    <td className="py-3 px-4 text-red-500">{task.deadline_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
