import React, { useState } from "react";

const cardPatterns = {
  visa: /^4/,
  mastercard: /^5[1-5]/,
  amex: /^3[47]/,
  discover: /^6(?:011|5)/,
};

const getCardType = (number: string) => {
  if (cardPatterns.visa.test(number)) return "visa";
  if (cardPatterns.mastercard.test(number)) return "mastercard";
  if (cardPatterns.amex.test(number)) return "amex";
  if (cardPatterns.discover.test(number)) return "discover";
  return null;
};

const PaymentInput: React.FC = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Eliminăm non-cifre
    value = value.replace(/(\d{4})/g, "$1 ").trim(); // Spațiere la fiecare 4 cifre
    const type = getCardType(value.replace(/\s/g, ""));
    setCardType(type);
    setCardNumber(value);
    setSelectedMethod(null); // Resetăm metoda dacă introduci un card
  };

  const handleMethodSelect = (method: string) => {
    setSelectedMethod(method);
    setCardNumber("");
    setCardType(null); // Resetăm numărul de card dacă selectezi PayPal/Revolut
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-center text-2xl font-bold mb-4">Payment Method</h2>
      <div className="flex justify-center gap-4 mb-4">
        <button
          type="button"
          onClick={() => handleMethodSelect("paypal")}
          className={`p-2 border rounded ${selectedMethod === "paypal" ? "border-blue-500" : ""}`}
        >
          <img src="/paypal.png" alt="PayPal" className="h-8" />
        </button>
        <button
          type="button"
          onClick={() => handleMethodSelect("revolut")}
          className={`p-2 border rounded ${selectedMethod === "revolut" ? "border-blue-500" : ""}`}
        >
          <img src="/revolut.png" alt="Revolut" className="h-8" />
        </button>
      </div>

      {selectedMethod ? (
        <p className="text-center font-semibold">Selected Method: {selectedMethod.toUpperCase()}</p>
      ) : (
        <div className="relative">
          <label className="block text-gray-700 font-semibold mb-2">Card Number</label>
          <input
            type="text"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            placeholder="1234 5678 9012 3456"
            className="w-full p-2 border rounded pl-4 pr-12"
          />
          {cardType && (
            <img
              src={`/${cardType}.png`}
              alt={cardType}
              className="absolute right-3 top-10 w-8 h-5"
            />
          )}
        </div>
      )}
    </div>
  );
};

export default PaymentInput;
