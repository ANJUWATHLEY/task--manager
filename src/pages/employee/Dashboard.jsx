import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  CheckCircle,
  ClipboardCheck,
  Hourglass,
  XCircle,
  Eye,
  Info,
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
        let REFTASK = '';
        const match = Member_org?.match(/^([a-zA-Z]+)(\d+)$/);
        if (match) {
          const [, , number] = match;
          REFTASK = 'TASK' + number;
        } else return;

        const res = await axios.get(`/employe/${userId}/${REFTASK}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
        const formatted = data.map((item) => ({
          ...item,
          assign_date: item.assign_date?.split('T')[0] || '',
          deadline_date: item.deadline_date?.split('T')[0] || '',
          status: item.status.toLowerCase(),
        }));

        setTasks(formatted);
      } catch (error) {
        console.error('Error fetching employee tasks:', error);
      }
    };

    fetchMyTasks();
  }, []);

  const totalTasks = tasks.length;
  const todo = tasks.filter((t) => t.status === 'pending').length;
  const inProgress = tasks.filter((t) => t.status === 'inprocess').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const done = tasks.filter((t) => t.status === 'complete').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return ' text-red-700';
      case 'inprocess':
        return ' text-yellow-700';
      case 'review':
        return ' text-blue-700';
      case 'complete':
        return ' text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
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
          { label: 'To Do', count: todo, icon: XCircle, color: 'blue', key: 'pending' },
          { label: 'In Progress', count: inProgress, icon: Hourglass, color: 'blue', key: 'inprocess' },
          { label: 'Review', count: review, icon: Eye, color: 'blue', key: 'review' },
          { label: 'Complete', count: done, icon: CheckCircle, color: 'blue', key: 'complete' },
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
                          {status === 'all' ? 'All' : status.replace(/([a-z])([A-Z])/g, '$1 $2')}
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
                  <td>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
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
