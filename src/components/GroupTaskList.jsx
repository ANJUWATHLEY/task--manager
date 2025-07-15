import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import {
  ClipboardCopy,
  Trash2,
  Pencil,
  Mail,
  MessageCircleMore,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupTaskList = () => {
  const [groupTasks, setGroupTasks] = useState([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/admin/grouptask', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = res.data.multipleAssignedTasks || [];

      const formatted = tasks
        .map((item) => ({
          ...item,
          assign_date: item.assign_date?.split('T')[0] || '',
          deadline_date: item.deadline_date?.split('T')[0] || '',
          assigned_users: item.assigned_users || [],
        }))
        .filter(
          (task) =>
            Array.isArray(task.assigned_users) &&
            task.assigned_users.length > 1
        );

      setGroupTasks(formatted);
    } catch (err) {
      console.error('❌ Error fetching group tasks:', err.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/admin/deletegrouptask/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      fetchTasks();
      alert('Deleted');
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard error:', err);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
      <h2 className="text-2xl font-bold text-purple-700 mb-6">
        Group Assigned Tasks
      </h2>

      {groupTasks.length === 0 ? (
        <p className="text-gray-500">No group tasks assigned yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupTasks.map((task) => (
            <li
              key={task.id}
              className="bg-white border rounded-xl shadow-md p-5"
            >
              <h3 className="text-xl font-semibold text-purple-700">
                {task.title}
              </h3>

              <p className="text-gray-700 mt-1">{task.description}</p>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  Status:{' '}
                  <span className="font-medium text-black">{task.status}</span>
                </p>
                <p>
                  Priority:{' '}
                  <span className="text-purple-700 font-semibold">
                    {task.priority}
                  </span>
                </p>
                <p>Assign Date: {task.assign_date}</p>
                <p>
                  Deadline:{' '}
                  <span className="text-red-500">{task.deadline_date}</span>
                </p>
                <p>Role: {task.role}</p>

                <p className="mt-2 font-semibold text-gray-700">
                  Assigned Users:
                </p>
             <div className="flex flex-wrap gap-2 mt-1 relative z-0">
  {task.assigned_users.map((user, index) => (
    <button
      key={index}
      onClick={() =>
        navigate('/admin/user', {
          state: { selectedUserId: user.id },
        })
      }
      title={`View ${user.name}'s tasks`}
      type="button"
      className="group relative z-10 flex items-center w-fit bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition"
    >
      <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
        <img
          src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.user_name || 'User'}`}
          alt="avatar"
          className="w-full h-full object-cover"
        />
      </div>
      <span className="text-blue-700 text-sm font-medium ml-2 whitespace-nowrap">
        {user.name || `User ID: ${user.id}`}
      </span>
    </button>
  ))}
</div>

              </div>

              <div className="flex gap-2 mt-4 flex-wrap">
                <button
                  onClick={() => navigate('/updatetask/' + task.id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Pencil size={16} /> Update
                </button>

                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>

                <button
                  onClick={() =>
                    navigate(`/admin/viewtask/${task.id}`, { state: { task } })
                  }
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  View
                </button>

                <button
                  onClick={() => handleCopy(task.url || '')}
                  className="bg-gray-200 hover:bg-gray-300 text-sm px-2 py-1 rounded flex items-center gap-1"
                >
                  <ClipboardCopy size={16} />
                  Copy Link
                </button>

                <a
                  href={`mailto:?subject=Check this group task&body=${task.url}`}
                  className="bg-blue-100 hover:bg-blue-200 px-2 py-1 rounded text-sm"
                >
                  <Mail size={16} />
                </a>

                <a
                  href={`https://wa.me/?text=Group%20Task:%20${task.url}`}
                  className="bg-green-100 hover:bg-green-200 px-2 py-1 rounded text-sm"
                >
                  <MessageCircleMore size={16} />
                </a>
              </div>

              {copied && (
                <p className="text-green-500 text-xs mt-2">✅ Link Copied!</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupTaskList;
