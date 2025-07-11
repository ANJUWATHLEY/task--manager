import React, { useEffect, useState } from 'react';
import { Search, User } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const AdminTopBar = () => {
  const [data, setData] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const navigate = useNavigate();

  const fetchTasks = async () => {
    try {
      const res = await axiosInstance.get('/admin/alltask');

      const tasks = Array.isArray(res.data?.tasks)
        ? res.data.tasks
        : Array.isArray(res.data)
        ? res.data
        : [];

      console.log('Fetched tasks:', tasks); // DEBUG
      setAllTasks(tasks);
      setFilteredTasks(tasks);
    } catch (error) {
      console.error('Fetch error:', error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSearch = (query) => {
    const lower = query.toLowerCase();
    const filtered = allTasks.filter((task) =>
      task.title?.toLowerCase().includes(lower) ||
      task.status?.toLowerCase().includes(lower) ||
      task.priority?.toLowerCase().includes(lower) ||
      task.user_name?.toLowerCase().includes(lower) ||
      task.des?.toLowerCase().includes(lower) // Use `des` if `description` isn't correct
    );
    setFilteredTasks(filtered);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setData(value);
    console.log('Search input:', value); // DEBUG
    handleSearch(value);
  };

  const handleSearchClick = (task) => {
    const status = task.status?.toLowerCase();

    if (status === 'pending' || status === 'inprocess' || status === 'completed') {
      navigate(`/admin/view-tasks#${status}`);
    } else {
      navigate(`/admin/viewtask/${task.id}`, { state: { task } });
    }

    setData('');
  };

  return (
    <div className="relative w-full z-50">
      <header className="w-full bg-[#2c1c80] py-3 px-6 flex items-center justify-between shadow-md relative">
        <div className="text-white font-bold text-lg">Task Manager</div>

        <div className="absolute left-1/2 transform -translate-x-1/2 w-full max-w-xl">
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

        <Link
          to="/admin/detail"
          className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-150"
        >
          <User size={20} />
        </Link>
      </header>

      {data.trim() && (
        <div className="absolute top-[70px] left-1/2 transform -translate-x-1/2 w-full max-w-xl bg-white p-4 rounded shadow text-black z-50 max-h-96 overflow-y-auto">
          <h2 className="font-semibold mb-2 text-lg">
            Search Results ({filteredTasks.length})
          </h2>

          {filteredTasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            <ul className="space-y-1">
              {filteredTasks.map((task) => (
                <li
                  key={task.id}
                  onClick={() => handleSearchClick(task)}
                  className="border-b pb-1 cursor-pointer hover:bg-gray-100 px-2 py-1 rounded"
                >
                  <strong>{task.title}</strong> — {task.status} — {task.des}
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
