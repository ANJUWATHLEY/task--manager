import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

const CompletedTasks = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
 const user = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const res = await axiosInstance.get('/admin/employecomplete', {
          headers: { 
            Authorization: `Bearer ${token}`,
            user_id: user
          },
        });
console.log(res.data);
        const allTasks = Array.isArray(res.data)
          ? res.data
          : res.data.tasks || res.data.data || [];

        const filtered = allTasks.filter(
          task => task.status?.toLowerCase() === 'completed'
        );

        setCompletedTasks(filtered);
        setLoading(false);
      } catch (err) {
        console.error('❌ Failed to fetch completed tasks:', err);
        setLoading(false);
      }
    };

    fetchCompletedTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-purple-700">✅ Completed Tasks</h2>

      {completedTasks.length === 0 ? (
        <p className="text-center text-gray-500">No completed tasks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {completedTasks.map(task => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-xl shadow border hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-green-700 mb-1">{task.title}</h3>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>

              <p className="text-sm">
                <span className="font-medium">Assigned To:</span>{' '}
                {task.user_name || task.user?.user_name || 'N/A'}
              </p>

              <p className="text-sm">
                <span className="font-medium">Deadline:</span>{' '}
                <span className="text-red-600">{task.deadline_date}</span>
              </p>

              <p className="text-sm">
                <span className="font-medium">Completed On:</span>{' '}
                {task.updated_at
                  ? new Date(task.updated_at).toLocaleDateString()
                  : 'N/A'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompletedTasks;
