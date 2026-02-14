import { createContext, useContext, useState, useEffect } from "react";
import { fetchFromApi } from "../utils/api";

interface User {
  name: string;
  email: string;
  venueManager: boolean;
  avatar?: {
    url: string;
  };
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
  updateAvatar: (url: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("holidaze_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isAuthenticated = !!user;

  async function login(email: string, password: string) {
    const data = await fetchFromApi("/auth/login?_holidaze=true", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    const { accessToken, ...userData } = data.data;

    localStorage.setItem("holidaze_token", accessToken);
    localStorage.setItem("holidaze_user", JSON.stringify(userData));

    setUser(userData);
  }

  async function register(
    name: string,
    email: string,
    password: string,
    venueManager: boolean
  ) {
    await fetchFromApi("/auth/register?_holidaze=true", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        venueManager,
      }),
    });

    // auto login after register
    await login(email, password);
  }

 async function updateAvatar(url: string) {
  if (!user) return;

  const data = await fetchFromApi(
    `/holidaze/profiles/${user.name}?_holidaze=true`,
    {
      method: "PUT",
      body: JSON.stringify({
        avatar: {
          url: url,
        },
      }),
    }
  );

  const updatedUser = data.data;

  localStorage.setItem("holidaze_user", JSON.stringify(updatedUser));
  setUser(updatedUser);
}

    

  function logout() {
    localStorage.removeItem("holidaze_token");
    localStorage.removeItem("holidaze_user");
    setUser(null);
  }

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

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
