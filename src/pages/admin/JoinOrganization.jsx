import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';

const JoinOrganization = () => {
  const [inviteCode, setInviteCode] = useState('');
  const [role, setRole] = useState('employee'); // Default: employee
  const navigate = useNavigate();
  const id = localStorage.getItem('id');

  const handleJoin = async (e) => {
    e.preventDefault();

    if (!inviteCode || !role) {
      alert('Please enter invite code and select role.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(`/employe/${inviteCode}`, 
        { id, role }, // send role too if needed in backend
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert('Successfully joined organization!');

      if (role === 'manager') {
        navigate('/manager/dashboard');
      } else {
        navigate('/employee/dashboard');
      }

    } catch (err) {
      console.error('Join Error:', err.response?.data || err.message);
      alert('Failed to join organization. Please check your invite code.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 px-4">
      <form
        onSubmit={handleJoin}
        className="w-full max-w-md bg-white p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
          Join Organization
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-semibold mb-2 text-gray-700">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg bg-gray-50"
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Enter Invite Code"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            required
            className="w-full px-4 py-3 border rounded-lg bg-gray-50"
          />

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition"
          >
            Join
          </button>
        </div>
      </form>
    </div>
  );
};

export default JoinOrganization;
