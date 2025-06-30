import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';


const User = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axiosInstance.get('/admin/emplyee');
        console.log(res.data);
        
        setUsers(res.data); 
      } catch (error) {
        console.error('❌ Failed to fetch users:', error);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">All Employees</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-2xl p-6 w-full hover:shadow-xl transition-all border border-gray-200"
          >
            <h2 className="text-xl font-bold text-gray-800">{user.user_name}</h2>
            <p className="text-sm text-gray-500 mt-2">
              Role:{' '}
              <span className="font-semibold text-blue-600">{user.role}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default User;
