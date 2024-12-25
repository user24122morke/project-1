"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated === false) {
      console.log("user nu este autentificat redirecționăm");
      router.push("/"); // Redirecționează doar dacă nu se mai încarcă
    }
  }, [isAuthenticated, loading, router]);

  if (loading) {
    console.log("Loading autentificare...");
    return <div>Loading...</div>; // Loader vizual
  }
  if (isAuthenticated === undefined) {
    return <div>Loading...</div>; // Loader în timp ce verificarea este în desfășurare
  }

  return isAuthenticated ? <>{children}</> : null;
};




export default ProtectedRoute;
