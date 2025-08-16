import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const userid = localStorage.getItem('id');
  const Member_org = localStorage.getItem('Member_org');
  const navigate = useNavigate();

  let REFTASK = '';
  const match = Member_org?.match(/^([a-zA-Z]+)(\d+)$/);
  if (match) {
    const [, , number] = match;
    REFTASK = 'TASK' + number;
  }

  const fetchMyTasks = async () => {
    try {
      const res = await axios.get(`/employe/${userid}/${REFTASK}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      const formatted = data.map((item) => ({
        ...item,
        assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || '',
        status: item.status?.toLowerCase(),
      }));

      setTasks(formatted);
    } catch (error) {
      console.error('❌ Error fetching employee tasks:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  const handleStatusUpdate = async (taskId, status) => {
    try {
      await axios.put(
        `/employe/${status}/${taskId}`,
        { REFTASK, userid, status },
        { headers: { Authorization: `Bearer ${token}` } }
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
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 font-sans">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">No tasks assigned to you yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow p-5 border border-gray-200 hover:shadow-md transition"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
              <p className="text-gray-700 text-sm mb-2">
                {task.description ? task.description : 'No description'}
                <button
                  onClick={() => navigate(`/task/${task.id}`, { state: { task } })}
                  className="text-blue-600 underline ml-2"
                >
                  View Details
                </button>
              </p>

              <div className="text-sm text-gray-700 space-y-1">
                <p>Status: <span className="font-medium capitalize">{task.status}</span></p>
                <p>Assign Date: {task.assign_date}</p>
                <p>Deadline: <span className="text-red-500">{task.deadline_date}</span></p>
                <p>
                  Priority:{' '}
                  <span className={`font-medium capitalize ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'None'}
                  </span>
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {task.status === 'pending' && (
                  <button
                    className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-full text-sm"
                    onClick={() => handleStatusUpdate(task.id, 'inprocess')}
                  >
                    Accept
                  </button>
                )}

                {task.status === 'inprocess' && (
                  <button
                    className="bg-gray-400 text-white px-4 py-2 rounded-full text-sm cursor-default"
                    disabled
                  >
                    In-Process
                  </button>
                )}

                <button
                  className={`${
                    task.status === 'complete'
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  } text-white px-4 py-2 rounded-full text-sm`}
                  onClick={() => handleStatusUpdate(task.id, 'complete')}
                  disabled={task.status === 'complete'}
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
