import React, { useState, useEffect } from 'react';
import axios from '../../api/axiosInstance';
import { Copy, Search, Link } from "lucide-react";

const Organization = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const token = localStorage.getItem('token');
  const USERREF = localStorage.getItem('user_table');
  const orgRef = localStorage.getItem('orgRef');

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    try {
      const res = await axios.get(`/admin/allemploye/${USERREF}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
      setFilteredData(res.data);
    } catch (err) {
      console.error('Error fetching employees:', err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(orgRef);
    alert('Invite link copied!');
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    filterData(query, selectedRole, selectedStatus);
  };

  const handleRoleChange = (e) => {
    const role = e.target.value;
    setSelectedRole(role);
    filterData(searchQuery, role, selectedStatus);
  };

  const handleStatusChange = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    filterData(searchQuery, selectedRole, status);
  };

  const filterData = (query, role, status) => {
    let filtered = [...data];

    if (query) {
      filtered = filtered.filter((item) =>
        item.fullname?.toLowerCase().includes(query)
      );
    }

    if (role !== 'All') {
      filtered = filtered.filter((item) =>
        item.role?.toLowerCase() === role.toLowerCase()
      );
    }

    if (status !== 'All') {
      filtered = filtered.filter((item) =>
        item.status?.toLowerCase() === status.toLowerCase()
      );
    }

    setFilteredData(filtered);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-100 min-h-screen">
      {/* Filters + Invite */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap items-center">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search by name..."
              className="pl-8 pr-2 py-2 border rounded-md w-[200px] outline-purple-400"
            />
          </div>
          <select
            value={selectedRole}
            onChange={handleRoleChange}
            className="p-2 border rounded-md outline-purple-400"
          >
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
          <select
            value={selectedStatus}
            onChange={handleStatusChange}
            className="p-2 border rounded-md outline-purple-400"
          >
            <option value="All">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative w-[280px]">
            <Link className="absolute left-2 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              value={orgRef}
              readOnly
              className="pl-8 pr-2 py-2 border rounded-md w-full bg-gray-50 text-gray-600"
            />
          </div>
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700"
          >
            <Copy size={16} /> Copy
          </button>
          
        </div>
      </div>

      {/* Employee Table View */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 truncate">{item.email}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 capitalize">{item.role}</td>
                  <td className="px-4 py-3 text-sm">
                    <span
                      className={`${
                        item.status === 'active' ? 'text-green-600' : 'text-red-500'
                      } font-semibold`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {item.created_at
                      ? new Date(item.created_at).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })
                      : 'N/A'}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No employees found matching the criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Organization;
