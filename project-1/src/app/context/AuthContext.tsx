"use client";

import React, { ReactNode, ReactElement, createContext, useState, useContext, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jsonwebtoken"; // Pentru decodarea tokenului JWT

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }): ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  // Verifică dacă tokenul este valid
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode.decode(token);
      return decoded && decoded.exp * 1000 > Date.now();
    } catch (error) {
      return false;
    }
  };

  // Logout
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null);
    router.push("/");
  }, [router]);

  // Initializează starea la încărcarea paginii
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUserId = localStorage.getItem("userId");
    const savedRole = localStorage.getItem("role");

    if (token && isTokenValid(token)) {
      setIsAuthenticated(true);
      setUserId(savedUserId);
      setRole(savedRole);
    } else {
      logout();
    }
  }, [logout]);

  // Login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token, userId, role } = data;

        // Salvează în localStorage
        localStorage.setItem("authToken", token);
        localStorage.setItem("userId", userId);
        localStorage.setItem("role", role);

        // Actualizează starea
        setIsAuthenticated(true);
        setUserId(userId);
        setRole(role);

        router.push("/admin");
        return true;
      } else {
        console.error("Login failed");
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
