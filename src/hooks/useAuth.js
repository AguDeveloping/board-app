import { useState, useCallback } from "react";
import { isAuthenticated, clearCredential, getUser } from "../services/auth";

function useAuth() {
  const [user, setUser] = useState(() => getUser());
  const [authenticated, setAuthenticated] = useState(() => isAuthenticated());
  // Toggle between login and register views
  const [showRegister, setShowRegister] = useState(false);

  if (process.env.NODE_ENV === "development") {
    console.log("🔐 useAuth hook render", {
      authenticated,
      user: user?.username,
    });
  }

  const handleLoginSuccess = useCallback((userData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Login success:", userData.username);
    }
    setUser(userData);
    setAuthenticated(true);
    setShowRegister(false);
  }, []);

  const handleRegisterSuccess = useCallback((userData) => {
    if (process.env.NODE_ENV === "development") {
      console.log("✅ Register success:", userData.username);
    }
    setUser(userData);
    setAuthenticated(true);
    setShowRegister(false);
  }, []);

  const handleLogout = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("👋 Logout");
    }
    clearCredential();
    setUser(null);
    setAuthenticated(false);
    setShowRegister(false);
  }, []);

  const handleSwitchToRegister = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Switch to register");
    }
    setShowRegister(true);
  }, []);

  const handleSwitchToLogin = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 Switch to login");
    }
    setShowRegister(false);
  }, []);

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
