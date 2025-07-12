import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';
import { useForm } from 'react-hook-form';
import { Pencil, User, Mail, Phone, MapPin, VenetianMask ,ArrowLeft} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [editing, setEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null); // local image file
  const navigate = useNavigate();

  const id = localStorage.getItem('id');
  const token = localStorage.getItem('token');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

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
            address: res.data[0].address || '',
            gender: res.data[0].gender || '',
          });
        }
      } catch (err) {
        console.error('❌ Error fetching admin detail:', err);
        toast.error('Failed to load admin profile.');
      }
    };
    fetchAdmin();
  }, []);

  const onSubmit = async (data) => {
    const payload = {
      name: data.user_name?.trim(),
      address: data.address?.trim(),
      gender: data.gender,
    };

    try {
      const res = await axios.put(`/admin/updatedetail/${id}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const updatedAdmin = {
        ...admin,
        user_name: payload.name,
        address: payload.address,
        gender: payload.gender,
      };

      setAdmin(updatedAdmin);
      reset({
        user_name: updatedAdmin.user_name,
        email: updatedAdmin.email,
        number: updatedAdmin.number,
        address: updatedAdmin.address,
        gender: updatedAdmin.gender,
      });

      setEditing(false);
      toast.success('✅ Profile updated successfully!');
    } catch (err) {
      console.error('❌ Update failed:', err);
      toast.error('❌ Failed to update profile.');
    }
  };

  if (!admin) return <p className="text-center mt-10">Loading profile...</p>;

  return (



    
    <div className="max-w-xl mx-auto  bg-white shadow-lg rounded-xl p-5">

 <ArrowLeft
    className="w-5 h-5 text-gray-600 cursor-pointer hover:text-[#2c1c80]"
    onClick={() => navigate(-1)} // or navigate('/admin/dashboard')
  />

      <ToastContainer position="top-right" autoClose={3000} />
      <h2 className="text-2xl font-bold mb-6 text-center text-[#2c1c80]">Admin Profile</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
    

        {/* Username */}
        <div>
          <label className="font-semibold block mb-1 flex items-center gap-2 text-gray-700">
            <User className="w-4 h-4 text-gray-600" />
            Username
          </label>
          <input
            type="text"
            disabled={!editing}
            {...register('user_name', { required: 'Username is required' })}
            className={`w-full px-3 py-2 border rounded transition duration-300 focus:outline-none ${
              editing
                ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-200'
                : 'bg-gray-100 cursor-not-allowed'
            } ${errors.user_name ? 'border-red-500' : ''}`}
          />
          {errors.user_name && (
            <p className="text-red-500 text-sm mt-1">{errors.user_name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold block mb-1 flex items-center gap-2 text-gray-700">
            <Mail className="w-4 h-4 text-gray-600" />
            Email
          </label>
          <input
            type="email"
            disabled
            {...register('email')}
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label className="font-semibold block mb-1 flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-600" />
            Mobile Number
          </label>
          <input
            type="text"
            disabled
            {...register('number')}
            className="w-full px-3 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* Address */}
        <div>
          <label className="font-semibold block mb-1 flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-gray-600" />
            Address
          </label>
          <input
            type="text"
            disabled={!editing}
            {...register('address')}
            className={`w-full px-3 py-2 border rounded transition duration-300 focus:outline-none ${
              editing
                ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-200'
                : 'bg-gray-100 cursor-not-allowed'
            }`}
          />
        </div>

        {/* Gender */}
        <div>
          <label className="font-semibold block mb-1 flex items-center gap-2 text-gray-700">
            <VenetianMask className="w-4 h-4 text-gray-600" />
            Gender
          </label>
          <select
            disabled={!editing}
            {...register('gender')}
            className={`w-full px-3 py-2 border rounded transition duration-300 focus:outline-none ${
              editing
                ? 'bg-white border-blue-500 focus:ring-2 focus:ring-blue-200'
                : 'bg-gray-100 cursor-not-allowed'
            }`}
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="mt-4">
          {editing ? (
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  reset({
                    user_name: admin.user_name,
                    email: admin.email,
                    number: admin.number,
                    address: admin.address,
                    gender: admin.gender,
                  });
                  setEditing(false);
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#2c1c80] text-white px-4 py-2 rounded hover:bg-[#1e1460]"
              >
                Save Changes
              </button>
            </div>
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