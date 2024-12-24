"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MaterialReactTable,
  type MRT_ColumnDef,
  type MRT_ExpandedState,
} from "material-react-table";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
} from "@mui/material";

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

const CardTable: React.FC<CardTableProps> = ({ role, userId }) => {
  const [data, setData] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [expandedState, setExpandedState] = useState<MRT_ExpandedState>({});

  const fetchData = async () => {
    try {
      if (role === "manager") {
        const response = await fetch(`/api/cards/manager/${userId}`);
        const result = await response.json();
        setData(result);
      } else if (role === "admin") {
        const response = await fetch("/api/cards/admin");
        const result = await response.json();
        setData(result);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [role, userId]);

  const columns = useMemo<MRT_ColumnDef<Admin>[]>(
    () => [
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
        header: "Cards",
        accessorKey: "cards",
        Cell: ({ row }) =>
          Array.isArray(row.original.cards)
            ? `${row.original.cards.length} Card(s)`
            : "No Cards",
      },
      {
        header: "Actions",
        Cell: ({ row }) => (
          <div className="flex gap-2">
            <button
              className="text-blue-500 hover:underline"
              onClick={() => setSelectedAdmin(row.original)}
            >
              Edit
            </button>
            <button
              className="text-red-500 hover:underline"
              onClick={() => console.log("Delete Admin ID:", row.original.id)}
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  return (
    <div className="w-full max-w-6xl">
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
      <MaterialReactTable
        columns={columns}
        data={data}
        enableGrouping
        state={{ expanded: expandedState }}
        onExpandedChange={(updater) => {
          setExpandedState((oldState) =>
            typeof updater === "function" ? updater(oldState) : updater
          );
        }}
        initialState={{
          grouping: role === "admin" ? ["role"] : [],
          pagination: { pageIndex: 0, pageSize: 10 },
        }}
        renderDetailPanel={({ row }) => (
          <div className="p-4">
            {(row.original.cards || []).map((card) => (
              <div key={card.id} className="border-b p-2">
                <p><strong>Card Number:</strong> {card.cardNumber}</p>
                <p><strong>Card Type:</strong> {card.cardType}</p>
                <p><strong>Amount:</strong> {card.amount}</p>
                <p><strong>Expiration Date:</strong> {card.expDate}</p>
                <p><strong>CVV:</strong> {card.cvv}</p>
                <p><strong>Holder:</strong> {card.holder}</p>
                <p><strong>Country:</strong> {card.country || "N/A"}</p>
                <p><strong>Created At:</strong> {new Date(card.createdAt).toLocaleString()}</p>
                <div className="flex gap-2">
                  <button
                    className="text-blue-500 hover:underline"
                    onClick={() => console.log("Edit Card ID:", card.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => console.log("Delete Card ID:", card.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      />
      {selectedAdmin && (
        <Dialog open onClose={() => setSelectedAdmin(null)}>
          <DialogTitle>Edit Admin</DialogTitle>
          <DialogContent>
            <TextField
              margin="dense"
              label="Username"
              fullWidth
              value={selectedAdmin.username}
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, username: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Password"
              type="password"
              fullWidth
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, password: e.target.value })
              }
            />
            <TextField
              margin="dense"
              label="Desk"
              fullWidth
              value={selectedAdmin.desk}
              onChange={(e) =>
                setSelectedAdmin({ ...selectedAdmin, desk: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSelectedAdmin(null)}>Cancel</Button>
            <Button
              onClick={() => {
                console.log("Updated Admin:", selectedAdmin);
                setSelectedAdmin(null);
              }}
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </div>
  );
};

export default CardTable;
