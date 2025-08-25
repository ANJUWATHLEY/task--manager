// src/pages/MyTasks.jsx
import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Hourglass, CheckCircle, AlertTriangle, Star, Zap } from 'lucide-react';

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const Member_org = localStorage.getItem("Member_org");
  const navigate = useNavigate();

  // ✅ Fetch Tasks
  const fetchMyTasks = async () => {
    try {
      if (!userid || !token) return;

      const res = await axios.get(`/employe/${userid}/${Member_org}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📌 MyTasks API response:", res.data);

      // ✅ Store REFTASK (task_table) in localStorage as string
      if (res.data.task_table) {
        localStorage.setItem(
          "REFTASK",
          typeof res.data.task_table === "string"
            ? res.data.task_table
            : JSON.stringify(res.data.task_table)
        );
      }
      const REFTASK = localStorage.getItem("REFTASK");
      console.log("REFTASK:", REFTASK);

      // ✅ Extract tasks (handle multiple response keys)
      const allData =
        Array.isArray(res.data.user) && res.data.user.length > 0
          ? res.data.user
          : Array.isArray(res.data.usertable) && res.data.usertable.length > 0
          ? res.data.usertable
          : Array.isArray(res.data)
          ? res.data
          : [];

      console.log("✅ Extracted task array:", allData);

      // ✅ Normalize + clean tasks
      const combined = allData
        .map((item) => ({
          ...item,
          id: item.id || item.taskid || item._id || item.task_id || null,
          title: item.title || "Untitled Task",
          description: cleanDescription(item.description),
          assign_date: item.assign_date
            ? item.assign_date.split("T")[0]
            : "—",
          deadline_date: item.deadline_date
            ? item.deadline_date.split("T")[0]
            : "—",
          status: item.status ? String(item.status).toLowerCase() : "pending",
          priority: item.priority || "none",
        }))
        .filter(
          (task, index, self) =>
            task.id && index === self.findIndex((t) => t.id === task.id)
        );

      setTasks(combined);
    } catch (error) {
      console.error(
        "❌ Error fetching employee tasks:",
        error.response?.data || error.message
      );
    }
  };

  // ✅ Clean up weird description text
  const cleanDescription = (desc) => {
    if (!desc || typeof desc !== "string") return "No description provided";
    return desc.replace(/"description":/gi, "").replace(/["{}]/g, "").trim();
  };

  useEffect(() => {
    fetchMyTasks();
  }, [userid, Member_org]);

  // ✅ Update Status
  const handleStatusUpdate = async (taskId, status) => {
    try {
      const storedRefTask = localStorage.getItem("REFTASK") || "";
      const REFTASK = storedRefTask;

      console.log("🔹 Updating Task:", taskId);
      console.log("🔹 Status:", status);
      console.log("🔹 REFTASK:", REFTASK);
      console.log("🔹 userid:", userid);

      // ✅ Send status, REFTASK & userid in body
      await axios.put(
        `/employe/${status}/${taskId}`,
        { status, REFTASK, userid }, // FIXED ✅
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchMyTasks(); // Refresh tasks
    } catch (error) {
      console.error(
        "❌ Error updating task:",
        error.response?.data || error.message
      );
      alert("Failed to update task status.");
    }
  };

  // ✅ Badge helpers
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "inprocess":
        return "bg-blue-100 text-blue-700";
      case "complete":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getPriorityColor = (priority) => {
    switch (String(priority).toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="p-4 sm:p-8 min-h-screen bg-gray-50 font-sans">
      {tasks.length === 0 ? (
        <p className="text-gray-500 text-center mt-10">
          No tasks assigned to you yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-md border border-gray-200 p-5 hover:shadow-lg transition flex flex-col justify-between"
            >
              {/* ✅ Badges */}
              <div className="flex items-center gap-7 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize  ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
              </div>

              {/* ✅ Title + Description */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {task.title}
                </h3>
                <div>
                  <p className="text-gray-600 text-sm line-clamp-2 inline">
                    {task.description.length > 100
                      ? `${task.description.slice(0, 100)}... `
                      : task.description}
                  </p>
                  {task.description.length > 100 && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/task/${task.id}`, { state: { task } })
                      }
                      className="text-blue-600 underline text-sm inline ml-1"
                    >
                      Read more
                    </button>
                  )}
                </div>
              </div>

              {/* ✅ Dates */}
              <div className="flex justify-between text-sm text-gray-500 mb-4">
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-700">Assign Date</span>
                  <span>{task.assign_date}</span>
                </div>
                <div className="flex flex-col items-start ml-4">
                  <span className="font-medium text-gray-700">Deadline</span>
                  <span className="text-red-500">{task.deadline_date}</span>
                </div>
              </div>

              {/* ✅ Actions */}
              <div>
                {task.status === "pending" && (
                  <button
                    className="w-full bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => handleStatusUpdate(task.id, "inprocess")}
                  >
                    Accept
                  </button>
                )}
                {task.status === "inprocess" && (
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm"
                    onClick={() => handleStatusUpdate(task.id, "complete")}
                  >
                    inprocess
                  </button>
                )}
                {task.status === "complete" && (
                  <span className="w-full inline-block bg-green-100 text-green-700 px-4 py-2 rounded-lg text-sm text-center font-medium">
                    Completed ✅
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyTasks;
