"use client"

import React, { useState } from "react";
import { useParams } from "next/navigation";
import PayButton from "../PayButton";
import Image from "next/image";
import CheckoutLogo from "../../CheckoutLogo";

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

  const handleNameChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value.replace(/[^a-zA-Z ]/g, ""); // Doar litere
    setter(value);
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, ""); // Eliminăm non-cifre
    setAmount(value);
  };

  const isFormValid =
    cardNumber.replace(/\s/g, "").length === 16 &&
    expiry.length === 5 &&
    cvv.length === 3 &&
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    parseFloat(amount) >= 250 &&
    !error;

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-lg mt-8">
      <CheckoutLogo />
      <div className="flex justify-center items-center gap-4 mb-4">
        <Image src="/visa.png" alt="Visa" width={32} height={32} />
        <Image src="/mastercard.png" alt="Mastercard" width={32} height={32} />
        <Image src="/revolut.svg" alt="Revolut" width={32} height={32} />
        <Image src="/paypal.png" alt="PayPal" width={40} height={50} />
      </div>
      <form className="space-y-4">
        <div>
          <label className="block text-gray-700 mb-1">Card Number</label>
          <div className="relative">
            <input
              type="text"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              placeholder="1234 5678 9012 3456"
              className="w-full border p-2 pl-4 pr-12 rounded-md"
            />
            {cardNumber && (
              <div className="absolute top-1/2 right-3 transform -translate-y-1/2">
                <Image
                  src={cardLogos[cardType]}
                  alt="Card Logo"
                  width={40}
                  height={40}
                  className="h-auto w-10"
                />
              </div>
            )}
          </div>
        </div>

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
            cardType,
          }}
          disabled={!isFormValid} // Dezactivăm butonul dacă formularul nu este valid
        />
      </form>
    </div>
  );
};

export default Checkout;
