"use client";

import { useRouter } from "next/navigation";

import React, { ReactNode, ReactElement, createContext, useState, useContext, useEffect } from "react";



interface AuthContextType {
  user: { id: string; username: string; role: string } | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }): ReactElement => {
  const [user, setUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include cookies
        });
  
        if (response.ok) {
          const data = await response.json();
          setUser(data.user); // Setăm utilizatorul autenticat
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
        setIsAuthenticated(false);
      }
    };
  
    checkAuth();
  }, []);

  const login = async (username: string, password: string) => {
    
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        setUser({ id: data.userId, username: data.username, role: data.role });
        setIsAuthenticated(true);
        router.push("/admin"); // Redirecționează utilizatorul către pagina admin
        return true;
      } else {
        setIsAuthenticated(false);
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      setIsAuthenticated(false);
      return false;
    }
  };
  
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    document.cookie = "token=; Max-Age=0; path=/"; // Șterge cookie-ul
  };
  

  

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
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
