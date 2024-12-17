"use client";

import React, { ReactNode, ReactElement, createContext, useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jsonwebtoken"; // Pentru decodarea token-ului

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
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
  const router = useRouter();

  // Funcție pentru validarea token-ului
  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode.decode(token); // Decodare simplă a JWT
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        return false; // Token expirat
      }
      return true;
    } catch (error) {
      return false; // Token invalid
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUserId = localStorage.getItem("userId");

    if (token && savedUserId) {
      if (isTokenValid(token)) {
        setIsAuthenticated(true);
        setUserId(savedUserId);
      } else {
        console.warn("Token invalid or expired, logging out...");
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token && data.userId) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userId", data.userId);
          setIsAuthenticated(true);
          setUserId(data.userId);
          router.push("/admin");
          return true;
        } else {
          console.error("Missing token or userId in response");
          return false;
        }
      } else {
        console.error("Login failed with status:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    setUserId(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
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
