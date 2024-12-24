"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated === false) {
      router.push("/"); // Redirecționează la pagina de login
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated === undefined) {
    return <div>Loading...</div>; // Loader pentru verificare
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
