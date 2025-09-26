import { useState } from "react";
import { isAuthenticated, logout, getUser } from "../services/auth";

function useAuth() {
  const [user, setUser] = useState(getUser());
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [showRegister, setShowRegister] = useState(false); // Toggle between login and register

  // Handle successful login
  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
  };

  // Switch to registration form
  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };

  // Switch to login form
  const handleSwitchToLogin = () => {
    setShowRegister(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
  };

  // RETURN the properties and functions.
  return {
    user,
    authenticated,
    showRegister,
    handleRegisterSuccess,
    handleLoginSuccess,
    handleSwitchToRegister,
    handleSwitchToLogin,
    handleLogout,
  };
}
export default useAuth;
