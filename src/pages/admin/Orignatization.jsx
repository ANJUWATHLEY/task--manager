import React, { useState, useEffect } from "react";
import axios from "../../api/axiosInstance";
import { Plus, Search, ChevronDown, ChevronUp, LogIn } from "lucide-react";

function Organization() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [inviteLink, setInviteLink] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [showActions, setShowActions] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const orgid = localStorage.getItem("orgRef");

  const getAllData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`/organization/getUser/${orgid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(response.data);
      
      setData(response.data);

      setFilteredData(response.data);
      setInviteLink("/invite/abc123");
    } catch (err) {
      setError("Failed to load organization data");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    let results = data.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortConfig.key) {
      results.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredData(results);
    setCurrentPage(1);
  }, [searchTerm, sortConfig, data]);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} />
    ) : (
      <ChevronDown size={16} />
    );
  };

  const toggleActions = (id) => {
    setShowActions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCopyLink = (link) => {
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  if (isLoading)
    return <div className="text-center py-12">Loading members...</div>;
  if (error)
    return <div className="text-center py-12 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Organization Members
          </h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and permissions
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="bg-gray-100 rounded-lg p-3">
            <span className="font-medium text-gray-700">Invite Link:</span>{" "}
            <div className="flex items-center mt-1">
              <a
                href={inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline text-sm truncate max-w-xs"
              >
                {inviteLink}
              </a>
              <button
                onClick={() => handleCopyLink(inviteLink)}
                className="ml-2 text-gray-500 hover:text-gray-700"
              >
                Copy
              </button>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition h-fit">
            <Plus size={18} />
            <span className="whitespace-nowrap">Add Member</span>
          </button>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search members by name or email..."
            className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Member</option>
          </select>
          <select className="border rounded-md px-3 py-2 text-sm">
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
          </select>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th
                className="text-left p-4 font-semibold text-sm text-gray-700 cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center gap-1">
                  Name
                  {getSortIcon("name")}
                </div>
              </th>
              <th
                className="text-left p-4 font-semibold text-sm text-gray-700 cursor-pointer"
                onClick={() => handleSort("email")}
              >
                <div className="flex items-center gap-1">
                  Email
                  {getSortIcon("email")}
                </div>
              </th>
              <th className="text-left p-4 font-semibold text-sm text-gray-700">
                Role
              </th>
              <th className="text-left p-4 font-semibold text-sm text-gray-700">
                Status
              </th>
              <th className="text-left p-4 font-semibold text-sm text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="p-4">
                  <div className="flex items-center">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
                    <div className="ml-3">
                      <div className="font-medium text-gray-900">
                        {item.name}
                      </div>
                      <div className="text-gray-500 text-sm">
                        Joined: 12 Jan 2023
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-900">{item.email}</td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {item.role || "Member"}
                  </span>
                </td>
                <td className="p-4">
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                    Active
                  </span>
                </td>
                <td className="p-4 relative">
                  <button
                    onClick={() => toggleActions(item.id)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    •••
                  </button>

                  {showActions[item.id] && (
                    <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border">
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        View Profile
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        Edit Role
                      </button>
                      <button className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100">
                        Remove Member
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto" />
            <h3 className="mt-4 font-medium text-gray-900">No members found</h3>
            <p className="mt-1 text-gray-500">
              Try adjusting your search or filter
            </p>
          </div>
        ) : null}
      </div>

      {/* Pagination */}
      {filteredData.length > itemsPerPage && (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-6 gap-4">
          <div className="text-sm text-gray-700">
            Showing {indexOfFirstItem + 1} to{" "}
            {Math.min(indexOfLastItem, filteredData.length)} of{" "}
            {filteredData.length} members
          </div>
          <div className="flex space-x-1">
            <button
              onClick={() => currentPage > 1 && paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Previous
            </button>

            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => paginate(number + 1)}
                className={`px-3 py-1 rounded-md ${
                  currentPage === number + 1
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {number + 1}
              </button>
            ))}

            <button
              onClick={() =>
                currentPage < totalPages && paginate(currentPage + 1)
              }
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Organization;
