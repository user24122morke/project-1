"use client";

import React from "react";

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
    cardType?:string
  };
}

const PayButton: React.FC<PayButtonProps> = ({ data }) => {
  const handleSubmit = async () => {
    try {
      const response = await fetch("/api/save-checkout-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save data");

      const result = await response.json();
      alert("Payment successful!");
      console.log(result);
    } catch (error) {
      console.error(error);
      alert("Payment failed.");
    }
  };

  return (
    <button
      type="button"
      onClick={handleSubmit}
      className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
    >
      Pay Now
    </button>
  );
};

export default PayButton;
