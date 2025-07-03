import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import { Pencil, Trash2, CheckCircle ,  ClipboardCopy,Mail,MessageCircleMore} from 'lucide-react';
import {CopyToClipboard} from 'react-copy-to-clipboard'

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const Navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/admin/alltask', {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      
      
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      const Formattasks = data.map((item) => ({
        ...item,
        assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || '',
      }));

      setTasks(Formattasks);
    } catch (err) {
      console.error('❌ Task Fetch Error:', err.response?.data || err.message);
    }
  };

  async function taskdelete(id) {
    try {
      await axios.delete(`/admin/taskdelete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      alert('✅ Delete Successfully');
    } catch (error) {
      console.error('❌ Delete Error:', error.response?.data || error.message);
      alert('❌ Failed to delete');
    }
  }

  const handleStatusUpdateInProcess = async (taskId) => {
    try {
      await axios.put(`/task/inprocess/${taskId}`, { status: 'inprocess' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
    } catch (error) {
      console.error('❌ Error updating task:', error.response?.data || error.message);
      alert('Failed to update task status.');
    }
  };

  const handleStatusUpdateCompleted = async (taskId) => {
    try {
      await axios.put(`/task/inprocess/${taskId}`, { status: 'completed' }, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-purple-700">Assigned Tasks</h2>

        {(role === 'admin' || role === 'manager') && (
          <button
            onClick={() => Navigate('/admin/tasks')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md transition"
          >
            + Add New Task
          </button>
        )}
      </div>

      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned yet.</p>
      ) : (
<ul className="space-y-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {tasks.map((task, index) => (
    <li
      key={index}
      className="bg-white border border-gray-200 rounded-xl shadow-md p-5 transition hover:shadow-xl"
    >
      <h3 className="text-xl font-semibold text-purple-700">{task.title}</h3>
     <div className="flex justify-end mt-2">
  <div className="relative group">
    <button className="text-gray-500 hover:text-gray-800 text-xl">🔗</button>

    {/* Hover Popup Appears Above */}
    <div className="absolute bottom-full right-0 mb-3 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
      <p className="text-sm text-gray-700 mb-3 break-words">
        {task.url}
      </p>

      <div className="flex justify-center items-center gap-3">
        <CopyToClipboard
          text={task.url}
          onCopy={() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          }}
        >
          <button
            title="Copy"
            className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 p-2 rounded text-gray-800"
          >
            <ClipboardCopy size={16} />
          </button>
        </CopyToClipboard>

        <a
          href={`mailto:?subject=Check this task&body=Here is the link: http://localhost:3000`}
          target="_blank"
          rel="noopener noreferrer"
          title="Email"
          className="flex items-center justify-center bg-blue-100 hover:bg-blue-200 p-2 rounded text-blue-700"
        >
          <Mail size={16} />
        </a>

        <a
          href={`https://wa.me/?text=Check%20this%20task:%20http://localhost:3000`}
          target="_blank"
          rel="noopener noreferrer"
          title="WhatsApp"
          className="flex items-center justify-center bg-green-100 hover:bg-green-200 p-2 rounded text-green-700"
        >
          <MessageCircleMore size={16} />
        </a>
      </div>

      {copied && (
        <p className="text-green-500 text-xs mt-2">✅ Link Copied!</p>
      )}
    </div>
  </div>
</div>



      <p className="text-gray-700 mt-1">{task.des}</p>
      <div className="mt-3 text-sm text-gray-600 space-y-1">
        <p>Status: <span className="font-medium text-black">{task.status}</span></p>
        <p>Assign Date: {task.assign_date}</p>
        <p>Deadline: <span className="text-red-500 font-medium">{task.deadline_date}</span></p>
        <p>Role: {task.role}</p>
        <p>Assigned To: <span className={`font-semibold ${task.user_name ? 'text-green-600' : 'text-red-500'}`}>
          {task.user_name || task.user?.user_name || '❌ Not Assigned'}
        </span></p>
      </div>
      {role === 'manager' || role === 'admin' ? (
        <div className="flex gap-3 mt-4">
          <button
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
            onClick={() => Navigate('/updatetask/' + task.id)}
          >
            <Pencil size={16} /> Update
          </button>
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
            onClick={() => taskdelete(task.id)}>
            <Trash2 size={16} /> Delete
          </button>

      <button
className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
  onClick={() =>
    Navigate(`/admin/viewtask/${task.id}`, { state: { task } })
  }
>
  View
</button>


        </div>
      ) : (
        <div className="flex gap-3 mt-4">
          {task.status === 'pending' ? (
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm"
              onClick={() => handleStatusUpdateInProcess(task.id)}
            >
              Accept
            </button>
          ) : task.status === 'inprocess' ? (
            <button
              className="bg-blue-400 text-white px-4 py-2 rounded-lg text-sm"
            >
              In-Process
            </button>
          ) : (
            <button
              className="bg-gray-400 text-white px-4 py-2 rounded-lg text-sm"
              disabled
            >
              Closed
            </button>
          )}
          <button
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-1"
            onClick={() => handleStatusUpdateCompleted(task.id)}
            disabled={task.status === 'completed'}
          >
            <CheckCircle size={16} /> Completed
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
