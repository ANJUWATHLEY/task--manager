// src/components/TopBar.jsx
import React, { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [data, setData] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem('role'); // check role to decide path

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = role === 'manager' ? '/manager/alltask' : '/admin/alltask';
        const res = await axiosInstance.get(url);

        const tasks = Array.isArray(res.data?.tasks)
          ? res.data.tasks
          : Array.isArray(res.data)
          ? res.data
          : [];

        setAllTasks(tasks);
        setFilteredTasks(tasks);
      } catch (error) {
        console.error('Fetch error:', error.message);
      }
    };
    fetchTasks();
  }, [role]);

  const handleSearch = (query) => {
    const lower = query.toLowerCase();
    const filtered = allTasks.filter((task) =>
      task.title?.toLowerCase().includes(lower) ||
      task.status?.toLowerCase().includes(lower) ||
      task.priority?.toLowerCase().includes(lower) ||
      task.user_name?.toLowerCase().includes(lower) ||
      task.des?.toLowerCase().includes(lower)
    );
    setFilteredTasks(filtered);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setData(value);
    handleSearch(value);
  };

  const handleSearchClick = (task) => {
    const status = task.status?.toLowerCase();
    const base = role === 'manager' ? '/manager' : '/admin';

    if (['pending', 'inprocess', 'completed'].includes(status)) {
      navigate(`${base}/view-tasks#${status}`);
    } else {
      navigate(`${base}/viewtask/${task.id}`, { state: { task } });
    }

    setData('');
  };

  return (
    <div className="relative z-50 w-full">
      {/* TopBar */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 text-white py-3 px-4 md:px-6 flex items-center justify-between shadow-md">
        <div className="text-xl font-bold">Task Manager</div>

        {/* Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(data);
            }}
            className="flex items-center bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20 shadow-lg transition"
          >
            <Search className="text-white mr-2" size={18} />
            <input
              type="text"
              placeholder="Search tasks, status, users..."
              className="bg-transparent text-white placeholder:text-white text-sm outline-none w-full"
              value={data}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {/* User */}
      <Link
  to={role === 'manager' ? '/manager/detail' : '/admin/detail'}
  className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-150"
>
  <User size={20} />
</Link>

      </header>

      {/* Search Results */}
      {data.trim() && (
        <div className="absolute top-[72px] left-1/2 transform -translate-x-1/2 w-full max-w-xl p-4 bg-white/80 backdrop-blur-md rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <h2 className="font-semibold mb-2 text-gray-700 text-lg">
            Search Results ({filteredTasks.length})
          </h2>
          {filteredTasks.length === 0 ? (
            <p className="text-gray-600">No tasks found.</p>
          ) : (
            <ul className="space-y-2">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => handleSearchClick(task)}
                  className="cursor-pointer border-b pb-2 hover:bg-indigo-50 px-3 py-2 rounded transition"
                >
                  <div className="font-semibold text-gray-800">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.status} — {task.des}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default TopBar;
