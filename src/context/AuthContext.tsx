import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiRequest } from "../utils/api";

interface User {
  name: string;
  email: string;
  avatar?: string;
  venueManager: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    venueManager: boolean
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("holidaze_user");
    const storedToken = localStorage.getItem("holidaze_token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const userData: User = {
      name: data.name,
      email: data.email,
      avatar: data.avatar?.url || "",
      venueManager: data.venueManager,
    };

    localStorage.setItem("holidaze_user", JSON.stringify(userData));
    localStorage.setItem("holidaze_token", data.accessToken);

    setUser(userData);
    setIsAuthenticated(true);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    venueManager: boolean
  ) => {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, venueManager }),
    });
  };

  const logout = () => {
    localStorage.removeItem("holidaze_user");
    localStorage.removeItem("holidaze_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
