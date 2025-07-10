import React, { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';

const AdminTopBar = () => {
  const [data, setData] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);

  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('/admin/alltask');
      const tasks = Array.isArray(res.data) ? res.data : res.data.tasks || [];
      console.log('🔎 All Tasks:', tasks);
      setAllTasks(tasks);
      setFilteredTasks(tasks); // show all initially
    } catch (error) {
      console.error('❌ Fetch error:', error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Handle search input
  const handleSearch = (query) => {
    const lower = query.toLowerCase();

    const filtered = allTasks.filter((task) => {
      const title = task.title?.toLowerCase() || '';
      const status = task.status?.toLowerCase() || '';
      const priority = task.priority?.toLowerCase() || '';
      const user = task.user_name?.toLowerCase() || '';
      const description = task.description?.toLowerCase() || '';

      return (
        title.includes(lower) ||
        status.includes(lower) ||
        priority.includes(lower) ||
        user.includes(lower) ||
        description.includes(lower)
      );
    });

    setFilteredTasks(filtered);
    console.log('🔍 Search Query:', lower);
    console.log('Filtered Results:', filtered);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setData(value);
    handleSearch(value); // Real-time search
  };

  return (
    <div className="w-full">
      {/* Top Header */}
      <header className="w-full bg-[#2c1c80] py-3 px-6 flex items-center justify-between shadow-md relative">
        <div className="text-white font-bold text-lg">Task Manager</div>

        {/* Centered Search Bar */}
        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-md">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(data);
            }}
            className="flex items-center bg-[#3c2d8f] px-4 py-2 rounded-xl shadow-md w-full"
          >
            <Search className="text-white mr-2" size={18} />
            <input
              type="text"
              placeholder="Search anything..."
              className="bg-transparent text-white placeholder:text-white text-sm outline-none w-full"
              value={data}
              onChange={handleInputChange}
            />
          </form>
        </div>

        {/* Admin Profile Link */}
        <Link
          to="/admin/detail"
          className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-150"
        >
          <User size={20} />
          <span className="text-sm font-medium"></span>
        </Link>
      </header>

      {/* Search Results */}
      {data.trim() && (
        <div className="mt-4 bg-white p-4 rounded shadow text-black mx-4">
          <h2 className="font-semibold mb-2 text-lg">
            Search Results: ({filteredTasks.length})
          </h2>
          {filteredTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <ul className="space-y-1">
              {filteredTasks.map((task) => (
                <li key={task.id} className="border-b pb-1">
                  <strong>{task.title}</strong> — {task.status} — {task.description}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTopBar;
