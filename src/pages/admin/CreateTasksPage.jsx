import { useState, useEffect } from 'react';
import TaskForm from '../../components/TaskForm';


const CreateTasksPage= () => {
  const [tasks, setTasks] = useState([]);
  const [role, setRole] = useState('');

  useEffect(() => {

    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  
  }, []); 

  const handleAddTask = (task) => {
    setTasks((prev) => [...prev, task]);
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {role === 'admin' ? (
          <TaskForm onSubmit={handleAddTask} />
        ) : (
          <p className="text-center text-red-500 font-semibold">
            Only Managers can assign tasks 🚫
          </p>
        )}

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Task List</h2>
          {tasks.length === 0 ? (
            <p className="text-gray-500">No tasks added yet.</p>
          ) : (
            <ul className="space-y-3">
              {tasks.map((task, index) => (
                <li
                  key={index}
                  className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                >
                  <h3 className="text-lg font-semibold">{task.title}</h3>
                  <p>{task.description}</p>
                  <span className="text-xs text-white px-2 py-1 rounded bg-blue-500 mt-2 inline-block">
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateTasksPage;
