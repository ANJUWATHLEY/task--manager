import { useEffect, useState } from 'react';
import TaskForm from '../../components/TaskForm';

const CreateTasksPage = () => {
  const [role, setRole] = useState('');

  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setRole(storedRole);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {role === 'admin' ? (
          <>
            <h1 className="text-3xl font-bold text-center text-purple-700">Create & Assign Task</h1>
            <TaskForm />
          </>
        ) : (
          <p className="text-center text-red-500 font-semibold text-lg">
             Only Admins can access this page.
          </p>
        )}
      </div>
    </div>
  );
};

export default CreateTasksPage;
