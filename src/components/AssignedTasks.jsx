import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const Navigate = useNavigate();

  // ✅ Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get('admin/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // ✅ Ensure data is always an array
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];

      const Formattasks = data.map((item) => ({
        ...item,
        assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || ''
      }));

      setTasks(Formattasks);

    } catch (err) {
      console.error('❌ Task Fetch Error:', err.response?.data || err.message);
    }
  };

  // ✅ Delete task
  async function taskdelete(id) {
    try {
      await axios.delete(`/admin/deletetask/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchTasks();
    } catch (error) {
      console.error('❌ Delete Error:', error.response?.data || error.message);
    }
  }

  // ✅ Update status
  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const res = await axios.put(`/task/inprocess/${taskId}`, {
        status: newStatus,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('✅ Status updated:', res.data);
      alert(`Task marked as "${newStatus}"`);
      fetchTasks();
    } catch (error) {
      console.error('❌ Error updating task:', error.response?.data || error.message);
      alert('Failed to update task status.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* 🔹 Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Assigned Tasks</h2>

        {(role === 'admin' || role === 'manager') && (
          <button
            onClick={() => Navigate('/admin/tasks')}
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
        <ul className="space-y-2 flex flex-wrap items-center justify-between m-5">
          {tasks.map((task, index) => (
            <li key={index} className="w-[25rem] h-[12rem] ml-5 bg-white p-3 rounded-lg shadow-sm border text-sm">
              <h3 className="text-xl font-semibold text-blue-700">{task.title}</h3>
              <p className="text-xl text-gray-700">{task.des}</p>
              <div className="text-gray-500">
                <p>Status: <span className="font-medium">{task.status}</span></p>
                <p className="text-xl font-semibold">Deadline: {task.deadline_date}</p>
                <p>Assign Date: {task.assign_date}</p>
                <p>Role: {task.role}</p>
              </div>

              {/* 🔘 Buttons */}
              {role === 'manager' || role === 'admin' ? (
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded text-xs"
                    onClick={() => Navigate('/updatetask/' + task.id)}
                  >
                    update
                  </button>

                  <button
                    className="bg-red-500 hover:bg-black text-white px-3 py-1 rounded text-xs"
                    onClick={() => taskdelete(task.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <button
                    className="bg-sky-500 hover:bg-sky-700 text-white px-5 py-2 rounded text-xs"
                    onClick={() => handleStatusUpdate(task.id, 'In Process')}
                  >
                    In-Process
                  </button>

                  <button
                    className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                    onClick={() => handleStatusUpdate(task.id, 'Completed')}
                  >
                    Completed
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignedTasks;
