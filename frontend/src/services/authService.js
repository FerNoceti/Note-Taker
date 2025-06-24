import httpClient from "../clients/httpClient";
import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "auth_token";

const refreshClient = httpClient.create({
  baseURL: httpClient.defaults.baseURL,
  headers: httpClient.defaults.headers,
});

const authService = {
  login: async (username, password) => {
    try {
      const response = await httpClient.post("/login", { username, password });
      const { token } = response.data;

      // Store the token
      localStorage.setItem(TOKEN_KEY, token);

      return jwtDecode(token);
    } catch (error) {
      console.error("Login error:", error);
      throw error.response?.data || { error: "Login failed" };
    }
  },

  register: async (username, password) => {
    try {
      const response = await httpClient.post("/register", {
        username,
        password,
      });

      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw error.response?.data || { error: "Registration failed" };
    }
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    window.location.href = "/login";
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated: () => {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  },

  getUserInfo: () => {
    const token = authService.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      return null;
    }
  },

  refreshToken: async () => {
    try {
      const token = authService.getToken();
      if (!token) throw new Error("No token available");

      const response = await refreshClient.post("/refresh-token", { token });
      const { newToken } = response.data;

      localStorage.setItem(TOKEN_KEY, newToken);
      return jwtDecode(newToken);
    } catch (error) {
      console.error("Token refresh error:", error);
      authService.logout();
      throw error;
    }
  },
};

export default authService;
