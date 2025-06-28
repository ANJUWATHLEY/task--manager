import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import axios from '../../api/axiosInstance.js';

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const Navigate = useNavigate();

/// status have some issue 
  const fetchTasks = async () => {
    try {
      const res = await axios.get('manager/tasks', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log(res.data);
      

      const Formattasks = res.data.map((item) => ({
        ...item, assign_date: item.assign_date?.split('T')[0] || '',
        deadline_date: item.deadline_date?.split('T')[0] || ''
      }))

      setTasks(Formattasks);
    
    } catch (err) {
      console.error(' Task Fetch Error:', err.response?.data || err.message);
    }
  };

  async function taskdelete(id) {
    console.log('gelllo');
    await axios.delete(`/manager/deletetask/${id}`)
    
    fetchTasks()

  }

  useEffect(() => {
    fetchTasks();
  }, []);



  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100">
      {/* 🔹 Header with Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-blue-700">Assigned Tasks</h2>

        {(role === 'admin' || role === 'manager') && (
          <button
            onClick={() => Navigate('/Tasks')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
          >
            + Add New Task
          </button>
        )}

      </div>

      {/* 🔹 Task List */}
      {tasks.length === 0 ? (
        <p className="text-gray-500">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-2 flex flex-wrap items-center justify-between m-5   ">
          {tasks.map((task, index) => (
            <li key={index} className=" w-[25rem] h-[12rem] ml-5 bg-white p-3 rounded-lg shadow-sm border text-sm">
              <h3 className=" text-xl  font-semibold text-blue-700">{task.title}</h3>
              <p className="text-xl text-gray-700">{task.des}</p>
              <div className=" text-gray-500">

                <p>Status:

                  <span className="font-medium">{ task.status }</span>

                </p>

                <p className='text-xl font-semibold'>Deadline: {task.deadline_date}</p>
                <p>Assign Date: {task.assign_date}</p>
                <p>Role: {task.role}</p>
              </div>

              {/* 🔘 Buttons */}

              {role === 'manager' || role === 'admin' ? (
                <div className="flex gap-2 mt-2">

                  <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-5 py-2 rounded text-xs"
                    onClick={() => { Navigate('/updatetask/' + task.id)  }   }
                  >
                    update
                  </button>

                  <button
                    className="bg-red-500 hover:bg-black text-white px-3 py-1 rounded text-xs"
                    onClick={() => taskdelete(task.id)}
                  >
                    🗑️ Delete
                  </button>
                </div>

              ) : (
                <div className="flex gap-2 mt-2">

                  <button className="bg-sky-200 hover:bg-sky-600 text-white px-5 py-2 rounded text-xs"
                  >
                    in-process </button>

                  <button
                    className="bg-green-500 hover:bg-green-800 text-white px-3 py-1 rounded text-xs"
                    onClick={() => console.log("Delet")}
                  >
                    compled
                  </button>

                </div>
              )
              }

            </li>
          ))}
        </ul>

      )}
    </div>
  );
};

export default AssignedTasks;
