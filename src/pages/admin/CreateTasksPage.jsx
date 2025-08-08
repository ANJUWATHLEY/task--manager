import React, { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { toast } from "react-toastify";
import {
  UserPlus,
  Filter,
  CalendarDays,
  Flag,
  ImagePlus,
  X,
} from "lucide-react";

const CreateTasksPage = ( {onClose}) => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("all");
  const [showAssigneeDropdown, setShowAssigneeDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showRoleFilter, setShowRoleFilter] = useState(false);

  const hasFetchedOnce = useRef(false);
  const adminId = localStorage.getItem("id");
  const USERREF = localStorage.getItem("user_table"); // e.g., USERS4053
  const token = localStorage.getItem("token");
  const taskId = localStorage.getItem("taskId");
  const navigate = useNavigate();
 console.log("USERREF:", USERREF, "taskId:", taskId);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get(`/admin/allemploye/${USERREF}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data);
        if (!hasFetchedOnce.current) {
          toast.success("✅ Users loaded");
          hasFetchedOnce.current = true;
        }
      } catch {
        toast.error("❌ Failed to load users");
      }
    };
    fetchUsers();
  }, []);

 const onSubmit = async (data) => {
  if (!selectedUser) {
    toast.error("Please select an assignee.");
    return;
  }

  const taskPayload = {
    title: data.title,
    description: data.description || "",
    assign_date: data.assign_date,
    deadline_date: data.deadline_date,
    priority: data.priority,
    create_by: adminId,
    reftask: taskId,
    userids: [selectedUser.id], // send array directly
    // task_image: not included here (needs FormData if uploading file)
  };

  try {
    const response = await axiosInstance.post("/admin/createtask", taskPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    toast.success("✅ Task created successfully");
    reset();
    setSelectedUser(null);
  } catch (error) {
    console.error("❌ Error creating task:", error);
    toast.error("❌ Error creating task");
  }
};

  const filteredUsers = users.filter((user) => {
    const matchesRole =
      filterRole === "all" ||
      (user.role && user.role.toLowerCase() === filterRole.toLowerCase());

    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesRole && matchesSearch;
  });

  return (
   
 
      <form
        onSubmit={handleSubmit(onSubmit)}
className="space-y-5  "

      encType="multipart/form-data"
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Create New Task
          </h2>
         <button
  type="button"
  onClick={onClose}
  className="text-gray-500 hover:text-red-500 p-1"
  title="Close"
>
  <X size={22} />
</button>

        </div>

        {/* Title */}
        <div>
          <input
            {...register("title", { required: true })}
            placeholder="Task Title"
            className="w-full border-b px-3 py-2 text-lg placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          {errors.title && (
            <p className="text-sm text-red-500 mt-1">Title is required</p>
          )}
        </div>

        {/* Description */}
        <textarea
          {...register("description")}
          placeholder="Task Description"
          rows={4}
          className="w-full border px-4 py-2 rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-purple-400"
        />

        {/* Fields Row */}
        <div className="flex flex-wrap gap-4 items-start mt-4">
          {/* Assign To */}
          <div className="relative">
            <label className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <UserPlus size={17} className="text-gray-500" />
              Assign To
            </label>

            <button
              type="button"
              onClick={() => setShowAssigneeDropdown((prev) => !prev)}
              className="flex items-center gap-2 text-sm bg-gray-100 px-4 py-2 rounded-md border hover:bg-gray-200 transition w-40"
            >
              {selectedUser ? selectedUser.name || selectedUser.email : "Select User"}
            </button>

            {showAssigneeDropdown && (
              <div className="absolute left-0 bottom-full mb-2 w-72 bg-white border rounded-xl shadow-xl p-4 z-50">
                <div className="flex justify-between items-center mb-3">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search user..."
                    className="flex-grow px-3 py-1.5 text-sm border rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRoleFilter(!showRoleFilter)}
                    className="p-2 ml-2 hover:bg-gray-100 rounded-md"
                  >
                    <Filter size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAssigneeDropdown(false)}
                    className="p-2 ml-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md"
                  >
                    <X size={18} />
                  </button>
                </div>

                {showRoleFilter && (
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full mb-3 border px-2 py-1.5 text-sm rounded-md"
                  >
                    <option value="all">All</option>
                    <option value="manager">Manager</option>
                    <option value="employee">Employee</option>
                  </select>
                )}

                <div className="max-h-40 overflow-y-auto space-y-1">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => {
                        setSelectedUser(user);
                        setShowAssigneeDropdown(false);
                      }}
                      className={`cursor-pointer p-2 rounded-md text-sm border hover:bg-gray-100 ${
                        selectedUser?.id === user.id
                          ? "bg-purple-100 border-purple-400"
                          : ""
                      }`}
                    >
                      <div className="font-medium">
                        {user.name || user.email}
                      </div>
                    </div>
                  ))}
                  {filteredUsers.length === 0 && (
                    <div className="text-center text-gray-400 text-sm py-2">
                      No users found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Assign Date */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <CalendarDays size={14} />
              Assigned Date
            </label>
            <input
              type="date"
              {...register("assign_date", { required: true })}
              className="bg-white border rounded-md px-3 py-1 text-sm w-40"
            />
          </div>

          {/* Deadline */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <CalendarDays size={14} />
              Deadline
            </label>
            <input
              type="date"
              {...register("deadline_date", { required: true })}
              className="bg-white border rounded-md px-3 py-1 text-sm w-40"
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <Flag size={14} />
              Priority
            </label>
            <select
              {...register("priority", { required: true })}
              className="bg-white border rounded-md px-3 py-1 text-sm w-32"
            >
              <option value="">Select</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Task Image */}
          <div className="flex flex-col">
            <label className="text-xs text-gray-500 mb-1 flex items-center gap-1">
              <ImagePlus size={14} />
              Task Image
            </label>
            <input
              type="file"
              accept="image/*"
              {...register("task_image")}
              className="bg-white border rounded-md px-3 py-1 text-sm w-40"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-6">
          <button
            type="submit"
            className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-900 transition"
          >
            Create Task
          </button>
        </div>
      </form>
         
 

  );
};

export default CreateTasksPage;
