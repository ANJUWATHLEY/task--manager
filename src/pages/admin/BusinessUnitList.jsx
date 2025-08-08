import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import CreateDepartmentList from './CreateDepartmentList'; // Your modal component

const UnitDescription = ({ description }) => {
  const [showFullDesc, setShowFullDesc] = useState(false);

  const toggleDescription = () => {
    setShowFullDesc((prev) => !prev);
  };

  const text = description || "No description provided.";
  const isLong = text.length > 130;

  return (
    <p className="text-sm text-gray-600">
      <span className="font-semibold text-gray-900">Description:</span>{' '}
      {showFullDesc || !isLong ? text : `${text.substring(0, 130)}... `}
      {isLong && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleDescription();
          }}
          className="text-blue-600 hover:underline ml-1"
        >
          {showFullDesc ? 'Show less' : 'Read more'}
        </button>
      )}
    </p>
  );
};

const BusinessUnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const orgRef = localStorage.getItem("orgRef");
  const or_id = localStorage.getItem("id");
  const navigate = useNavigate();

  const fetchUnits = async () => {
    try {
      const res = await axios.get(`/organization/get-sub-org/${orgRef}`, {
        REF: orgRef,
      });
      setUnits(res.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching business units:", err.response?.data || err.message);
      setError("❌ Failed to fetch business units");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUnits();
  }, [or_id, orgRef]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg shadow-sm transition"
        >
          ← Back
        </button>
      </div>

      {/* Create Button */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-lg shadow-md transition"
        >
          <Building2 size={18} />
          Create Department
        </button>
      </div>

      {/* Modal */}
      <CreateDepartmentList
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUnits}
      />

      {/* Page Title */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Department</h2>

      {/* States */}
      {loading ? (
        <div className="text-center text-gray-500 py-10">Loading business units...</div>
      ) : error ? (
        <div className="text-center text-red-600 py-10">{error}</div>
      ) : units.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No business units found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.map((unit) => (
            <div
              key={unit.id}
              onClick={() => navigate(`/business-unit/${unit.id}`)}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-500 transform hover:scale-[1.02] transition-all duration-300 ease-in-out cursor-pointer"
            >
              <h4 className="text-xl font-bold text-blue-800 mb-2">{unit.name}</h4>

              <div className="text-sm text-gray-700 mb-2">
                <span className="font-medium text-gray-900">Type:</span> {unit.organization_type}
              </div>

              <UnitDescription description={unit.description} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessUnitList;
