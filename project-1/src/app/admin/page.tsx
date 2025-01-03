"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import CardTable from "./Components/CardsTable";
import GenerateLink from "./Components/GenerateLink";
import { useEffect, useState } from "react";
import LogoutButton from "./Components/Logout";

const AdminPage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Verificare și redirecționare
  useEffect(() => {
    if (!loading && !user) {
      router.push("/"); // Redirecționează utilizatorul neautentificat
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-purple-500"></div>
        <p className="mt-4 text-gray-700 text-lg">Loading, please wait...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }
  console.log(user);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 ">
      <div className=" flex justify-between items-center w-full max-w-4xl -mb-10 px-5 z-10">
        <h1 className=" ">Welcome, <span className="font-bold text-2xl">{user.username}</span></h1>
        <div className="flex space-x-4">
          <LogoutButton />
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Open Generate Link
          </button>
        </div>
      </div>
      <CardTable role={user.role} userId={user.id} />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-4 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
            <h2 className="text-lg font-bold mb-4">Generate Checkout Link</h2>
            <GenerateLink />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
