import React from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Users } from "lucide-react";
import { motion } from "framer-motion";

const OrganizationChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] to-[#e0f7fa] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white/70 backdrop-blur-lg border border-white/40 rounded-3xl shadow-2xl p-10 w-full max-w-md"
      >
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2 text-center">Welcome </h1>
        <p className="text-gray-600 text-md text-center mb-6">Choose how you want to get started:</p>

        <div className="space-y-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/create-organization")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#bbf7d0] to-[#f0fdf4] text-green-900 font-medium shadow hover:shadow-lg transition"
          >
            <span className="bg-green-100 p-2 rounded-full">
              <Building2 size={20} className="text-green-700" />
            </span>
            Create New Organization
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/join-organization")}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-gradient-to-r from-[#dbeafe] to-[#e0f2fe] text-blue-900 font-medium shadow hover:shadow-lg transition"
          >
            <span className="bg-blue-100 p-2 rounded-full">
              <Users size={20} className="text-blue-700" />
            </span>
            Join Existing Organization
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default OrganizationChoice;
