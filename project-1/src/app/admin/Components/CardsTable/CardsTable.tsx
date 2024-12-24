"use client";

import React, { useState, useEffect } from "react";

interface Card {
  id: number;
  cardNumber: string;
  cardType: string;
  expDate: string;
  cvv: string;
  holder: string;
  amount: number;
  createdBy: number;
}

interface Admin {
  id: number;
  username: string;
  role: string;
  cards?: Card[];
}

interface CardTableProps {
  role: string;
  userId: string;
}

const CardTable: React.FC<CardTableProps> = ({ role, userId }) => {
  const [data, setData] = useState<Card[] | Admin[]>([]);
  const [expandedAdmin, setExpandedAdmin] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);


  // Funcția de fetch pentru date
  const fetchData = async () => {
    try {
      if (role === "manager") { 
        console.log({
          message: "manager role we refresh data for a manager"
        });
        
        const response = await fetch(`/api/cards/manager/${userId}`);
        const result = await response.json();
        setData(result);
      } else if (role === "admin") {
        console.log({
          message: 'trebuie sa traga datele de ruta adiminului'
        });
        
        const response = await fetch("/api/cards/admin");
        const result = await response.json();
        console.log({
          message: "datele",
          result
        });
        
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchWithDelay = async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 3000)); // Delay de 3 secunde
      await delay; // Așteaptă delay-ul
      fetchData(); // Apelează fetchData după delay
    };
  
    fetchWithDelay();
  }, [role, userId]);

  return (
    <div className="w-full max-w-6xl">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {role === "manager" ? "Your Cards" : "Admin Data"}
        </h1>
        {/* Buton pentru reîncărcarea datelor */}
        <button
            onClick={async () => {
              setLoading(true); // Activează starea de loading
              await fetchData(); // Fetch-uiește datele
              setLoading(false); // Dezactivează starea de loading după finalizare
            }}
            className={`px-4 py-2 rounded text-white transition ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={loading} // Dezactivează butonul când e loading
          >
            {loading ? "Loading..." : "Refresh Data"}
          </button>
      </div>
      <table className="w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border">ID</th>
            <th className="py-2 px-4 border">Card Number</th>
            <th className="py-2 px-4 border">Card Type</th>
            <th className="py-2 px-4 border">Expiration Date</th>
            <th className="py-2 px-4 border">CVV</th>
            <th className="py-2 px-4 border">Holder</th>
            <th className="py-2 px-4 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {role === "manager" &&
            (data as Card[]).map((card) => (
              <tr key={card.id}>
                <td className="py-2 px-4 border">{card.id}</td>
                <td className="py-2 px-4 border">{card.cardNumber}</td>
                <td className="py-2 px-4 border">{card.cardType}</td>
                <td className="py-2 px-4 border">{card.expDate}</td>
                <td className="py-2 px-4 border">{card.cvv}</td>
                <td className="py-2 px-4 border">{card.holder}</td>
                <td className="py-2 px-4 border">{card.amount}</td>
              </tr>
            ))}

          {role === "admin" &&
            (data as Admin[]).map((admin) => (
              <React.Fragment key={admin.id}>
                <tr
                  className="cursor-pointer hover:bg-gray-200"
                  onClick={() =>
                    setExpandedAdmin(expandedAdmin === admin.id ? null : admin.id)
                  }
                >
                  <td className="py-2 px-4 border">{admin.id}</td>
                  <td className="py-2 px-4 border">{admin.username}</td>
                  <td className="py-2 px-4 border" colSpan={5}>
                    {expandedAdmin === admin.id ? "Hide Cards" : "View Cards"}
                  </td>
                </tr>
                {expandedAdmin === admin.id &&
                  admin.cards?.map((card) => (
                    <tr key={card.id} className="bg-gray-100">
                      <td className="py-2 px-4 border">{card.id}</td>
                      <td className="py-2 px-4 border">{card.cardNumber}</td>
                      <td className="py-2 px-4 border">{card.cardType}</td>
                      <td className="py-2 px-4 border">{card.expDate}</td>
                      <td className="py-2 px-4 border">{card.cvv}</td>
                      <td className="py-2 px-4 border">{card.holder}</td>
                      <td className="py-2 px-4 border">{card.amount}</td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardTable;
