import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useParams } from 'react-router-dom';
import { Search, Link, Copy, Plus } from 'lucide-react';

const InviteForm = () => {
  const { id } = useParams(); // Organization ID from URL
  const [organization, setOrganization] = useState(null);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false); // Dropdown for Add Member

  const token = localStorage.getItem('token');
  const USERREF = localStorage.getItem('user_table');
  const orgRef = localStorage.getItem('orgRef');

  // Fetch organization by ID
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const res = await axios.get(`/organization/getUser/${id}`);
        setOrganization(res.data);
      } catch (error) {
        console.error('Error fetching organization:', error);
      }
    };
    fetchOrganization();
  }, [id]);

  // Fetch employee list
  useEffect(() => {
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
    getAllData();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(orgRef);
    alert('Invite link copied!');
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = data.filter((item) =>
      item.fullname?.toLowerCase().includes(query)
    );
    setFilteredData(filtered);
  };

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-purple-100 min-h-screen">

      {/* Header and Invite Code Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
        {/* Search */}
        <div className="flex gap-2 items-center">
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
        </div>

        {/* Invite Code and Share Options */}
        <div className="flex flex-wrap items-center gap-3 relative">
          <div className="relative w-[280px]">
            <Link className="absolute left-2 top-2.5 text-gray-500" size={18} />
            <input
              type="text"
              value={orgRef}
              readOnly
              className="pl-8 pr-2 py-2 border rounded-md w-full bg-gray-50 text-gray-600"
            />
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="bg-blue-600 text-white px-3 py-1 rounded-md flex items-center gap-1 hover:bg-blue-700"
          >
            <Copy size={16} /> Copy
          </button>

          {/* Add Member Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              <Plus size={18} />
              Add Member
            </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                <a
                  href={`https://wa.me/?text=You're invited to join our organization! Use this invite code: ${orgRef}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Share via WhatsApp
                </a>
                <a
                  href={`mailto:?subject=Organization Invite&body=You're invited to join our organization. Use this invite code: ${orgRef}`}
                  className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
                >
                  Share via Email
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Organization Details */}
      {organization && (
        <div className="bg-white shadow rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold mb-2">{organization.name}</h3>
          <p>Email: {organization.email}</p>
          <p>Mobile: {organization.mobile}</p>
          <p>Type: {organization.organization_type}</p>
        </div>
      )}

      {/* Employee Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.name}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.email}</td>
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
                <td colSpan="3" className="px-4 py-6 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InviteForm;
