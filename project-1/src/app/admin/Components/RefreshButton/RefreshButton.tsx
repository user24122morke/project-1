import React, { useState } from "react";

interface RefreshButtonProps {
  onRefresh: () => Promise<void>;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ onRefresh }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await onRefresh(); // Apelează funcția transmisă din props
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`px-4 py-2 rounded text-white transition ${
        loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
      }`}
      disabled={loading}
    >
      {loading ? "Refreshing..." : "Refresh Data"}
    </button>
  );
};

export default RefreshButton;
