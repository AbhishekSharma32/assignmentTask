import React, { createContext, useContext, useState, useEffect } from "react";

// Import authService with a fallback
let authService;
try {
  authService = require("../services/authService").default;
} catch (error) {
  console.error("authService not found, using fallback");
  // Fallback implementation
  authService = {
    getCurrentUser: () => {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    },
    login: async (username, password) => {
      // Mock implementation
      if (username === "admin" && password === "admin123") {
        const user = { id: 1, username: "admin", role: "admin" };
        const token = "mock-jwt-token-admin";

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        return { success: true, user, token };
      }
      throw new Error("Invalid credentials");
    },
    logout: () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    isAuthenticated: () => !!localStorage.getItem("token"),
  };
}

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if authService exists before using it
    if (authService && authService.getCurrentUser) {
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      if (!authService || !authService.login) {
        throw new Error("Authentication service not available");
      }
      const response = await authService.login(username, password);
      setUser(response.user);
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    if (authService && authService.logout) {
      authService.logout();
    }
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
