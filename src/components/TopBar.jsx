import React, { useEffect, useState } from 'react';
import { Search, User, LogOut, Building2, Users, Layers3 } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { Link, useNavigate } from 'react-router-dom';

const TopBar = () => {
  const [data, setData] = useState('');
  const [allTasks, setAllTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(false);
  const navigate = useNavigate();

  const role = localStorage.getItem('role');
  const orgid = localStorage.getItem("orgRef");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = '/admin/alltask';
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
  }, []);

  const handleSearch = (query) => {
    const lower = query.toLowerCase();
    const filtered = allTasks.filter(
      (task) =>
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
    const base = '/admin';

    if (['pending', 'inprocess', 'completed'].includes(status)) {
      navigate(`${base}/view-tasks#${status}`);
    } else {
      navigate(`${base}/viewtask/${task.id}`, { state: { task } });
    }

    setData('');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
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

        {/* Admin Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(!openDropdown)}
            className="flex items-center gap-2 text-white hover:text-yellow-300 transition-all duration-150 focus:outline-none"
          >
            <User size={22} />
          </button>

          {openDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white text-gray-800 rounded-lg shadow-lg border border-gray-100 z-50">
              <Link
                to="/admin/detail"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenDropdown(false)}
              >
                <User size={16} />
                Admin Detail
              </Link>

              <Link
                to={`/organization/getUser/${orgid}`}
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenDropdown(false)}
              >
                <Users size={16} />
                Organization
              </Link>

              <Link
                to="/businessUnitList"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenDropdown(false)}
              >
                <Building2 size={16} />
                Business Units
              </Link>

              <Link
                to="/departmentList"
                className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => setOpenDropdown(false)}
              >
                <Layers3 size={16} />
                Departments
              </Link>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-200"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
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
                  <div className="text-sm text-gray-500">
                    {task.status} — {task.des}
                  </div>
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
