import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useParams } from "react-router-dom";
import { Plus } from "lucide-react";

const InviteForm = () => {
  const { id } = useParams();
  const [organization, setOrganization] = useState(null);
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [showSendOptions, setShowSendOptions] = useState(false);

  const orgRef = localStorage.getItem("orgRef");
  const USERREF = localStorage.getItem("user_table");
  console.log("User Reference:", USERREF);
  const token = localStorage.getItem("token");

  // Fetch users if no departments
  useEffect(() => {
    const fetchUsersIfNoSubOrg = async () => {
      if (departments.length === 0) {
        try {
          const res = await axiosInstance.get(`/admin/allemploye/${USERREF}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          console.log(res.data)
          setUsers(res.data);
        } catch (error) {
          console.error("Failed to load users", error);
        }
      }
    };
    fetchUsersIfNoSubOrg();
  }, [departments, USERREF, token]);

  // Fetch organization details
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axiosInstance.get(`/organization/getUser/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrganization(res.data);
      } catch (error) {
        console.error("Error fetching organization:", error);
      }
    };
    if (id) {
      fetchOrganization();
    }
  }, [id, token]);

  // Send via WhatsApp
  const handleSendWhatsApp = () => {
    const inviteMessage = `Hey! Please join our organization using this code: ${orgRef}`;
    const url = `https://wa.me/?text=${encodeURIComponent(inviteMessage)}`;
    window.open(url, "_blank");
    setShowSendOptions(false);
  };

  // Send via Email
  const handleSendEmail = () => {
    const subject = "Invitation to Join Organization";
    const body = `Hello,\n\nPlease join our organization using this invite code: ${orgRef}`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(mailtoLink, "_blank");
    setShowSendOptions(false);
  };

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Organization Members
      </h2>

      {/* Invite Code Section */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 relative">
        <div>
          <label className="text-gray-700 font-medium block mb-2">
            Invite Code:
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <input
              readOnly
              value={orgRef || ""}
              className="w-full sm:w-64 px-3 py-2 text-sm border rounded-md bg-white"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(orgRef);
                alert("Invite code copied to clipboard!");
              }}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Copy
            </button>
          <div className="flex justify-end">
              <button
                onClick={() => setShowSendOptions(!showSendOptions)}
                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
              >
                <Plus size={18} />
                Add Member
              </button>

              {showSendOptions && (
                <div className="absolute top-full mt-2 w-48 bg-white border rounded-lg shadow-lg z-10">
                  <button
                    onClick={handleSendWhatsApp}
                    className="w-full text-left px-4 py-2 hover:bg-green-50 text-green-600"
                  >
                     Send via WhatsApp
                  </button>
                  <button
                    onClick={handleSendEmail}
                    className="w-full text-left px-4 py-2 hover:bg-yellow-50 text-yellow-600"
                  >
                     Send via Email
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Organization Details */}
      {organization && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {organization.name}
          </h3>
          <p className="text-sm text-gray-600">Email: {organization.email}</p>
          <p className="text-sm text-gray-600">Mobile: {organization.mobile}</p>
          <p className="text-sm text-gray-600">
            Type: {organization.organization_type}
          </p>
        </div>
      )}

      {/* Members Table */}
      {users.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Role
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Join Date
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-sm text-blue-600 font-medium">
                    {user.role || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "N/A"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {users.length === 0 && (
        <p className="text-gray-500 mt-4">No members found.</p>
      )}
    </div>
  );
};

export default InviteForm;
