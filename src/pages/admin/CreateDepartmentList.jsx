import React, { useState } from 'react';
import axios from '../../api/axiosInstance';

const CreateDepartmentList = ({ isOpen, onClose, onSuccess }) => {
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
 
  console.table(payload); 




    try {
      await axios.post(`/organization/sub-org/${or_id}`, payload);
      setMessage("✅ Business Unit created successfully!");
      setBusinessUnitName('');
      setDescription('');
      setOrganizationType('');
      onSuccess(); // Refresh business units in parent
      onClose();   // Close modal
    } catch (error) {
      console.error("❌ API Error:", error.response?.data || error.message);
      setMessage("❌ Something went wrong. Please try again.");
    }
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-800 text-xl font-bold"
        >
          ×
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Create Business Unit
        </h2>

        {/* Error/Success Message */}
        {message && (
          <div className="mb-4 text-center text-sm font-medium text-red-600">
            {message}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">Business Unit Name</label>
            <input
              type="text"
              value={businessUnitName}
              onChange={(e) => setBusinessUnitName(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Finance Department"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Organization Type</label>
            <input
              type="text"
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
              placeholder="e.g., Department"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-400"
              placeholder="Add short details about the department"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-900 transition"
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateDepartmentList;
