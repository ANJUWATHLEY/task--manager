import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';

const BusinessUnitDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    organization_type: '',
    description: '',
  });

  const orgRef = localStorage.getItem("orgRef");

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const res = await axios.get(`/organization/get-sub-org/${orgRef}`, {
          headers: { REF: orgRef }
        });
    console.log(res)
        const found = res.data.find((u) => u.id === parseInt(id));
        setUnit(found);

        setFormData({
          title: found?.name || '',
          organization_type: found?.organization_type || '',
          description: found?.description || '',
        });
      } catch (err) {
        console.error('Error fetching unit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id, orgRef]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Are you sure you want to delete this Business Unit?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/organization/suborg/${id}`, {
        data: { REF: orgRef }
      });

      alert("✅ Business Unit deleted successfully.");
      navigate(-1);
    } catch (err) {
      console.error("❌ Delete failed:", err.response?.data || err.message);
      alert("❌ Failed to delete the unit.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title: formData.title,
      organization_type: formData.organization_type,
      description: formData.description,
      REF: orgRef
    };

    console.log("📤 Submitting payload:", payload);

    try {
      const res = await axios.put(`/organization/update-suborg/${id}`, payload);

      console.log("✅ Update success:", res.data);
      alert("✅ Business Unit updated successfully.");

      setEditMode(false);
      setUnit({
        ...unit,
        name: formData.title,
        organization_type: formData.organization_type,
        description: formData.description,
      });

    } catch (err) {
      console.error("❌ Update failed:", err.response?.data || err.message);
      alert("❌ Update failed: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (!unit) return <p className="text-center text-red-600">Unit not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded shadow"
      >
        ← Back
      </button>

      {editMode ? (
        <form onSubmit={handleUpdateSubmit} className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Edit Business Unit</h2>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Organization Type</label>
            <input
              type="text"
              name="organization_type"
              value={formData.organization_type}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded shadow"
            >
              ✅ Save Changes
            </button>

            <button
              type="button"
              onClick={() => setEditMode(false)}
              className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded shadow"
            >
              ❌ Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">{unit.name}</h2>
          <p className="mb-2"><strong>Type:</strong> {unit.organization_type}</p>
          <p className="mb-4"><strong>Description:</strong> {unit.description || "No description"}</p>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setEditMode(true)}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded shadow"
            >
              ✏️ Edit
            </button>

            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded shadow"
            >
              🗑️ Delete
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessUnitDetails;
