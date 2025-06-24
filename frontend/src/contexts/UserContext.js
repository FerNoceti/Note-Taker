import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuthStatus = async () => {
      try {
        if (authService.isAuthenticated()) {
          const userData = authService.getUserInfo();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Auth check error:", err);
        setError("Session validation failed");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const userData = await authService.login(username, password);
      setCurrentUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      setError(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username, password) => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.register(username, password);

      const userData = await login(username, password);
      return userData;
    } catch (error) {
      let errorMessage = "Registration failed. Please try again.";

      if (error.response) {
        if (error.response.status === 409) {
          errorMessage = "Username already exists";
        } else if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        }
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
    setIsAuthenticated(false);
    setError(null);
  };

  const value = {
    currentUser,
    isAuthenticated,
    isLoading,
    error,
    login,
    logout,
    register,
    setError,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
