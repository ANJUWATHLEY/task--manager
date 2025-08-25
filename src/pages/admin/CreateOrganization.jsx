// src/pages/admin/CreateOrganization.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axiosInstance";

import { Button } from "../../components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";

// Lucide Icons
import {
  Building2,
  Mail,
  Phone,
  BriefcaseBusiness,
  FileText,
  PlusCircle,
} from "lucide-react";

const CreateOrganization = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();
  const id = localStorage.getItem("id");

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        name,
        email,
        mobile: phone,
        organization_type: type,
        description,
      };

      const res = await axios.post(`/organization/create/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Organization created successfully!");
      localStorage.setItem("orgRef", res.data.ref);
      navigate(`/admin/dashboard`);
    } catch (err) {
      console.error("Create Org Error:", err.response?.data || err.message);
      alert("❌ Failed to create organization. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 px-4">
      <Card className="w-full max-w-lg p-8 shadow-2xl rounded-2xl">
        <CardHeader>
          <CardTitle>
            <h2 className="text-3xl font-bold text-center text-blue-600">
              Create Organization
            </h2>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleCreate} className="space-y-5">
            {/* Org Name */}
            <div>
              <Label htmlFor="name">Organization Name</Label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Building2 className="w-5 h-5 text-blue-500 mr-2" />
                <input
                  id="name"
                  type="text"
                  placeholder="Enter organization name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Mail className="w-5 h-5 text-blue-500 mr-2" />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter organization email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <Phone className="w-5 h-5 text-blue-500 mr-2" />
                <input
                  id="phone"
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  pattern="[0-9]{10}"
                  required
                  className="flex-1 bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <Label htmlFor="type">Organization Type</Label>
              <div className="flex items-center border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <BriefcaseBusiness className="w-5 h-5 text-blue-500 mr-2" />
                <select
                  id="type"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  className="flex-1 bg-transparent outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Sales">Sales</option>
                  <option value="Food">Food</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Education">Education</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <div className="flex items-start border rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
                <FileText className="w-5 h-5 text-blue-500 mr-2 mt-1" />
                <textarea
                  id="description"
                  placeholder="Write something about the organization..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="flex-1 bg-transparent outline-none resize-none"
                />
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full py-3 text-lg font-semibold flex items-center justify-center gap-2"
            >
              <PlusCircle className="w-5 h-5" />
              Create Organization
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateOrganization;
