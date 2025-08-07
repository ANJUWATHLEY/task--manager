// src/components/BusinessUnitDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';

const BusinessUnitDetails = () => {
  const { id } = useParams();
  const [unit, setUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const orgRef = localStorage.getItem("orgRef");
        const res = await axios.get(`/organization/get-sub-org/${orgRef}`, {
          REF: orgRef,
        });

        const found = res.data.find((u) => u.id === parseInt(id));
        setUnit(found);
      } catch (err) {
        console.error('Error fetching unit:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUnit();
  }, [id]);

  if (loading) return <p className="text-center">Loading...</p>;
  if (!unit) return <p className="text-center text-red-600">Unit not found.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 px-4 py-1 bg-blue-600 text-white rounded shadow"
      >
        ← Back
      </button>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">{unit.name}</h2>
      <p className="mb-2">
        <strong>Type:</strong> {unit.organization_type}
      </p>
      <p className="mb-2">
        <strong>Description:</strong> {unit.description || "No description"}
      </p>
      {/* Add more fields if needed */}
    </div>
  );
};

export default BusinessUnitDetails;
