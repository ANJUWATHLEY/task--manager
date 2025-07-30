import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useParams } from 'react-router-dom';
import { Pencil, Save, Building2, Phone, Mail, Info } from 'lucide-react';

const OrganizationDetails = () => {
  const { orgid } = useParams();
  const [orgData, setOrgData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);

  const fetchOrgData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`/organization/getUser/${orgid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const org = response.data.data[0];
      setOrgData(org);

      // ✅ Store user_table if available
      if (org?.user_table) {
        localStorage.setItem('user_table', org.user_table);
      } else {
        console.warn("user_table not found in organization data.");
      }
    } catch (err) {
      console.error('Failed to fetch organization:', err);
      setError('Unable to fetch organization details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, [orgid]);

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/organization/update/${orgid}`, orgData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Organization updated successfully!');
      setEditMode(false);
    } catch (err) {
      console.error('Update Error:', err);
      alert('Failed to update organization.');
    }
  };

  const handleChange = (e) => {
    setOrgData({ ...orgData, [e.target.name]: e.target.value });
  };

  if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-white rounded-xl shadow-md relative">
      {orgData ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Organization Details</h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <Pencil size={16} /> Edit
              </button>
            )}
          </div>

          <div className="space-y-4 text-gray-700">
            {/* Name */}
            <div className="flex items-center gap-3">
              <Building2 className="text-gray-500" />
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={orgData?.name || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <span className="text-lg">{orgData.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="flex items-center gap-3">
              <Mail className="text-gray-500" />
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={orgData?.email || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <span>{orgData.email}</span>
              )}
            </div>

            {/* Mobile */}
            <div className="flex items-center gap-3">
              <Phone className="text-gray-500" />
              {editMode ? (
                <input
                  type="text"
                  name="mobile"
                  value={orgData?.mobile || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <span>{orgData.mobile}</span>
              )}
            </div>

            {/* Org Type */}
            <div className="flex items-center gap-3">
              <Building2 className="text-gray-500" />
              {editMode ? (
                <input
                  type="text"
                  name="organization_type"
                  value={orgData?.organization_type || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <span>{orgData.organization_type}</span>
              )}
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <Info className="text-gray-500 mt-1" />
              {editMode ? (
                <textarea
                  name="description"
                  value={orgData?.description || ''}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              ) : (
                <p className="text-gray-600">{orgData.description}</p>
              )}
            </div>

            {/* Buttons */}
            {editMode && (
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setEditMode(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  <Save size={16} /> Save Changes
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className="text-gray-600">No organization data found.</p>
      )}
    </div>
  );
};

export default OrganizationDetails;
