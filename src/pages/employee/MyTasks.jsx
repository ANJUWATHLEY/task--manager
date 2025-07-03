import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { CheckCircle } from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(`/employe/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];

      const formatted = data.map((item) => ({
        ...item,
        assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || '',
      }));

      setTasks(formatted);
    } catch (error) {
      console.error('❌ Error fetching employee tasks:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleStatusUpdateInProcess = async (taskId) => {
    try {
      await axios.put(
        `/task/inprocess/${taskId}`,
        { status: 'inprocess' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMyTasks(); // Fixed typo here
    } catch (error) {
      console.error('❌ Error updating task:', error.response?.data || error.message);
      alert('Failed to update task status.');
    }
  };

  const handleStatusUpdateCompleted = async (taskId) => {
    try {
      await axios.put(
        `/task/inprocess/${taskId}`,
        { status: 'completed' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMyTasks(); // Fixed typo here
    } catch (error) {
      console.error('❌ Error updating task:', error.response?.data || error.message);
      alert('Failed to update task status.');
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold text-purple-700 mb-6"> My Assigned Tasks</h2>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div key={index} className="bg-white p-5 rounded-xl shadow border">
              <h3 className="text-xl font-semibold text-blue-700">{task.title}</h3>
              <p className="text-gray-700 mt-1">{task.des}</p>
              <div className="text-sm text-gray-500 mt-2">
                <p>Status: <span className="font-semibold">{task.status}</span></p>
                <p>Assign Date: {task.assign_date}</p>
                <p>Deadline: <span className="text-red-500 font-semibold">{task.deadline_date}</span></p>
              </div>

              <div className="flex gap-3 mt-4">
                  
  {task.status === 'pending' ? (
  <button
    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
    onClick={() => handleStatusUpdateInProcess(task.id)}
  >
    Accept
  </button>
) : task.status === 'inprocess' ? (
  <button className="bg-blue-400 text-white px-4 py-2 rounded-lg text-sm">
    In-Process
  </button>
) : null}



                <div>

                <button
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
                  onClick={() => handleStatusUpdateCompleted(task.id)}
                  disabled={task.status === 'completed'}
                  >
                  <CheckCircle size={16} /> Completed
                </button>
                  </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
