"use client";

import React, { useState } from "react";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import CardTable from "./Components/CardsTable";
import GenerateLink from "./Components/GenerateLink";


const AdminPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { id, role } = useAuth().user || {};

  
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        {/* Modal */}
        <button
          onClick={openModal}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Generate Link
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg relative">
              <button
                onClick={closeModal}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Generate Link</h2>
              <GenerateLink />
            </div>
          </div>
        )}

        {/* Card Table */}
        <CardTable role={role || ""} userId={id || ""} />
      </div>
    </ProtectedRoute>
  );
};

export default AdminPage;