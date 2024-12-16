"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Dacă utilizatorul nu este autentificat, îl redirecționează la pagina de start
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/"); // Redirecționează la pagina principală
    }
  }, [isAuthenticated, router]);

  // Dacă utilizatorul este autentificat, returnează componentele copil
  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
