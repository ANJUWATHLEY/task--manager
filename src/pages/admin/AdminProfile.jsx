import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { Pencil } from 'lucide-react';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);

  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // Fetch admin detail
  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`/admin/detail/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setAdmin(res.data[0]);
          reset({
            user_name: res.data[0].user_name,
            email: res.data[0].email,
            number: res.data[0].number || '',
          });
        }
      } catch (err) {
        console.error('❌ Error fetching admin detail:', err);
      }
    };
    fetchAdmin();
  }, [id, token, reset]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.put(`/admin/update/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmin({ ...admin, ...data });
      setEditing(false);
      console.log('✅ Updated:', res.data);
    } catch (err) {
      console.error('❌ Update failed:', err);
    }
  };

  if (!admin) return <p className="text-center mt-10">Loading profile...</p>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center text-[#2c1c80]">Admin Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="font-semibold block mb-1">Username</label>
          <input
            type="text"
            disabled={!editing}
            {...register('user_name', { required: 'Username is required' })}
            className={`w-full px-3 py-2 border rounded ${
              errors.user_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.user_name && (
            <p className="text-red-500 text-sm mt-1">{errors.user_name.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold block mb-1">Email</label>
          <input
            type="email"
            disabled={!editing}
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: 'Invalid email address',
              },
            })}
            className={`w-full px-3 py-2 border rounded ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="font-semibold block mb-1">Mobile Number</label>
          <input
            type="text"
            disabled={!editing}
            {...register('number', {
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Enter valid 10-digit mobile number',
              },
            })}
            className={`w-full px-3 py-2 border rounded ${
              errors.number ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.number && (
            <p className="text-red-500 text-sm mt-1">{errors.number.message}</p>
          )}
        </div>

        <div className="text-right mt-4">
          {editing ? (
            <button
              type="submit"
              className="bg-[#2c1c80] text-white px-4 py-2 rounded hover:bg-[#1e1460]"
            >
              Save Changes
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
            >
              <Pencil size={18} /> Edit Profile
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminProfile;
