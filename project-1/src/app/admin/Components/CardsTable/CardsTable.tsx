"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ExpandedState,
} from "material-react-table";
import EditModal from "../EditModal";
import DeleteModal from "../DeleteModal";

interface Card {
  id: number;
  cardNumber: string;
  cardType: string;
  expDate: string;
  cvv: string;
  holder: string;
  amount: number;
  country: string;
  createdAt: string;
  createdBy: number;
}

interface Admin {
  id: number;
  username: string;
  password: string;
  role: string;
  desk: string;
  cards?: Card[];
}

interface CardTableProps {
  role: string;
  userId: string;
}

const getCookie = (name: string) => {
  const match = document.cookie.match(new RegExp(`(^|;)\\s*${name}=([^;]*)`));
  return match ? decodeURIComponent(match[2]) : null;
};

const CardTable: React.FC<CardTableProps> = ({ role, userId }) => {
  const [adminData, setAdminData] = useState<Admin[]>([]);
  const [cardData, setCardData] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedState, setExpandedState] = useState<MRT_ExpandedState>({});
  const [editData, setEditData] = useState<Admin | Card | null>(null);
  const [deleteData, setDeleteData] = useState<Admin | Card | null>(null);
  
  const fetchData = async () => {
    try {
      if (role === "manager") {
        const response = await fetch(`/api/cards/manager/${userId}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch manager data");
        }
        const cards = await response.json();
        console.log(cards);
        
        setCardData(cards);
      } else if (role === "admin") {
        const response = await fetch("/api/cards/admin", {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch admin data");
        }
        const data = await response.json();
        console.log(data);
        
        setAdminData(data.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, userId]);

  const adminColumns = useMemo<MRT_ColumnDef<Admin>[]>(() => [
    {
      header: "ID",
      accessorKey: "id",
    },
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Desk",
      accessorKey: "desk",
      Cell: ({ row }) => row.original.desk || "N/A",
    },
    {
      header: "Role",
      accessorKey: "role",
      Cell: ({ row }) => row.original.role || "N/A",
    },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <div className="flex space-x-2">
          <button
            onClick={() => setEditData(row.original)}
            className="text-blue-500 underline"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteData(row.original)}
            className="text-red-500 underline"
          >
            Delete
          </button>
        </div>
      ),
    },

  ], []);

  const cardColumns = useMemo<MRT_ColumnDef<Card>[]>(() => [
    {
      header: "Card Number",
      accessorKey: "cardNumber",
    },
    {
      header: "Amount",
      accessorKey: "amount",
    },
    {
      header: "Card Type",
      accessorKey: "cardType",
    },
    {
      header: "Expiration Date",
      accessorKey: "expDate",
    },
    {
      header: "CVV",
      accessorKey: "cvv",
    },
    {
      header: "Holder",
      accessorKey: "holder",
    },
  ], []);

  return (
    <div className={`relative w-full max-w-6xl `}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          {role === "manager" ? "Your Cards" : "Admin Data"}
        </h1>
        <button
          onClick={async () => {
            setLoading(true);
            await fetchData();
            setLoading(false);
          }}
          className={`px-4 py-2 rounded text-white transition ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Refresh Data"}
        </button>
      </div>
      <div
            className={`relative w-full max-w-6xl ${
              editData || deleteData ? "blur-sm pointer-events-none" : ""
            }`}
          >
          {role === "manager" ? (
            <MaterialReactTable
              columns={cardColumns}
              data={cardData}
              initialState={{
                pagination: { pageIndex: 0, pageSize: 10 },
              }}
            />
          ) : (
            <MaterialReactTable
              columns={adminColumns}
              data={adminData}
              state={{ expanded: expandedState }}
              onExpandedChange={(updater) => {
                setExpandedState((oldState) =>
                  typeof updater === "function" ? updater(oldState) : updater
                );
              }}
              renderDetailPanel={({ row }) => (
                <MaterialReactTable
                  columns={cardColumns}
                  data={row.original.cards || []}
                  initialState={{
                    pagination: { pageIndex: 0, pageSize: 5 },
                  }}
                />
              )}
              initialState={{
                pagination: { pageIndex: 0, pageSize: 10 },
              }}
            />
          )}
      </div>
      {editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <EditModal
            data={editData}
            onClose={() => setEditData(null)}
            onSave={(updatedData) => {
              if ("cardNumber" in updatedData) {
                setCardData((prev) =>
                  prev.map((card) =>
                    card.id === updatedData.id ? { ...card, ...updatedData } : card
                  )
                );
              } else {
                setAdminData((prev) =>
                  prev.map((admin) =>
                    admin.id === updatedData.id ? { ...admin, ...updatedData } : admin
                  )
                );
              }
            }}
          />
      </div>
      )}
       {deleteData && (
         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
         <DeleteModal
           data={deleteData}
           onClose={() => setDeleteData(null)}
           onDelete={(deletedId) => {
             if ("cardNumber" in deleteData) {
               setCardData((prev) => prev.filter((card) => card.id !== deletedId));
             } else {
               setAdminData((prev) =>
                 prev.filter((admin) => admin.id !== deletedId)
               );
             }
           }}
         />
       </div>
      )}
    </div>
  );
};

export default CardTable;
