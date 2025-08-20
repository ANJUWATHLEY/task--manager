import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { User, Mail, Lock, } from "lucide-react";
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
    <Card className="w-full max-w-md p-8 shadow-2xl border border-gray-100">
      <CardHeader className="text-center mb-6">
        <CardTitle className="text-3xl font-extrabold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
          Login
        </CardTitle>
        <p className="text-gray-500 mt-2">Enter your credentials to access your account</p>
      </CardHeader>

      <CardContent>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leadingIcon={<Mail className="w-5 h-5 text-gray-400" />}
             
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="bg-gray-50"
            />
          </div>

          <Button type="submit" className="w-full py-4 text-lg font-semibold hover:scale-105 transition">
            Login
          </Button>

          <p className="text-center text-sm text-blue-600 hover:underline">
            <Link to="/forgot-password">Forgot Password?</Link>
          </p>
        </form>
      </CardContent>

      <div className="mt-8 text-center text-gray-600">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-500 font-semibold hover:underline">
          Signup
        </Link>
      </div>
    </Card>
  </div>
);

  
};

export default LoginForm;
