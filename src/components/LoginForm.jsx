import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Org reference helper
  const getOrgRef = (user) =>
    user?.orgRef || user?.orgId || user?.orgid || user?.organizationId || null;

  // ✅ Role-based navigation
  const goAfterLogin = (user) => {
    const orgRef = getOrgRef(user);
    const Member_org = user?.Member_org;
    const role = localStorage.getItem("role");

    if (Member_org && !orgRef) {
      if (role === "Hr") {
        let TASK = "";
        // Split using regex
        const match = Member_org.match(/^([a-zA-Z]+)(\d+)$/);

        if (match) {
          const [, text, number] = match;
          TASK = "TASK" + number; // 230
        }

        console.log(TASK);
        
        // localStorage.setItem("user_table", );
        localStorage.setItem("taskId", TASK);
        localStorage.setItem("orgRef", Member_org);

        return navigate("/admin/dashboard", { replace: true }); // Admin & HR
      } else {
        return navigate("/employee/dashboard", { replace: true }); // Employee
      }
    }

    if (!Member_org && orgRef) {
      return navigate("/admin/dashboard", { replace: true }); // Admin & HR
    }

    if (!Member_org && !orgRef) {
      return navigate("/organization-choice", { replace: true }); // Org selection
    }

    // Agar dono hai → default fallback
    return navigate("/", { replace: true });
  };

  // ✅ Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/user/login", { email, password });
      const { token, user } = res.data;

      console.log("Login Response:", res.data);

      const orgRef = getOrgRef(user);
      const taskId = user?.taskTable || null;
      const user_table = user?.userTable || null;

      // Save core values in localStorage
      if (token) localStorage.setItem("token", token);
      if (user?.id || user?._id)
        localStorage.setItem("id", user.id || user._id);
      if (user?.Member_org) localStorage.setItem("Member_org", user.Member_org);
      if (orgRef) localStorage.setItem("orgRef", orgRef);
      if (taskId) localStorage.setItem("taskId", taskId);
      if (user_table) localStorage.setItem("user_table", user_table);

      // ✅ Fetch full org info if orgRef exists
      if (orgRef) {
        try {
          const orgRes = await axios.get(`/organization/getUser/${orgRef}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const orgData = orgRes.data;
          if (orgData?.user_table) {
            localStorage.setItem("user_table", orgData.user_table);
          }
          localStorage.setItem("org_data", JSON.stringify(orgData));
        } catch (orgErr) {
          console.warn("Failed to fetch org details:", orgErr);
        }
      }

      // ✅ Extra API call for role
      try {
        const userid = user?.id || user?._id;
        const Member_org = user?.Member_org;

        let REFTASK = "";
        if (Member_org) {
          const match = Member_org.match(/^([a-zA-Z]+)(\d+)$/);
          if (match) {
            const [, , number] = match;
            REFTASK = "TASK" + number;
          }
        }

        if (userid && REFTASK) {
          const res2 = await axios.get(`/employe/data/${userid}/${REFTASK}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          console.log("Role API Response:", res2.data);

          // ✅ Array ya object dono case handle
          let userRole = null;
          if (Array.isArray(res2.data)) {
            userRole = res2.data?.[0]?.role || null;
          } else {
            userRole = res2.data?.role || null;
          }

          if (userRole) {
            localStorage.setItem("role", userRole);
            console.log("Extracted Role:", userRole);
          } else {
            console.warn("Role not found in response");
          }
        }
      } catch (roleErr) {
        console.warn("Failed to fetch role:", roleErr);
      }

      alert("Login successful");
      setEmail("");
      setPassword("");

      goAfterLogin(user);
    } catch (err) {
      console.error("Login Error:", err.response?.data || err.message);
      alert(
        err.response?.data?.message || "Login failed! Check your credentials."
      );
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
          <Link
            to="/signup"
            className="text-blue-500 hover:underline font-semibold"
          >
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
