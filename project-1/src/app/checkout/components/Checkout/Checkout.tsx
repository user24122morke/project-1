"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import PaymentInput from "../PaymentInput";
import PayButton from "../PayButton";
import Image from "next/image";

const cardLogos: { [key: string]: string } = {
  visa: "/visa.png",
  mastercard: "/mastercard.png",
  revolut: "/revolut.svg",
  paypal: "/paypal.png",
  default: "/plus.svg", // Logo implicit pentru necunoscut
};


const Checkout: React.FC = () => {
  const params = useParams();
  const { country, userId } = params;
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [cardType, setCardType] = useState<string>("default");

  const detectCardType = (number: string) => {
    if (/^4/.test(number)) return "visa"; // Visa
    if (/^5[1-5]/.test(number) || /^2(2[2-9]|[3-6]\d|7[0-1])/.test(number)) return "mastercard"; // Mastercard
    if (/^3[47]/.test(number)) return "amex"; // Amex
    return "default"; // Necunoscut
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Eliminăm non-cifre
    value = value.replace(/(.{4})/g, "$1 ").trim(); // Adăugăm spațiu la fiecare 4 cifre
    setCardNumber(value);
    setCardType(detectCardType(value.replace(/\s/g, "")));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/[^\d]/g, "");
    if (value.length > 2) {
      value = `${value.slice(0, 2)}/${value.slice(2, 4)}`;
    }
    const month = value.slice(0, 2);
    if (month && (parseInt(month, 10) < 1 || parseInt(month, 10) > 12)) {
      setError("Invalid expiry date"); 
    } else {
      setError("");
    }
    setExpiry(value);
  };
  
  

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3); // Max 3 cifre
    setCvv(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<string>>) => {
    const value = e.target.value.replace(/[^a-zA-Z ]/g, ""); // Doar litere
    setter(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Eliminăm non-cifre
    setAmount(value);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg mt-8">
      <h1 className="text-2xl font-bold text-center mb-4">Checkout Page</h1>
      {/* Metode de Plată */}
      <div className="flex justify-center items-center gap-4 mb-4">
      <Image
        src="/visa.png" // Imagină din directorul public
        alt="Visa"
        width={32}
        height={32}
      />
      <Image
        src="/mastercard.png"
        alt="Mastercard"
        width={32}
        height={32}
      />
      <Image
        src="/revolut.svg"
        alt="Revolut"
        width={32}
        height={32}
      />
      <Image
        src="/paypal.png"
        alt="PayPal"
        width={40}
        height={50}
      />
      </div>
      {/* Formular */}
      <form className="space-y-4">
        {/* Card Number */}
        <div>
          <label className="block text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className="w-full border p-2 pl-4 pr-12 rounded-md  "
              
            />
            {/* Logo-ul cardului detectat (doar dacă există cifre în input) */}
            {cardNumber && (
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2 ">
                <Image
                  src={cardLogos[cardType]} // Detectare card
                  alt="Card Logo"
                  width={40} // Specificăm dimensiuni pentru optimizare
                  height={40}
                  className="h-auto w-10"
                />
              </div>
            )}
          </div>
        </div>


        {/* Expiry & CVV */}
        <div className="flex gap-4">
          <div className="w-1/2">
            <label className="block text-gray-700">Expiry (MM/YY)</label>
            <input
              type="text"
              value={expiry}
              onChange={handleExpiryChange}
              maxLength={5}
              placeholder="MM/YY"
              className={`w-full p-2 border rounded ${
                error ? "border-red-500" : "border-gray-300"
              }`}
            />
             {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          <div className="w-1/2">
            <label className="block text-gray-700">CVV</label>
            <input
              type="text"
              value={cvv}
              onChange={handleCvvChange}
              placeholder="123"
              className="w-full border p-2 rounded"
            />
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => handleNameChange(e, setFirstName)}
            placeholder="John"
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => handleNameChange(e, setLastName)}
            placeholder="Doe"
            className="w-full border p-2 rounded"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-gray-700">Amount (EUR)</label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            placeholder="250"
            min="250"
            className="w-full border p-2 rounded"
          />
          {amount && parseFloat(amount) < 250 && (
            <p className="text-red-500 text-sm">Amount cannot be less than 250 EUR</p>
          )}
        </div>

        {/* Submit Button */}
        <PayButton 
          data={{
            cardNumber,
            expiry,
            cvv,
            firstName,
            lastName,
            amount,
            userId,
            country,
            cardType
          }}
        />
      </form>
    </div>
  );
};

export default Checkout;
