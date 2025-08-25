import React, { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const DynamicDashboard = () => {
  const [role, setRole] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/user/me")
      .then((res) => {
        setRole(res.data.role);
        setPermissions(res.data.permissions || []);
      })
      .catch((err) => console.error("Failed to fetch user data", err))
      .finally(() => setLoading(false));
  }, []);

  // APIs
  const loadTasks = async () => {
    const res = await axios.get("/tasks");
    console.log("Tasks:", res.data);
  };

  const createTask = async () => {
    const res = await axios.post("/tasks", {
      title: "Demo Task",
      description: "Testing",
      assignedTo: [2],
      deadline: "2025-09-01"
    });
    console.log("Task created:", res.data);
  };

  const inviteMember = async () => {
    const res = await axios.post("/invites", {
      email: "newuser@test.com",
      role: "Employee"
    });
    alert("Invite Link: " + res.data.link);
  };

  const loadDepartments = async () => {
    const res = await axios.get("/departments");
    console.log("Departments:", res.data);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">{role} Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {permissions.includes("view_tasks") && (
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="font-semibold mb-2">My Tasks</h2>
            <button onClick={loadTasks} className="px-3 py-2 bg-gray-200 rounded">
              Load Tasks
            </button>
          </div>
        )}

        {permissions.includes("assign_tasks") && (
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="font-semibold mb-2">Assign Tasks</h2>
            <button onClick={createTask} className="px-3 py-2 bg-green-500 text-white rounded">
              Create Task
            </button>
          </div>
        )}

        {permissions.includes("invite_members") && (
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="font-semibold mb-2">Invite Members</h2>
            <button onClick={inviteMember} className="px-3 py-2 bg-blue-500 text-white rounded">
              Generate Invite
            </button>
          </div>
        )}

        {permissions.includes("manage_departments") && (
          <div className="p-4 bg-white shadow rounded-lg">
            <h2 className="font-semibold mb-2">Departments</h2>
            <button onClick={loadDepartments} className="px-3 py-2 bg-purple-500 text-white rounded">
              Manage Departments
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicDashboard;
