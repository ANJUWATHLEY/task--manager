import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { Mail, User, Shield, Hash } from 'lucide-react';

const EmployeeProfile = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem('token');
  const id = localStorage.getItem('id');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`/employe/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Handle response structure
        const data = Array.isArray(res.data) ? res.data[0] : res.data.user || res.data;
        setUser(data);
      } catch (error) {
        console.error('❌ Error loading profile:', error.message);
      }
    };

    fetchProfile();
  }, []);

  if (!user) {
    return (
      <div className="p-6 min-h-screen flex items-center justify-center text-gray-600">
        Loading profile...
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-gradient-to-tr from-purple-100 via-blue-100 to-pink-100">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
        <h2 className="text-3xl font-bold text-purple-700 mb-8 text-center">My Profile</h2>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name */}
          <div className="flex items-start gap-4">
            <div className="bg-purple-600 text-white p-3 rounded-xl">
              <User size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Name</p>
              <p className="text-lg font-semibold">{user.user_name || user.name || 'N/A'}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-4">
            <div className="bg-blue-600 text-white p-3 rounded-xl">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Email</p>
              <p className="text-lg font-semibold break-all">{user.email || 'N/A'}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-4">
            <div className="bg-green-600 text-white p-3 rounded-xl">
              <Shield size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Role</p>
              <p className="text-lg font-semibold capitalize">{user.role || 'N/A'}</p>
            </div>
          </div>

          {/* User ID */}
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500 text-white p-3 rounded-xl">
              <Hash size={24} />
            </div>
            <div>
              <p className="text-gray-500 text-sm">User ID</p>
              <p className="text-lg font-semibold">{user.id || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeProfile;
