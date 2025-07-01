// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/axiosInstance';

// const User = () => {
//   const [users, setUsers] = useState([]);
//   const [filterRole, setFilterRole] = useState('all');
//   const [assignedUserIds, setAssignedUserIds] = useState([]);

//   // 🔃 Fetch all users once
//   useEffect(() => {
//     const fetchUsers = async () => {
//       try {
//         const res = await axiosInstance.get('/admin/emplyee');
//         setUsers(res.data);
//       } catch (error) {
//         console.error('❌ Failed to fetch users:', error);
//       }
//     };

//     fetchUsers();
//   }, []); 

//   // 🧠 Assign Task Button Handler
//   const handleAssignTask = async (userId) => {
//     try {
//       const taskData = {
//         title: 'Demo Task',
//         description: 'This is a demo task from frontend',
//         priority: 'Medium',
//         assignedTo: userId, // 👈 your backend should accept this field
//       };

//       await axiosInstance.post('/tasks', taskData);

//       setAssignedUserIds((prev) => [...prev, userId]); // 🔴 Show badge
//     } catch (error) {
//       console.error('❌ Task assignment failed:', error);
//     }
//   };

//   // 🧪 Apply Filter on frontend only
//   const filteredUsers = users.filter(
//     (user) => filterRole === 'all' || user.role === filterRole
//   );

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <h1 className="text-2xl font-bold mb-6 text-gray-800">All Users</h1>

//       {/* 🔽 Role Filter Dropdown */}
//       <select
//         value={filterRole}
//         onChange={(e) => setFilterRole(e.target.value)}
//         className="mb-6 p-2 border rounded-md bg-white"
//       >
//         <option value="all">All</option>
//         <option value="manager">Manager</option>
//         <option value="employee">Employee</option>
//       </select>

//       {/* 👥 User Cards */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {filteredUsers.map((user) => (
//           <div
//             key={user.id}
//             className="relative bg-white shadow-md rounded-2xl p-6 w-full hover:shadow-xl transition-all border border-gray-200"
//           >
//             {/* 🔴 Badge if assigned */}
//             {assignedUserIds.includes(user.id) && (
//               <span className="absolute top-2 right-2 text-xs bg-red-600 text-white px-2 py-1 rounded-full">
//                 Task Assigned
//               </span>
//             )}

//             <h2 className="text-xl font-bold text-gray-800">{user.user_name}</h2>
//             <p className="text-sm text-gray-500 mt-2">
//               Role:{' '}
//               <span className="font-semibold text-blue-600">{user.role}</span>
//             </p>

//             {/* ✅ Assign Task Button */}
          
          
//           <button className=' bg-red-500 py-1 px-8 rounded  '> slect </button>

//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default User;
