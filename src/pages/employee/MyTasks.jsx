import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';


const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');
 const navigate = useNavigate();
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
      fetchMyTasks();
    } catch (error) {
      console.error('❌ Error updating task:', error.response?.data || error.message);
      alert('Failed to update task status.');
    }
  };

  const handleStatusUpdateCompleted = async (taskId) => {
    try {
      await axios.put(
        `/task/complete/${taskId}`,
        { status: 'completed' },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchMyTasks();
    } catch (error) {
      console.error('❌ Error updating task:', error.response?.data || error.message);
      alert('Failed to update task status.');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-500';
      case 'low':
        return 'text-blue-500';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#f4f6fa] font-sans">

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow p-6 border border-gray-200 
                         transition-transform transform hover:scale-105 
                         hover:shadow-xl hover:bg-blue-50 cursor-pointer"
            >
              <h3 className="text-lg font-bold text-blue-700 mb-2">{task.title}</h3>
              <div className="text-sm text-gray-700 space-y-1">
                <p>Description: <span className="capitalize">{task.description}</span>    
  <button
    onClick={() => navigate(`/task/${task.id}`, { state: { task } })}
    className="text-blue-600 underline text-sm hover:text-blue-800 mt-3"
  >
    View Details
  </button>
</p>
                <p>Status: <span className="font-semibold capitalize">{task.status}</span></p>
                <p>Assign Date: {task.assign_date}</p>
                <p>Deadline: <span className="text-red-500">{task.deadline_date}</span></p>
                <p>
                  Priority:{' '}
                  <span className={`font-medium capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </span>
                </p>
              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                {task.status === 'pending' && (
                  <button
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm"
                    onClick={() => handleStatusUpdateInProcess(task.id)}
                  >
                    Accept
                  </button>
                )}

                {task.status === 'inprocess' && (
                  <button
                    className="bg-orange-500 text-white px-4 py-2 rounded-full text-sm cursor-default"
                    disabled
                  >
                    In-Process
                  </button>
                )}

                <button
                  className={`${
                    task.status === 'completed'
                      ? 'bg-green-300 cursor-not-allowed'
                      : 'bg-green-500 hover:bg-green-600'
                  } text-white px-4 py-2 rounded-full text-sm`}
                  onClick={() => handleStatusUpdateCompleted(task.id)}
                  disabled={task.status === 'completed'}
                >
                  Completed
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
