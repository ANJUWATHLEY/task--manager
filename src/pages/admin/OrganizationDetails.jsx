import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useParams } from 'react-router-dom';

const OrganizationDetails = () => {
  const { orgid } = useParams();
  const [orgData, setOrgData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchOrgData = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      const response = await axios.get(`/organization/getUser/${orgid}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Organization Data:", response.data);
      setOrgData(response.data.data[0]); // 👈 fix here
    } catch (err) {
      console.error("Failed to fetch organization:", err);
      setError("Unable to fetch organization details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, [orgid]);

  if (isLoading) return <div className="p-4 text-gray-600">Loading...</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      {orgData ? (
        <>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{orgData.name}</h2>
          <div className="space-y-2 text-gray-700">
            <p><strong>Email:</strong> {orgData.email}</p>
            <p><strong>Mobile:</strong> {orgData.mobile}</p>
            <p><strong>Type:</strong> {orgData.organization_type}</p>
            <p><strong>Description:</strong> {orgData.description}</p>
            <p><strong>Created At:</strong> {new Date(orgData.created_at).toLocaleString()}</p>
          </div>
        </>
      ) : (
        <p className="text-gray-600">No organization data found.</p>
      )}
    </div>
  );
};

export default OrganizationDetails;
