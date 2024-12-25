"use client";

import React, { useState } from "react";

interface EditModalProps {
  data: { id: number; username?: string; password?: string; desk?: string }; // Fields to edit
  onClose: () => void;
  onSave: (updatedData: any) => void; // Notify parent of the updated data
}

const EditModal: React.FC<EditModalProps> = ({ data, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<typeof data>>({}); // Store only the changed fields
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    // Asigură TypeScript că `name` este o cheie validă din `formData`
    setFormData((prev) => {
      if (prev[name as keyof typeof prev] === value) {
        return prev; // Dacă valoarea nu s-a schimbat, returnează aceeași stare
      }
  
      return { ...prev, [name]: value }; // Actualizează doar câmpul modificat
    });
  };
  
  

  const handleSubmit = async () => {
    setLoading(true);
    const payload = { ...formData, id: data.id }
    try {
      const response = await fetch(`/api/admins/${data.id}`, {
        method: "PATCH", // Use PATCH for partial updates
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Failed to update data");

      const updatedData = await response.json();
      onSave(updatedData); // Update the parent component with the new data
      onClose(); // Close the modal
    } catch (error) {
      console.error("Error updating data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-semibold mb-4">Edit Details</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              defaultValue={data.username || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Desk
            </label>
            <input
              type="text"
              name="desk"
              defaultValue={data.desk || ""}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`px-4 py-2 bg-blue-500 text-white rounded-md ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
            }`}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditModal;
