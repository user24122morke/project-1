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
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Pentru succes

  const handleSubmit = async () => {
    setLoading(true);

    try {
      // Simulare delay pentru procesare
      await new Promise((resolve) => setTimeout(resolve, 800000000));

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

      // Succesul plății
      setPaymentSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Payment failed.");
    } finally {
      setLoading(false);
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

      {/* Modal pentru pending sau succes */}
      {(loading || paymentSuccess) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            {loading ? (
              <div className="flex flex-col items-center gap-4">
                 <p className="text-gray-600 mt-4">Processing your payment...</p>
                <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
                <p className="text-gray-600 mt-2">Your payment has been processed successfully.</p>
              </div>
            )}
            <button
              onClick={() => {
                setLoading(false);
                setPaymentSuccess(false);
              }}
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
