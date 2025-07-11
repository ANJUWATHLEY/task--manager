import React, { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import { ClipboardCopy, Trash2, Pencil, Mail, MessageCircleMore } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupTaskList = () => {
  const [groupTasks, setGroupTasks] = useState([]);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/admin/alltask', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const tasks = Array.isArray(res.data) ? res.data : res.data.tasks || [];

      const formatted = tasks
        .map((item) => ({
          ...item,
          assign_date: item.assign_date?.split('T')[0] || '',
          deadline_date: item.deadline_date?.split('T')[0] || '',
        }))
        .filter((task) => Array.isArray(task.userids) && task.userids.length > 1); // ✅ Only group tasks

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
      await axios.delete(`/admin/taskdelete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      alert('✅ Deleted');
    } catch (error) {
      alert('❌ Failed to delete');
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
      <h2 className="text-2xl font-bold text-purple-700 mb-6">👥 Group Assigned Tasks</h2>

      {groupTasks.length === 0 ? (
        <p className="text-gray-500">No group tasks assigned yet.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {groupTasks.map((task) => (
            <li key={task.id} className="bg-white border rounded-xl shadow-md p-5">
              <h3 className="text-xl font-semibold text-purple-700">{task.title}</h3>
              <p className="text-gray-700 mt-1">{task.des}</p>

              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>Status: <span className="font-medium text-black">{task.status}</span></p>
                <p>Assign Date: {task.assign_date}</p>
                <p>Deadline: <span className="text-red-500">{task.deadline_date}</span></p>
                <p>Role: {task.role}</p>

                <p>Assigned User IDs:</p>
                <ul className="list-disc ml-6 text-blue-700">
                  {task.userids.map((id, index) => (
                    <li key={index}>User ID: {id}</li>
                  ))}
                </ul>
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
                  onClick={() => navigate(`/admin/viewtask/${task.id}`, { state: { task } })}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                >
                  View
                </button>

                <button
                  onClick={() => handleCopy(task.url)}
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

              {copied && <p className="text-green-500 text-xs mt-2">✅ Link Copied!</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default GroupTaskList;
