"use client";

import React from "react";
import SignInForm from "./components/SignInForm";

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-md shadow-lg">

        <SignInForm />
      </div>
    </div>
  );
};

export default LoginPage;
