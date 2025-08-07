import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';

const UserTaskDetails = () => {
  const { id, taskId } = useParams(); // ✅ get user ID and REFTASK from route
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const create_by = localStorage.getItem('id');
  const REFTASK = taskId;

  const [user, setUser] = useState(null);
  const [userTasks, setUserTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ✅ Fetch user details
        const userRes = await axios.get(`/employe/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // ✅ Fetch all tasks for the org
        const taskRes = await axios.get(`/admin/alltask/${create_by}/${REFTASK}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let allTasks = [];
        if (Array.isArray(taskRes.data)) {
          allTasks = taskRes.data;
        } else if (Array.isArray(taskRes.data.tasks)) {
          allTasks = taskRes.data.tasks;
        } else if (Array.isArray(taskRes.data.data)) {
          allTasks = taskRes.data.data;
        }

        // ✅ DEBUG - See what key is used for employee assignment
        console.log("🔍 All Tasks Sample:", allTasks.slice(0, 3));

        // ✅ Filter only this user's tasks
        const filteredTasks = allTasks.filter(
          (task) =>
            Number(task.user_id) === Number(id) ||  // if user_id is used
            Number(task.assigned_to) === Number(id) ||  // if assigned_to is used
            Number(task.user?.id) === Number(id) // if nested user object is used
        );

        setUserTasks(filteredTasks);
      } catch (error) {
        console.error('❌ Error fetching user or tasks:', error);
      }
    };

    fetchData();
  }, [id, taskId]);

  return (
    <div className="p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 min-h-screen">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow"
      >
        ← Back
      </button>

      {userTasks.length === 0 ? (
        <p className="text-center text-gray-700 text-lg">
          No tasks assigned to this user.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {userTasks.map((task) => (
            <div
              key={task.id}
              className="transform transition-all duration-300 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-xl rounded-2xl border border-gray-200 bg-white p-6 shadow-md"
            >
              <h3 className="text-xl font-bold text-indigo-700 mb-2">
                {task.title}
              </h3>

              <p className="text-gray-800 mb-4">
                <span className="font-semibold">Description:</span> {task.description}
              </p>

              <div className="text-sm space-y-1 font-medium">
                <p>
                  <span className="text-gray-800">Status:</span>{' '}
                  <span
                    className={`rounded-full text-xs font-semibold ${
                      task.status === 'complete'
                        ? 'text-green-600'
                        : task.status === 'inprocess'
                        ? 'text-blue-600'
                        : 'text-blue-400'
                    }`}
                  >
                    {task.status}
                  </span>
                </p>

                <p>
                  <span className="text-gray-800">Assign Date:</span>{' '}
                  {task.assign_date?.split('T')[0] || 'N/A'}
                </p>

                <p>
                  <span className="text-gray-800">Deadline:</span>{' '}
                  {task.deadline_date?.split('T')[0] || 'N/A'}
                </p>

                <p>
                  <span className="text-gray-800">Priority:</span>{' '}
                  <span
                    className={`text-sm font-bold ${
                      task.priority === 'High'
                        ? 'text-red-600'
                        : task.priority === 'Medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}
                  >
                    {task.priority}
                  </span>
                </p>
              </div>

              {task.url && (
                <a
                  href={task.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-indigo-600 hover:text-indigo-800 text-sm underline transition-colors duration-200"
                >
                  🔗 Open Task Link
                </a>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserTaskDetails;
