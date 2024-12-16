"use client";

import React from "react";
import SignInForm from "./components/SignInForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-4">Sign In</h1>
        <SignInForm />
      </div>
    </div>
  );
};

export default LoginPage;
