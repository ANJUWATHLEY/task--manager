// src/components/tasks/TaskList.jsx
import React from 'react';

const TaskList = ({ tasks }) => {
  if (!tasks.length) return <p className="text-gray-500">No tasks assigned yet.</p>;

  return (
    <ul className="space-y-4">
      {tasks.map((task, index) => (
        <li key={index} className="bg-white p-4 rounded-xl shadow border">
          <h3 className="text-lg font-semibold text-blue-700">{task.title}</h3>
          <p className="text-gray-700">{task.des}</p>
          <p className="text-sm text-gray-500">Status: {task.status}</p>
          <p className="text-sm text-gray-500">Deadline: {task.deadlinedata}</p>
          <p className="text-sm text-gray-500">Assign Date: {task.assinedate}</p>
          <p className="text-sm text-gray-500">Assigned To Role: {task.role}</p>
        </li>
      ))}
    </ul>
  );
};

export default TaskList;
