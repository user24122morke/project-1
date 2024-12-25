"use client";

import { useRouter } from "next/navigation";

import React, { ReactNode, ReactElement, createContext, useState, useContext, useEffect } from "react";



interface AuthContextType {
  user: { id: string; username: string; role: string } | null;
  isAuthenticated: boolean | undefined;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: async () => false,
  logout: () => {},
  loading: true
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }): ReactElement => {
  const [user, setUser] = useState<{ id: string; username: string; role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
        console.log(data);
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
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
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
