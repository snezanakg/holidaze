import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the structure of a user
interface User {
  name: string;
  email: string;
  avatar?: string;
  venueManager: boolean;
}

// Define what the context will provide
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, venueManager: boolean) => Promise<void>;
  logout: () => void;
  updateAvatar: (avatarUrl: string) => Promise<void>;
}

// Create context with undefined as initial state
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // On mount, load stored user & token from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("holidaze_user");
    const storedToken = localStorage.getItem("holidaze_token");

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(storedUser));
        setIsAuthenticated(true);
      } catch (err) {
        console.error("Failed to parse stored user:", err);
        localStorage.removeItem("holidaze_user");
        localStorage.removeItem("holidaze_token");
      }
    }
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      const mockUser: User = {
        name: email.split("@")[0],
        email,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        venueManager: email.includes("manager"),
      };

      const mockToken = "mock_jwt_token_" + Date.now();

      localStorage.setItem("holidaze_user", JSON.stringify(mockUser));
      localStorage.setItem("holidaze_token", mockToken);

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      throw new Error("Login failed. Please check your credentials.");
    }
  };

  // Mock registration function
  const register = async (name: string, email: string, password: string, venueManager: boolean) => {
    if (!email.endsWith("stud.noroff.no")) {
      throw new Error("Only stud.noroff.no email addresses are allowed.");
    }

    try {
      const mockUser: User = {
        name,
        email,
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
        venueManager,
      };

      const mockToken = "mock_jwt_token_" + Date.now();

      localStorage.setItem("holidaze_user", JSON.stringify(mockUser));
      localStorage.setItem("holidaze_token", mockToken);

      setUser(mockUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error(error);
      throw new Error("Registration failed. Please try again.");
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("holidaze_user");
    localStorage.removeItem("holidaze_token");
    setUser(null);
    setIsAuthenticated(false);
  };

  // Update avatar function
  const updateAvatar = async (avatarUrl: string) => {
    if (!user) return;

    try {
      const updatedUser = { ...user, avatar: avatarUrl };
      localStorage.setItem("holidaze_user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to update avatar.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        register,
        logout,
        updateAvatar,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook for consuming the AuthContext
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
