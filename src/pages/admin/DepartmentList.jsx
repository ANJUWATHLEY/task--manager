import React, { useEffect, useState } from 'react';
import axios from '../../api/axiosInstance';

const DepartmentList = () => {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState('');

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    const res = await axios.get('/department');
    setDepartments(res.data);
  };

  const handleAdd = async () => {
    await axios.post('/department', { name: newDept });
    setNewDept('');
    fetchDepartments();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/department/${id}`);
    fetchDepartments();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Departments</h2>
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Enter Department Name"
          value={newDept}
          onChange={(e) => setNewDept(e.target.value)}
          className="border px-3 py-1 rounded"
        />
        <button onClick={handleAdd} className="bg-blue-500 text-white px-4 py-1 rounded">Add</button>
      </div>
      <ul className="list-disc ml-6">
        {departments.map((dept) => (
          <li key={dept.id} className="flex justify-between items-center">
            <span>{dept.name}</span>
            <button onClick={() => handleDelete(dept.id)} className="text-red-600 text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DepartmentList;
