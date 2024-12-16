"use client";

import React, { useState } from "react";

// Lista țărilor din Europa cu codurile ISO
const europeanCountries = [
  { name: "Romania", code: "ro" },
  { name: "Italy", code: "it" },
  // { name: "Germany", code: "de" },
  // { name: "France", code: "fr" },
  // { name: "Spain", code: "es" },
  // { name: "United Kingdom", code: "uk" },
  // { name: "Netherlands", code: "nl" },
  // { name: "Poland", code: "pl" },
  // { name: "Sweden", code: "se" },
  // { name: "Greece", code: "gr" },
  // { name: "Austria", code: "at" },
  // { name: "Belgium", code: "be" },
  // { name: "Bulgaria", code: "bg" },
  // { name: "Croatia", code: "hr" },
  // { name: "Czech Republic", code: "cz" },
  // { name: "Denmark", code: "dk" },
  // { name: "Finland", code: "fi" },
  // { name: "Hungary", code: "hu" },
  // { name: "Ireland", code: "ie" },
  // { name: "Portugal", code: "pt" },
];

const GenerateLink: React.FC = () => {
  // const [amount, setAmount] = useState<string>(""); // Stocăm valoarea sumei
  const [country, setCountry] = useState<string>(""); // Țara selectată
  const [generatedLink, setGeneratedLink] = useState<string>(""); // Link-ul generat

  const handleGenerate = () => {
    // if (amount.trim() === "" || isNaN(Number(amount))) {
    //   alert("Please enter a valid number!");
    //   return;
    // }

    if (!country) {
      alert("Please select a country!");
      return;
    }

    // Obține URL-ul de bază dinamic
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/checkout/?country=${country}`;
    setGeneratedLink(link);
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      // alert("Link copied to clipboard!");
    } else {
      alert("No link to copy!");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold">Generate Checkout Link</h1>
      
      {/* Input pentru sumă */}
      {/* <div className="w-full max-w-md">
        <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
          Enter Amount
        </label>
        <input
          id="amount"
          type="text"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount (e.g., 320)"
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
      </div> */}

      {/* Dropdown pentru țări */}
      <div className="w-full max-w-md">
        <label htmlFor="country" className="block text-sm font-medium text-gray-700">
          Select Country
        </label>
        <select
          id="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="">Select a country</option>
          {europeanCountries.map((country) => (
            <option key={country.code} value={country.code}>
              {country.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buton pentru generare */}
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
      >
        Generate Link
      </button>

      {/* Afișare link generat */}
      {generatedLink && (
        <div className="text-center">
          <p className="text-sm text-gray-500">Generated Link:</p>
          <p className="text-blue-600 underline break-words">{generatedLink}</p>
          <button
            onClick={handleCopy}
            className="mt-2 px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
};

export default GenerateLink;
