import React from 'react';


import TaskForm from '../../components/TaskForm';

const ManagerTaskForm = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-600">Team View (Manager)</h1>
      <TaskForm />
    </div>
  );
};

export default ManagerTaskForm;
   