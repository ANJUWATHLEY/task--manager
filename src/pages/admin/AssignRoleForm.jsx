// src/pages/AssignRoleForm.jsx
import { useEffect, useState } from "react";
import axios from "../../api/axiosInstance";

const AssignRoleForm = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [role, setRole] = useState("");
  const [department, setDepartment] = useState("");
  const [subOrgUserTable, setSubOrgUserTable] = useState(""); // store sub-org user_table

  const token = localStorage.getItem("token");
  const USERSREF = localStorage.getItem("user_table");
  const orgRef = localStorage.getItem("orgRef");
  
  console.log("🔑 LocalStorage Values →", { token,USERSREF, orgRef });

  // ✅ Fetch only "NEW" role users (Main org users)
  const fetchUsers = async () => {
    try {
      const userRes = await axios.get(`/admin/allemploye/${USERSREF}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const filtered = userRes.data.filter(
        (u) => u.role && u.role.toLowerCase() === "new"
      );

      setUsers(filtered);
    } catch (error) {
      console.error("❌ Error fetching users:", error);
    }
  };

  // ✅ Fetch Departments (Sub-org list)
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`/organization/get-sub-org/${orgRef}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("🏢 Departments API Response:", res.data);
      setDepartments(res.data);
    } catch (error) {
      console.error("❌ Error fetching departments:", error);
    }
  };

  // ✅ Handle Department change → set department id + subOrgUserTable
  const handleDepartmentChange = (e) => {
    const selectedDeptId = e.target.value;
    setDepartment(selectedDeptId);

    const deptData = departments.find((d) => String(d.id) === selectedDeptId);

    if (deptData) {
      // check multiple possible field names
      const userTableRef =
        deptData.user_table || deptData.userTable || deptData.USERSREF;

      if (userTableRef) {
        console.log("📦 Found sub-org user_table:", userTableRef);
        setSubOrgUserTable(userTableRef);
      } else {
        console.warn("⚠️ No user_table field found in deptData:", deptData);
        setSubOrgUserTable("");
      }
    }
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("🎯 Form Values →", {
      selectedUser,
      role,
      department,
      subOrgUserTable,
    });

    if (!selectedUser || !role || !department || !subOrgUserTable) {
      alert("Please fill all fields and select a valid department");
      return;
    }

    const payload = {
      role,
    USERSREF,
     // ✅ backend exact key
      sub_org : subOrgUserTable,
    };

    // console.log("🚀 PUT Request URL:", `/admin/updatemprole/${selectedUser}`);
    console.log(payload);

    try {
      const updateRes = await axios.put(
        `/admin/updatemprole/${selectedUser}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("✅ Role assigned successfully!");
      setSelectedUser("");
      setRole("");
      setDepartment("");
      setSubOrgUserTable("");
      fetchUsers(); // refresh list
    } catch (error) {
      console.error("❌ Error assigning role:", error.response?.data || error);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Assign Role & Department</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Select User */}
        <div>
          <label className="block font-medium mb-1">Select User</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Select Role */}
        <div>
          <label className="block font-medium mb-1">Select Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select --</option>
            <option value="Hr">Hr</option>
            <option value="Manager">Manager</option>
            <option value="Employee">Employee</option>
          </select>
        </div>

        {/* Select Department */}
        <div>
          <label className="block font-medium mb-1">Select Department</label>
          <select
            value={department}
            onChange={handleDepartmentChange}
            className="w-full border rounded p-2"
          >
            <option value="">-- Select --</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>
                {dept.name || dept.businessUnitName}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Assign Role
        </button>
      </form>
    </div>
  );
};

export default AssignRoleForm;
