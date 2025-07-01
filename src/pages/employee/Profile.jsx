import { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import EmployeeNavbar from '../../components/EmployeeNavbar';

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axiosInstance.get('/employee/profile');
        setProfile(res.data);
      } catch (err) {
        console.error('❌ Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  return (
    <>
     
      <div className="p-6 bg-gray-50 min-h-screen">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">🙋 My Profile</h2>
        {profile ? (
          <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md border border-gray-200">
            <p className="mb-2">
              <strong>Name:</strong> {profile.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {profile.email}
            </p>
            <p className="mb-2">
              <strong>Role:</strong> {profile.role}
            </p>
          </div>
        ) : (
          <p>Loading profile...</p>
        )}
      </div>
    </>
  );
};

export default Profile;
