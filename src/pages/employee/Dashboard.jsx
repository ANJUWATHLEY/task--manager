// src/pages/EmployeeDashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  CheckCircle,
  ClipboardCheck,
  Hourglass,
  XCircle,
  Eye,
  ChevronDown
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [statusDropdown, setStatusDropdown] = useState(false);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('id');
  const Member_org = localStorage.getItem('Member_org');

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        if (!userId || !token) return;

        const res = await axios.get(`/employe/${userId}/${Member_org}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📌 Dashboard API response:", res.data);

        // ✅ Normalize response (same as MyTasks)
        const rawData = Array.isArray(res.data)
          ? res.data
          : res.data.user || []; // <-- fix here

        const formatted = rawData.map((item) => ({
          ...item,
          id: item.id || item.taskid || item._id || item.task_id,
          title: item.title || 'Untitled Task',
          description: item.description || 'No description',
          assign_date: item.assign_date?.split('T')[0] || '—',
          deadline_date: item.deadline_date?.split('T')[0] || '—',
          status: item.status ? String(item.status).toLowerCase() : 'pending',
        }));

        setTasks(formatted);
      } catch (error) {
        console.error('❌ Error fetching employee tasks:', error.response?.data || error.message);
      }
    };

    fetchMyTasks();
  }, [userId, Member_org, token]);

  // ✅ Stats
  const totalTasks = tasks.length;
  const todo = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'inprocess').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const done = tasks.filter((t) => t.status === 'complete').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-red-700 bg-red-100 px-3 py-1 rounded-full';
      case 'inprocess':
        return 'text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full';
      case 'review':
        return 'text-blue-700 bg-blue-100 px-3 py-1 rounded-full';
      case 'complete':
        return 'text-green-700 bg-green-100 px-3 py-1 rounded-full';
      default:
        return 'text-gray-700 bg-gray-100 px-3 py-1 rounded-full';
    }
  };

  const filteredTasks =
    filterStatus === 'all'
      ? tasks
      : tasks.filter((t) => t.status === filterStatus);

  return (
    <div className="min-h-screen bg-[#f0f4ff] px-4 sm:px-8 lg:px-16 py-8">
      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-10">
        {[
          { label: 'Total', count: totalTasks, icon: ClipboardCheck, color: 'blue', key: 'all' },
          { label: 'To Do', count: todo, icon: XCircle, color: 'red', key: 'pending' },
          { label: 'In Progress', count: inProgress, icon: Hourglass, color: 'yellow', key: 'inprocess' },
          { label: 'Review', count: review, icon: Eye, color: 'blue', key: 'review' },
          { label: 'Complete', count: done, icon: CheckCircle, color: 'green', key: 'complete' },
        ].map((card, i) => {
          const Icon = card.icon;
          return (
            <div
              key={i}
              onClick={() => setFilterStatus(card.key)}
              className={`cursor-pointer bg-white rounded-xl shadow-md p-6 text-center hover:shadow-xl transition relative group border-l-4 border-${card.color}-500`}
            >
              <Icon className={`mx-auto text-${card.color}-500`} size={36} />
              <p className="text-2xl font-bold mt-2">{card.count}</p>
              <p className="text-sm text-gray-500">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Task Table */}
      <div className="p-4 sm:p-6 rounded-xl shadow-md bg-white overflow-x-auto">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">Your Recent Tasks</h2>

        {filteredTasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
          <table className="min-w-full text-base border-collapse">
            <thead className="bg-blue-100 text-gray-800">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left relative">
                  Status
                  <button
                    onClick={() => setStatusDropdown(!statusDropdown)}
                    className="ml-2 p-1 rounded hover:bg-gray-200"
                  >
                    <ChevronDown size={16} />
                  </button>
                  {statusDropdown && (
                    <div className="absolute top-full left-0 mt-1 bg-white border shadow-md rounded-md z-10 w-32">
                      {['all', 'pending', 'inprocess', 'review', 'complete'].map((status, idx) => (
                        <button
                          key={idx}
                          onClick={() => { setFilterStatus(status); setStatusDropdown(false); }}
                          className="block w-full text-left px-4 py-2 hover:bg-gray-100 capitalize"
                        >
                          {status === 'all' ? 'All' : status}
                        </button>
                      ))}
                    </div>
                  )}
                </th>
                <th className="py-3 px-4 text-left">Assigned</th>
                <th className="py-3 px-4 text-left">Deadline</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.slice(0, 5).map((task, i) => (
                <tr key={i} className="border-b border-gray-200 hover:bg-blue-50 transition">
                  <td className="py-3 px-4 font-semibold text-gray-800">{task.title}</td>
                  <td className="py-3 px-4">
                    <span className={getStatusColor(task.status)}>
                      {task.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-700">{task.assign_date}</td>
                  <td className="py-3 px-4 text-red-500">{task.deadline_date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
