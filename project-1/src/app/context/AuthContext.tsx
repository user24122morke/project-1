"use client"
import React, {
  ReactNode,
  ReactElement,
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import jwtDecode from "jsonwebtoken"; // Pentru decodarea token-ului

interface AuthContextType {
  isAuthenticated: boolean;
  userId: string | null;
  role: string | null; // Adăugat rolul
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({
  children,
}): ReactElement => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null); // Stare pentru rol
  const router = useRouter();

  const isTokenValid = (token: string): boolean => {
    try {
      const decoded: any = jwtDecode.decode(token);
      if (!decoded || decoded.exp * 1000 < Date.now()) {
        return false;
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  // Folosim useCallback pentru a stabiliza funcția logout
  const logout = useCallback(() => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
    setUserId(null);
    setRole(null); // Reset rol
    router.push("/");
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const savedUserId = localStorage.getItem("userId");
    const savedRole = localStorage.getItem("role");

    if (token && savedUserId && savedRole) {
      if (isTokenValid(token)) {
        setIsAuthenticated(true);
        setUserId(savedUserId);
        setRole(savedRole); // Setează rolul din localStorage
      } else {
        console.warn("Token invalid or expired, logging out...");
        logout();
      }
    }
  }, [logout]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();

        if (data.token && data.userId && data.role) {
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("role", data.role); // Salvează rolul
          setIsAuthenticated(true);
          setUserId(data.userId);
          setRole(data.role); // Setează rolul în context
          router.push("/admin");
          return true;
        } else {
          console.error("Missing token, userId, or role in response");
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