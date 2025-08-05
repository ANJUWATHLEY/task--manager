import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';

const BusinessUnitList = () => {
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const orgRef = localStorage.getItem("orgRef");
  const or_id = localStorage.getItem("id");

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const res = await axios.post(`/organization/suborg/${or_id}`, {
          REF: orgRef,
        });
        console.log(res)
        setUnits(res.data);
        setLoading(false);
      } catch (err) {
        console.error("❌ Error fetching business units:", err.response?.data || err.message);
        setError("❌ Failed to fetch business units");
        setLoading(false);
      }
    };

    fetchUnits();
  }, [or_id, orgRef]);

  if (loading) return <p className="text-center text-gray-600">Loading business units...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">All Business Units</h3>
      {units.length === 0 ? (
        <p className="text-gray-500">No business units found.</p>
      ) : (
        <table className="w-full border text-sm rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Description</th>
              <th className="p-3 text-left">REF</th>
            </tr>
          </thead>
          <tbody>
            {units.map((unit, index) => (
              <tr key={index} className="border-t">
                <td className="p-3">{unit.title}</td>
                <td className="p-3">{unit.organization_type}</td>
                <td className="p-3">{unit.description}</td>
                <td className="p-3">{unit.REF}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default BusinessUnitList;
