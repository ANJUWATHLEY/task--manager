import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

 const getOrgRef = (user) =>
  user?.Member_org || user?.orgRef || user?.orgId || user?.orgid || user?.organizationId || null;

  const goAfterLogin = (user) => {
    const orgRef = getOrgRef(user);

    // Admin flow
    if (user.role === "admin") {
      if (!orgRef) return navigate("/create-organization", { replace: true });
      return navigate("/admin/dashboard", { replace: true });
    }

    // Manager / Employee (optional: if orgRef missing, force join page)
    if (user.role === "manager") {
      if (!orgRef) return navigate("/join-organization", { replace: true });
      return navigate("/manager/dashboard", { replace: true });
    }

     if (user.role === "employee") {
    if (!orgRef) {
      return navigate("/join-organization", { replace: true });
    } else {
      return navigate("/employee/dashboard", { replace: true });
    }
  }


    
    return navigate("/", { replace: true });
  };
const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("/user/login", { email, password });
    const { token, user } = res.data;

    console.log("Member Org Ref:", res.data.user.Member_org);
    
    const orgRef = getOrgRef(user);
    const taskId = user.taskTable || null;
    const user_table = user.userTable || null;

    // Save core values
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("id", user.id || user._id);
    localStorage.setItem("Member_org", user.Member_org);
    if (orgRef) localStorage.setItem("orgRef", orgRef);
    if (taskId) localStorage.setItem("taskId", taskId);
    if (user_table) localStorage.setItem("user_table", user_table);
  

    // ✅ NEW: Fetch full org info using orgRef
    if (orgRef) {
      try {
        const orgRes = await axios.get(`/organization/getUser/${orgRef}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
   
        const orgData = orgRes.data;

        // Save the user_table coming from organization data (overwrite if needed)
        if (orgData?.user_table) {
          localStorage.setItem("user_table", orgData.user_table);
        }

        // Optionally store full org data if you need it later
        localStorage.setItem("org_data", JSON.stringify(orgData));
      } catch (orgErr) {
        console.warn("Failed to fetch org details:", orgErr);
      }
    }

    alert("Login successful");
    setEmail("");
    setPassword("");

    goAfterLogin(user);
  } catch (err) {
    console.error("Login Error:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Login failed! Check your credentials.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 px-4">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl border border-gray-100"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Login
        </h2>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-4 border border-gray-200 rounded-xl bg-gray-50 placeholder-gray-400 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:scale-105 transition"
          >
            Login
          </button>

          <p className="text-sm text-blue-600 text-center hover:underline">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </div>

        <p className="mt-8 text-center text-gray-600">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline font-semibold">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
