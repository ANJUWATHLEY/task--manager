import React from 'react';
import { useLocation } from 'react-router-dom';

const TaskDetailsPage = () => {
  const { state } = useLocation();
  const task = state?.task;

  if (!task) {
    return <div className="p-10 text-center text-red-500">❌ Task not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">
          Task Details
        </h1>

        <div className="space-y-4 text-gray-700 text-base sm:text-lg">
          <p><span className="font-semibold">Title:</span> {task.title}</p>
          <p><span className="font-semibold">Description:</span> {task.description}</p>
          <p>
            <span className="font-semibold">Status:</span>{' '}
            <span className={`font-bold ${task.status === 'Completed' ? 'text-green-600' : 'text-blue-600'}`}>
              {task.status}
            </span>
          </p>
          <p>
            <span className="font-semibold">Assigned On:</span> {task.assign_date}
          </p>
          <p>
            <span className="font-semibold">Deadline:</span>{' '}
            <span className="text-red-500 font-medium">{task.deadline_date}</span>
          </p>
          <p>
            <span className="font-semibold">Priority:</span>{' '}
            <span className={`${task.priority === 'High' ? 'text-red-600' : task.priority === 'Medium' ? 'text-yellow-600' : 'text-green-600'}`}>
              {task.priority}
            </span>
          </p>

          {task.url && (
            <div className="pt-4">
              <a
                href={task.url}
                target="_blank"
                rel="noreferrer"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md font-medium"
              >
                Open Task Link
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskDetailsPage;
