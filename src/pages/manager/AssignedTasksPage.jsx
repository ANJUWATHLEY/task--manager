import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import {
  Pencil, Trash2, ClipboardCopy, Mail,
  MessageCircleMore, ChevronDown,
} from 'lucide-react';

const AssignedTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const rawRole = localStorage.getItem('role');

  // ✅ Dynamic Role mapping
  const roleMap = {
    hr: "manager",
    senior: "manager",
    tech_lead: "manager",
    manager: "manager",
    employee: "employee"
  };
  const role = roleMap[rawRole?.toLowerCase()] || rawRole?.toLowerCase();

  const isOverdue = (dateStr) => {
    const today = new Date();
    const deadline = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`/${role}/readalltask`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];

      const formatted = data.map((item) => ({
        ...item,
        assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || '',
      }));

      setTasks(formatted);
    } catch (err) {
      console.error('❌ Fetch Error:', err.response?.data || err.message);
    }
  };

  const taskDelete = async (taskId) => {
    try {
      await axios.delete(`/${role}/taskdelete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks();
      alert('Task Deleted Successfully');
    } catch (error) {
      console.error('Delete Error:', error);
      alert('Failed to delete task.');
    }
  };

  const handleTaskPriority = async (taskId, level) => {
    try {
      await axios.put(
        `/${role}/priority/${taskId}`,
        { priority: level },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchTasks();
    } catch (error) {
      console.error('Priority Update Error:', error);
      alert('Failed to update priority.');
    }
  };

  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const statusMatch =
      filter === 'all' || filter === 'overdue'
        ? true
        : task.status?.toLowerCase() === filter.toLowerCase();

    const priorityMatch =
      priorityFilter === 'all'
        ? true
        : task.priority?.toLowerCase() === priorityFilter.toLowerCase();

    const overdueMatch = filter === 'overdue' ? isOverdue(task.deadline_date) : true;

    return statusMatch && priorityMatch && overdueMatch;
  });

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-gray-50 to-purple-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-white rounded-full px-3 py-1 shadow text-sm flex-wrap">
          {['all', 'Pending', 'inprocess', 'completed', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1 rounded-full font-bold cursor-pointer ${
                filter === status ? 'bg-blue-600 text-white' : 'text-gray-600'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({
                status === 'overdue'
                  ? tasks.filter((t) => isOverdue(t.deadline_date)).length
                  : tasks.filter((t) =>
                      status === 'all'
                        ? true
                        : t.status?.toLowerCase() === status.toLowerCase()
                    ).length
              })
            </button>
          ))}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-1 px-3 py-1 rounded-full font-bold text-gray-600"
            >
              Priority <ChevronDown size={16} />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                {['all', 'high', 'medium', 'low'].map((level) => (
                  <button
                    key={level}
                    onClick={() => {
                      setPriorityFilter(level);
                      setDropdownOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-2 text-sm font-bold ${
                      priorityFilter === level
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => navigate(`/${role}/tasks`)}
            className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md cursor-pointer"
          >
            + Add Task
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-500">No tasks to show.</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
            >
              <h3 className="text-xl font-bold text-blue-700">{task.title}</h3>
              <div className="flex justify-end mt-2">
                <div className="relative group inline-block">
                  <button className="text-gray-500 hover:text-gray-800 text-xl">🔗</button>
                  <div className="absolute bottom-full right-0 mb-3 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
                    <p className="text-sm text-gray-700 mb-3 break-words">{task.url}</p>
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => copyToClipboard(task.url)}
                        className="bg-gray-100 hover:bg-gray-200 p-2 rounded text-gray-800"
                      >
                        <ClipboardCopy size={16} />
                      </button>
                      <a
                        href={`mailto:?subject=Task&body=${task.url}`}
                        target="_blank"
                        className="bg-blue-100 hover:bg-blue-200 p-2 rounded text-blue-700"
                      >
                        <Mail size={16} />
                      </a>
                      <a
                        href={`https://wa.me/?text=${task.url}`}
                        target="_blank"
                        className="bg-green-100 hover:bg-green-200 p-2 rounded text-green-700"
                      >
                        <MessageCircleMore size={16} />
                      </a>
                    </div>
                    {copied && (
                      <p className="text-green-600 text-xs mt-2">✅ Copied!</p>
                    )}
                  </div>
                </div>
              </div>
              <p className="text-gray-700 mt-1">{task.des}</p>
              <div className="mt-3 text-sm text-gray-600 space-y-1">
                <p>
                  Status: <span className="font-bold">{task.status}</span>
                </p>
                <p>
                  Assign Date: <span className="font-bold">{task.assign_date}</span>
                </p>
                <p>
                  Deadline:{" "}
                  <span className="text-red-600 font-bold">{task.deadline_date}</span>
                </p>
                <p>
                  Role: <span className="font-bold">{task.role}</span>
                </p>
                <p>
                  Assigned To: <span className="font-bold">{task.user_name}</span>
                </p>
                {isOverdue(task.deadline_date) && (
                  <span className="text-red-600 text-sm font-semibold">
                    {" "}
                    Overdue
                  </span>
                )}
                <div className="flex items-center gap-3 mt-2">
                  <p className="font-bold">Priority:</p>
                  {['High', 'Medium', 'Low'].map((level) => (
                    <label
                      key={level}
                      className="flex items-center gap-1 text-sm cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={task.priority === level}
                        onChange={() => handleTaskPriority(task.id, level)}
                        className="accent-purple-600 w-4 h-4"
                      />
                      <span
                        className={`font-semibold ${
                          level === 'High'
                            ? 'text-red-600'
                            : level === 'Medium'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}
                      >
                        {level}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => navigate(`/${role}/update-task/${task.id}`)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                  <Pencil size={16} /> Update
                </button>
                <button
                  onClick={() => taskDelete(task.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-2 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button
                  onClick={() => navigate(`/${role}/viewtask/${task.id}`, { state: { task } })}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm flex items-center gap-1"
                >
                  View
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AssignedTasksPage;
