import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axiosInstance from "../api/axiosInstance.js";
import Cookies from "js-cookie"; // ✅ Import js-cookie

const InviteTaskPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [taskInfo, setTaskInfo] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const validateInvite = async () => {
      try {
        const response = await axiosInstance.get(`/invites/${token}`);
        console.log("Backend response:", response.data);

        const decoded = jwtDecode(token);
        console.log("Decoded token:", decoded);

        setTaskInfo(decoded);

        // ✅ Set token in cookies
        Cookies.set("inviteToken", token, { expires: 1 }); // expires in 1 day

      } catch (err) {
        console.error("Invalid or expired token:", err.message);
        setError("❌ Invalid or expired invite link.");
      }
    };

    if (token) validateInvite();
  }, [token]);

  const handleJoin = () => {
    navigate(`/employee/task/${taskInfo.taskId}`);
  };

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500 text-xl">
        {error}
      </div>
    );
  }

  if (!taskInfo) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        ⏳ Validating your invite...
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gradient-to-br from-purple-900 via-purple-700 to-purple-500 text-white px-6">
      <div className="bg-white text-gray-900 rounded-2xl shadow-xl p-8 w-full max-w-md text-center space-y-6">
        <h2 className="text-3xl font-bold text-purple-700">
          📨 You're Invited!
        </h2>

        <div className="text-left text-gray-700 space-y-2">
          <p><strong>📝 Task:</strong> {taskInfo.taskname}</p>
          <p><strong>🆔 Task ID:</strong> {taskInfo.taskId}</p>
        </div>

        <button
          onClick={handleJoin}
          className="mt-6 bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition duration-200"
        >
          ✅ Join Task
        </button>
      </div>
    </div>
  );
};

export default InviteTaskPage;