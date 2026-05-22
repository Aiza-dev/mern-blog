import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("mern-blog-token"));
  const [loading, setLoading] = useState(true);

  const login = (newToken, userProfile) => {
    localStorage.setItem("mern-blog-token", newToken);
    setToken(newToken);
    setUser(userProfile);
  };

  const logout = () => {
    localStorage.removeItem("mern-blog-token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const currentToken = localStorage.getItem("mern-blog-token");
    if (!currentToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      if (response.data && response.data.user) {
        setUser(response.data.user);
      } else {
        // Clear corrupt state
        logout();
      }
    } catch (err) {
      console.error("Session restoration failed:", err);
      logout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
