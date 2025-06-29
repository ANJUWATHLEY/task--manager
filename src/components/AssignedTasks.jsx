import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import axios from '../api/axiosInstance';

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role'); // ✅ Get role
  const navigate = useNavigate(); // ✅ for redirect

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('manager/tasks', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('📋 Fetched Tasks:', res.data);
        setTasks(res.data || []); // adjust based on response shape
      } catch (err) {
        console.error('❌ Task Fetch Error:', err.response?.data || err.message);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* 🔹 Header with Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Assigned Tasks</h2>

        {(role === 'admin' || role === 'manager') && (
          <button
            onClick={() => navigate('/Tasks')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            + Add New Task
          </button>
        )}
      </div>

      {/* 🔹 Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-4">
          {tasks.map((task, index) => (
            <li key={index} className="bg-white p-4 rounded-xl shadow border">
              <h3 className="text-lg font-semibold text-blue-700">{task.title}</h3>
              <p className="text-gray-700">{task.des}</p> {/* ✅ use task.des not task.description */}
              <p className="text-sm text-gray-500">Status: {task.status}</p>
              <p className="text-sm text-gray-500">Deadline: {task.deadlinedata}</p>
              <p className="text-sm text-gray-500">Assign Date: {task.assinedate}</p>
              <p className="text-sm text-gray-500">Assigned To Role: {task.role}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignedTasks;
