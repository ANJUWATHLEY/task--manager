import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import {
  CheckCircle,
  ClipboardCheck,
  Hourglass,
  XCircle,
  Search,
  Eye,
  Info
} from 'lucide-react';

const EmployeeDashboard = () => {
  const [tasks, setTasks] = useState([]);
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
        } else {
          console.error('Invalid Member_org format');
          return;
        }

        const res = await axios.get(`/employe/${userId}/${REFTASK}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
console.log(res.data);
        const data = Array.isArray(res.data) ? res.data : res.data.tasks || [];
        const formatted = data.map((item) => ({
          ...item,
          assign_date: item.assign_date?.split('T')[0] || '',
          deadline_date: item.deadline_date?.split('T')[0] || '',
        }));

        setTasks(formatted);
      } catch (error) {
        console.error('Error fetching employee tasks:', error);
      }
    };

    fetchMyTasks();
  }, []);

  const totalTasks = tasks.length;
  const todo = tasks.filter((t) => t.status === 'PENDING').length;
  const inProgress = tasks.filter((t) => t.status === 'inprocess').length;
  const review = tasks.filter((t) => t.status === 'review').length;
  const done = tasks.filter((t) => t.status === 'done').length;

  const getStatusColor = (status) => {
    switch (status) {
      case 'todo':
        return 'text-red-600';
      case 'inprocess':
        return 'text-yellow-600';
      case 'review':
        return 'text-blue-600';
      case 'done':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] px-10 py-8">
      {/* Task Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-10">

        {/* Total */}
        <div className="bg-white rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition relative group">
          <ClipboardCheck className="mx-auto text-blue-500" size={36} />
          <p className="text-2xl font-bold mt-2">{totalTasks}</p>
          <p className="text-sm text-gray-500">Total Tasks</p>
          <div className="absolute top-2 right-2">
            <Info size={16} className="text-gray-400 group-hover:text-black" />
            <div className="absolute hidden group-hover:block bg-white border p-2 text-xs shadow rounded-md w-40 z-10">
              Sabhi assign kiye gaye tasks ka total.
            </div>
          </div>
        </div>

        {/* To Do */}
        <div className="bg-red-50 rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition relative group">
          <XCircle className="mx-auto text-red-600" size={36} />
          <p className="text-2xl font-bold mt-2">{todo}</p>
          <p className="text-sm text-gray-500">To Do</p>
          <div className="absolute top-2 right-2">
            <Info size={16} className="text-gray-400 group-hover:text-black" />
            <div className="absolute hidden group-hover:block bg-white border p-2 text-xs shadow rounded-md w-40 z-10">
              Abhi tak start nahi kiye gaye tasks.
            </div>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-yellow-50 rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition relative group">
          <Hourglass className="mx-auto text-yellow-600" size={36} />
          <p className="text-2xl font-bold mt-2">{inProgress}</p>
          <p className="text-sm text-gray-500">In Progress</p>
          <div className="absolute top-2 right-2">
            <Info size={16} className="text-gray-400 group-hover:text-black" />
            <div className="absolute hidden group-hover:block bg-white border p-2 text-xs shadow rounded-md w-40 z-10">
              Employee is working on these tasks.
            </div>
          </div>
        </div>

        {/* Review */}
        <div className="bg-blue-50 rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition relative group">
          <Eye className="mx-auto text-blue-600" size={36} />
          <p className="text-2xl font-bold mt-2">{review}</p>
          <p className="text-sm text-gray-500">Review</p>
          <div className="absolute top-2 right-2">
            <Info size={16} className="text-gray-400 group-hover:text-black" />
            <div className="absolute hidden group-hover:block bg-white border p-2 text-xs shadow rounded-md w-40 z-10">
              Completed by employee, awaiting admin approval.
            </div>
          </div>
        </div>

        {/* Done */}
        <div className="bg-green-50 rounded-xl shadow-md p-6 text-center hover:bg-blue-100 transition relative group">
          <CheckCircle className="mx-auto text-green-600" size={36} />
          <p className="text-2xl font-bold mt-2">{done}</p>
          <p className="text-sm text-gray-500">Done</p>
          <div className="absolute top-2 right-2">
            <Info size={16} className="text-gray-400 group-hover:text-black" />
            <div className="absolute hidden group-hover:block bg-white border p-2 text-xs shadow rounded-md w-40 z-10">
              Admin reviewed and approved as completed.
            </div>
          </div>
        </div>
      </div>

      {/* Recent Task Table */}
      <div className="p-6 rounded-xl shadow-md bg-blue-50">
        <h2 className="text-2xl font-semibold text-blue-700 mb-4">
          Your Recent Tasks
        </h2>

        {tasks.length === 0 ? (
          <p className="text-gray-600">No tasks found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-base">
              <thead className="bg-blue-100 text-gray-800">
                <tr>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Assigned</th>
                  <th className="py-3 px-4 text-left">Deadline</th>
                </tr>
              </thead>
              <tbody>
                {tasks.slice(0, 5).map((task, i) => (
                  <tr
                    key={i}
                    className="border-b border-blue-200 hover:bg-blue-100 transition"
                  >
                    <td className="py-3 px-4 font-semibold text-gray-800">{task.title}</td>
                    <td className={`py-3 px-4 font-medium capitalize ${getStatusColor(task.status)}`}>
                      {task.status}
                    </td>
                    <td className="py-3 px-4 text-gray-700">{task.assign_date}</td>
                    <td className="py-3 px-4 text-red-500">{task.deadline_date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
