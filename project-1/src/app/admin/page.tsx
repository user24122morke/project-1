"use client";

import React from "react";
import GenerateLink from "./Components/GenerateLink";
import ProtectedRoute from "../components/ProtectedRoute/ProtectedRoute";


const AdminPage: React.FC = () => {
  return (
    <ProtectedRoute>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <GenerateLink />
    </div>
    </ProtectedRoute>
  );
};

export default AdminPage;
