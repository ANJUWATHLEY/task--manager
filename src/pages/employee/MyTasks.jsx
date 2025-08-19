import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const MyTasks = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const userid = localStorage.getItem("id");
  const Member_org = localStorage.getItem("Member_org");
  const navigate = useNavigate();

  // ✅ Ref Task Generate
  let REFTASK = "";
  const match = Member_org?.match(/^([a-zA-Z]+)(\d+)$/);
  if (match) {
    const [, , number] = match;
    REFTASK = "TASK" + number;
  }

  // ✅ Fetch Tasks
  const fetchMyTasks = async () => {
    try {
      if (REFTASK) {
        const [res1, res2] = await Promise.all([
          axios.get(`/employe/${userid}/${REFTASK}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`/employe/${userid}/${REFTASK}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("res1:", res1.data);
        console.log("res2:", res2.data);

        const data1 = Array.isArray(res1.data) ? res1.data : res1.data.tasks || [];
        const data2 = Array.isArray(res2.data) ? res2.data : res2.data.tasks || [];

        // ✅ Merge + Clean Data
        const combined = [...data1, ...data2]
          .map((item) => ({
            ...item,
            id: item.id || item.taskid || item._id, // fix key issue
            assign_date: item.assign_date?.split("T")[0] || "",
            deadline_date: item.deadline_date?.split("T")[0] || "",
            status: item.status ? item.status.toLowerCase() : "pending",
          }))
          .filter(
            (task, index, self) =>
              index === self.findIndex((t) => t.id === task.id) // remove duplicates
          );

        setTasks(combined);
      }
    } catch (error) {
      console.error(
        "❌ Error fetching employee tasks:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
    fetchMyTasks();
  }, []);

  // ✅ Update Status
  const handleStatusUpdate = async (taskId, status) => {
    try {
      await axios.put(
        `/employe/${status}/${taskId}`,
        { REFTASK, userid, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchMyTasks();
    } catch (error) {
      console.error("❌ Error updating task:", error.response?.data || error.message);
      alert("Failed to update task status.");
    }
  };

  // ✅ Status badge colors
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

  // ✅ Priority badge colors
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
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
              {/* ✅ Top badges */}
              <div className="flex items-center gap-7 mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(
                    task.status
                  )}`}
                >
                  {task.status}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority || "None"}
                </span>
              </div>

              {/* ✅ Title + Description */}
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">
                  {task.title}
                </h3>
                <div>
                  <p className="text-gray-600 text-sm line-clamp-2 inline">
                    {task.description
                      ? task.description.length > 100
                        ? `${task.description.slice(0, 100)}... `
                        : task.description
                      : "No description"}
                  </p>
                  {task.description && task.description.length > 10 && (
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

              {/* ✅ Action buttons */}
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
                    Mark Complete
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
