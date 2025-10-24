import axios from "axios"; // Use plain axios for auth endpoints

const API_URL = "http://localhost:3000/api/auth";

// ========================================
// TOKEN MANAGEMENT
// ========================================

// Store token in localStorage
export const setToken = (token) => {
  localStorage.setItem("token", token);
  localStorage.setItem("tokenTimestamp", Date.now().toString());
};

// Get token from localStorage
export const getToken = () => {
  return localStorage.getItem("token");
};

// Check if token is expired (client-side check)
export const isTokenExpired = () => {
  const timestamp = localStorage.getItem("tokenTimestamp");
  if (!timestamp) return true;

  const tokenAge = Date.now() - parseInt(timestamp);
  const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  return tokenAge > maxAge;
};

// ========================================
// USER MANAGEMENT
// ========================================

// Store user in localStorage
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Get user from localStorage
export const getUser = () => {
  const userJson = localStorage.getItem("user");
  return userJson ? JSON.parse(userJson) : null;
};

// ========================================
// AUTHENTICATION STATE
// ========================================

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = getToken();
  if (!token || isTokenExpired()) {
    clearCredential(); // Clean up expired token
    return false;
  }
  return true;
};

// ========================================
// AUTHENTICATION API CALLS
// ========================================

// Register a new user
export const register = async (username, email, password, role) => {
  try {
    const response = await axios.post(`${API_URL}/register`, {
      username,
      email,
      password,
      role,
    });

    // Store token and user data
    setToken(response.data.token);
    setUser(response.data.user);

    return response.data;
  } catch (error) {
    console.error("Registration error:", error.response?.data || error.message);
    throw error;
  }
};

// Login user
export const login = async (username, password) => {
  try {
    console.log("Request payload:", { username, password });
    console.log("API URL:", `${API_URL}/login`);

    const response = await axios.post(`${API_URL}/login`, {
      username,
      password,
    });

    console.log("Login response data:", response.data);

    // Store token and user data
    setToken(response.data.token);
    setUser(response.data.user);

    return response.data;
  } catch (error) {
    console.error("Login error:", error.response?.data || error.message);
    throw error;
  }
};

// Logout user - clear Credential
export const clearCredential = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("tokenTimestamp");
};
