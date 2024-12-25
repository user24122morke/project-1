"use client";

import { useAuth } from "@/app/context/AuthContext";
import React, { useState } from "react";

// Lista țărilor din Europa cu codurile ISO
const europeanCountries = [
  { name: "Romania", code: "ro" },
  { name: "Italy", code: "it" },
];

const GenerateLink: React.FC = () => {
  const { user } = useAuth(); // Get the logged-in user's ID and role
  const [country, setCountry] = useState<string>("");
  const [generatedLink, setGeneratedLink] = useState<string>("");
  const [copyMessage, setCopyMessage] = useState<string>(""); // Pentru mesajul de copiere

  const handleGenerate = () => {
    if (!country) {
      setCopyMessage("Please select a country!");
      return;
    }

    if (!user?.id) {
      setCopyMessage("You must be logged in to generate a link!");
      return;
    }

    // Obține URL-ul de bază dinamic
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
    const link = `${baseUrl}/checkout/${country}/${user.id}`;
    setGeneratedLink(link);
    setCopyMessage(""); // Resetare mesaj
  };

  const handleCopy = () => {
    if (generatedLink) {
      navigator.clipboard.writeText(generatedLink);
      setCopyMessage("Link copied to clipboard!"); // Mesaj de succes
    } else {
      setCopyMessage("No link to copy!");
    }

    // Șterge mesajul după 3 secunde
    setTimeout(() => {
      setCopyMessage("");
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center space-y-4 p-6 bg-white shadow-lg rounded-md">
      <h1 className="text-2xl font-bold">Generate Checkout Link</h1>

      {/* Afișarea Rolului Utilizatorului */}
      <div className="text-sm text-gray-600">
        <p>
          <strong>User Role:</strong> {user?.role || "Unknown"}
        </p>
      </div>

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

      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition"
      >
        Generate Link
      </button>

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

      {/* Mesaj de succes sau eroare */}
      {copyMessage && (
        <p
          className={`mt-2 text-sm ${
            copyMessage === "Link copied to clipboard!" ? "text-green-600" : "text-red-600"
          }`}
        >
          {copyMessage}
        </p>
      )}
    </div>
  );
};

export default GenerateLink;
