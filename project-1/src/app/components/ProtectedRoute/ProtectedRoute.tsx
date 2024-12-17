"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import jwtDecode from "jsonwebtoken";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Verifică validitatea token-ului
  const isTokenValid = (): boolean => {
    const token = localStorage.getItem("authToken");
    if (!token) return false;

    try {
      const decoded: any = jwtDecode.decode(token);
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        return false; // Token expirat
      }
      return true; // Token valid
    } catch (error) {
      console.error("Invalid token:", error);
      return false; // Token invalid
    }
  };

  // Efect pentru redirecționarea utilizatorului
  React.useEffect(() => {
    if (!isAuthenticated || !isTokenValid()) {
      localStorage.removeItem("authToken"); // Curăță tokenul invalid
      router.push("/"); // Redirecționează la pagina principală
    }
  }, [isAuthenticated, router]);

  // Dacă utilizatorul este autentificat și token-ul este valid, returnează componentele copil
  return <>{isAuthenticated && isTokenValid() ? children : null}</>;
};

export default ProtectedRoute;
