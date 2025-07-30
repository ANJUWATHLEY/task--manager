import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useParams } from 'react-router-dom';
import { Pencil, Plus } from 'lucide-react';

const InviteForm = () => {
  const { id } = useParams(); // orgId agar url me ho
  const [organization, setOrganization] = useState(null);
  const orgRef = localStorage.getItem('orgRef'); // Just invite code

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

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Organization Members</h2>

      {/* 👇 Invite Code Box (Only Code, not full link) */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="bg-gray-100 rounded-lg p-4 sm:flex items-center">
          <label className="text-gray-700 font-medium mr-2 block sm:inline">Invite Code:</label>
          <div className="flex items-center mt-2 sm:mt-0">
            <input
              readOnly
              value={orgRef}
              className="w-full sm:w-64 px-3 py-2 text-sm border rounded-md bg-white"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(orgRef);
                alert('Invite code copied to clipboard!');
              }}
              className="ml-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Optional: Add member button */}
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <Plus size={18} />
          Add Member
        </button>
      </div>

      {/* Organization details below */}
      {organization && (
        <div className="bg-white shadow rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">{organization.name}</h3>
          <p>Email: {organization.email}</p>
          <p>Mobile: {organization.mobile}</p>
          <p>Type: {organization.organization_type}</p>
        </div>
      )}
    </div>
  );
};

export default InviteForm;
