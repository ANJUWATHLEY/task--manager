import React from "react";
import { Pencil, Trash2, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TaskTableListview= ({ tasks, onDelete, onPriorityChange }) => {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-lg shadow bg-white">
      <table className="min-w-full text-sm text-left text-gray-600">
        <thead className="bg-purple-100 text-gray-900 text-sm uppercase font-semibold">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Assign Date</th>
            <th className="px-6 py-4">Deadline</th>
            <th className="px-6 py-4">Priority</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                No tasks found.
              </td>
            </tr>
          ) : (
            tasks.map((task) => (
              <tr
                key={task.id}
                className="border-b hover:bg-gray-50 transition duration-300"
              >
                <td className="px-6 py-4 font-semibold">{task.user_name}</td>
                <td className="px-6 py-4 capitalize font-medium">
                  {task.status}
                </td>
                <td className="px-6 py-4">{task.assign_date}</td>
                <td className="px-6 py-4 text-red-600 font-bold">
                  {task.deadline_date}
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2 items-center">
                    {["High", "Medium", "Low"].map((level) => (
                      <label
                        key={level}
                        className="flex items-center gap-1 text-xs cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={task.priority === level}
                          onChange={() => onPriorityChange(task.id, level)}
                          className="accent-purple-600 w-3 h-3"
                        />
                        <span
                          className={`font-semibold ${
                            level === "High"
                              ? "text-red-600"
                              : level === "Medium"
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          {level}
                        </span>
                      </label>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 flex gap-2 justify-center">
                  <button
                    onClick={() =>
                      navigate(`/admin/viewtask/${task.id}`, {
                        state: { task },
                      })
                    }
                    className="text-green-600 hover:text-green-800"
                  >
                    <Eye size={16} />
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/admin/update-task/${task.id}`)
                    }
                    className="text-yellow-500 hover:text-yellow-700"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTableListview;
