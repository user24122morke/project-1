"use client";

import React from "react";

interface DeleteModalProps {
  data: { id: number; username?: string; cardNumber?: string }; // Data for the item to be deleted
  onClose: () => void; // Close the modal
  onDelete: (deletedId: number) => void; // Handle deletion in the parent component
}

const DeleteModal: React.FC<DeleteModalProps> = ({ data, onClose, onDelete }) => {
  const handleDelete = async () => {
    try {
      const endpoint = data.username
        ? `/api/admins/${data.id}` // If it's an admin
        : `/api/cards/${data.id}`; // If it's a card

      const response = await fetch(endpoint, {
        method: "DELETE",
        credentials: "include", // Include the authentication cookie
      });

      if (!response.ok) throw new Error("Failed to delete item");

      onDelete(data.id); // Update parent state after deletion
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Confirm Delete</h2>
        <p className="mb-4">
          Are you sure you want to delete{" "}
          <span className="font-bold">
            {data.username || `Card #${data.cardNumber}`}
          </span>
          ?
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
