import React, { useState } from 'react';
import axios from '../../api/axiosInstance';
import Organization from './Orignatization';

const CreateDepartmentList = () => {
  const [businessUnitName, setBusinessUnitName] = useState('');
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const [organizationType, setOrganizationType] = useState('');

  const orgRef = localStorage.getItem("orgRef");
  const or_id = localStorage.getItem("id");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!businessUnitName || !orgRef || !or_id || !organizationType) {
      setMessage("❌ Please fill all fields.");
      return;
    }

    const payload = {
      REF: orgRef,
      title: businessUnitName,
      organization_type: organizationType,
      description,
    };

  

    try {
      await axios.post(`/organization/sub-org/${or_id}`, payload);
      setMessage("✅ Business Unit created successfully!");
      setBusinessUnitName('');
      setDescription('');
      setOrganizationType('');
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Create Business Unit
        </h2>

        {message && (
          <div className="mb-4 text-center text-sm font-medium text-red-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Business Unit Name */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Business Unit Name
            </label>
            <input
              type="text"
              value={businessUnitName}
              onChange={(e) => setBusinessUnitName(e.target.value)}
              placeholder="e.g., Raj Darbar Restaurant"
              className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Organization Type */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Organization Type
            </label>
            <input
              type="text"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              placeholder="e.g., Department"
              className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Handles all operations for this BU"
              className="w-full px-4 py-3 border rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-xl font-semibold hover:bg-blue-900 transition"
          >
            Create Business Unit
          </button>
        </form>
      </div>

      <div className="mt-10 max-w-4xl mx-auto">
        <Organization />
      </div>
    </div>
  );
};

export default CreateDepartmentList;
