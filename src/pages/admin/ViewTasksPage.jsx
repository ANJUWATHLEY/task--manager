import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import TaskTableListview from '../../components/TaskTableListview'; // list view table component

import {
  Pencil, Trash2, ClipboardCopy, Mail,
  MessageCircleMore, ChevronDown, LayoutGrid, List
} from 'lucide-react';
import { div } from 'framer-motion/client';

const ViewTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [viewMode, setViewMode] = useState('card'); // ✅ NEW

  const navigate = useNavigate();
  const create_by = localStorage.getItem('id');
  const REFTASK = localStorage.getItem('taskId')
  const token = localStorage.getItem('token');

  const isOverdue = (dateStr) => {
    const today = new Date();
    const deadline = new Date(dateStr);
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const fetchTasks = async () => {
   
   console.log(create_by);
   console.log(REFTASK);
   
    try {
      const res = await axios.get(`/admin/alltask/${create_by}/${REFTASK}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
     console.log(res)
      const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];

      const formatted = data.map((item) => ({
        ...item,
        assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || '',
      }));

      setTasks(formatted);
    } catch (err) {
      console.error('Fetch Error:', err.response?.data || err.message);
    }
  };

  const taskDelete = async (taskId) => {
    try {
      await axios.delete(`/admin/taskdelete/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { REFTASK: REFTASK },
      });

      fetchTasks();
      alert('Task Deleted Successfully');
    } catch (error) {
      console.error('Delete Error:', error.response?.data || error.message);
      alert('Failed to delete task.');
    }
  };

  const handleTaskPriority = async (taskId, level) => {
    try {
      await axios.put(
        `/admin/priority/${taskId}`,
        { priority: level, REFTASK: REFTASK },
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
  <div>
    {/* Top Controls */}
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
      
      {/* Left Side: View Toggle + Status Filters */}
      <div className="flex flex-wrap items-center gap-3 flex-grow">
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-white rounded-lg shadow px-2 py-1">
          <button
            onClick={() => setViewMode('card')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
              viewMode === 'card'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            Board View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-semibold transition ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <List className="h-4 w-4" />
            List View
          </button>
        </div>

        {/* Status Filters */}
        <div className="flex items-center gap-3  ml-11 pl-25 flex-wrap">
          {['all', 'Pending', 'inprocess', 'complete', 'overdue'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status.toLowerCase())}
              className={`px-3 py-1 rounded-full font-bold cursor-pointer text-sm ${
                filter.toLowerCase() === status.toLowerCase()
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-blue-700'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} (
              {status === 'overdue'
                ? tasks.filter((t) => isOverdue(t.deadline_date)).length
                : tasks.filter((t) =>
                    status === 'all'
                      ? true
                      : t.status?.toLowerCase() === status.toLowerCase()
                  ).length}
              )
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Priority Filter + Add Task */}
      <div className="flex items-center gap-4">
        
        {/* Priority Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-1 px-3 py-1 rounded-full font-bold text-gray-600 hover:text-blue-700"
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
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add Task Button */}
        <button
          onClick={() => navigate('/admin/tasks')}
          className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold shadow-md"
        >
          + Add Task
        </button>
      </div>
    </div>

    {/* Render Task List or Cards */}
    {viewMode === 'list' ? (
      <TaskTableListview
        tasks={filteredTasks}
        onDelete={taskDelete}
        onPriorityChange={handleTaskPriority}
      />
    ) : (
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className="bg-white rounded-xl shadow-md p-5 hover:shadow-xl transition"
          >
            {/* Title */}
            <h3 className="text-xl font-bold text-blue-700">{task.title}</h3>

            {/* Link Options */}
            <div className="flex justify-end mt-2">
              <div className="relative group inline-block">
                <button className="text-gray-500 hover:text-gray-800 text-xl">
                  🔗
                </button>
                <div className="absolute bottom-full right-0 mb-3 w-64 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
                  <p className="text-sm text-gray-700 mb-3 break-words">
                    {task.url}
                  </p>
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
                    <p className="text-green-600 text-xs mt-2">Copied!</p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <p className="font-medium break-words overflow-hidden text-ellipsis whitespace-nowrap max-w-full">
              Description:{' '}
              <span
                className="font-bold cursor-pointer text-blue-700 hover:underline"
                title={task.description}
                onClick={() =>
                  navigate(`/admin/viewtask/${task.id}`, { state: { task } })
                }
              >
                {task.description?.split(' ').length > 10
                  ? task.description.split(' ').slice(0, 10).join(' ') + '...'
                  : task.description}
              </span>
            </p>

            {/* Task Details */}
            <div className="mt-3 text-sm text-gray-600 space-y-1">
              <p>Status: <span className="font-bold">{task.status}</span></p>
              <p>Assign Date: <span className="font-bold">{task.assign_date}</span></p>
              <p>Deadline: <span className="text-red-600 font-bold">{task.deadline_date}</span></p>
              <p>Role: <span className="font-bold">{task.role}</span></p>
              <p>Assigned To: <span className="font-bold">{task.user_name}</span></p>

              {/* Priority */}
              <div className="flex items-center gap-2 mt-2 ">
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

              {isOverdue(task.deadline_date) && (
                <span className="text-red-600 text-sm font-semibold">
                  Overdue
                </span>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => navigate(`/admin/update-task/${task.id}`)}
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
                onClick={() =>
                  navigate(`/admin/viewtask/${task.id}`, { state: { task } })
                }
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
}

export default ViewTasksPage;
