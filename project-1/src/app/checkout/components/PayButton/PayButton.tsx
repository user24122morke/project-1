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
}

const PayButton: React.FC<PayButtonProps> = ({ data }) => {
  const [loading, setLoading] = useState(false); // Pentru a afișa procesarea
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Pentru a afișa modalul de succes

  const handleSubmit = async () => {
    setLoading(true); // Începe procesarea

    try {
      // Adaugă un delay de 4 secunde
      await new Promise((resolve) => setTimeout(resolve, 4000));

      const response = await fetch("/api/save-checkout-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to save data");

      const result = await response.json();
      console.log(result);

      // Dacă totul e ok, arată modalul de succes
      setPaymentSuccess(true);
    } catch (error) {
      console.error(error);
      alert("Payment failed.");
    } finally {
      setLoading(false); // Oprește procesarea
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={loading} // Dezactivează butonul în timpul procesării
        className={`w-full py-2 rounded ${
          loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
        }`}
      >
        {loading ? "Processing Payment..." : "Pay Now"}
      </button>

      {/* Modalul de succes */}
      {paymentSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600">Payment Successful!</h2>
            <p className="text-gray-600 mt-2">Your payment has been processed successfully.</p>
            <button
              onClick={() => setPaymentSuccess(false)} // Închide modalul
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
