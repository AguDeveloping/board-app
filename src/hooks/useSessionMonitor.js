import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { clearCredential } from "../services/auth";

function useSessionMonitor(authenticated, onLogout) {
  const [showWarning, setShowWarning] = useState(false);

  // Memoize checkSession to avoid recreating on every render
  const checkSession = useCallback(() => {
    const tokenTimestamp = localStorage.getItem("tokenTimestamp");
    if (!tokenTimestamp) return;

    const tokenAge = Date.now() - parseInt(tokenTimestamp);
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours
    const warningTime = 23 * 60 * 60 * 1000; // 23 hours (1 hour before expiry)

    if (tokenAge > maxAge) {
      // Token expired
      toast.error("Your session has expired. Please login again.");
      clearCredential();
      onLogout();
    } else if (tokenAge > warningTime && !showWarning) {
      // Show warning 1 hour before expiry
      toast.warning("Your session will expire soon. Please save your work.");
      setShowWarning(true);
    }
  }, [showWarning, onLogout]);

  useEffect(() => {
    if (!authenticated) return;

    // Check immediately on mount
    checkSession();

    // Check every 5 minutes
    const interval = setInterval(checkSession, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [authenticated, checkSession]);

  return null;
}

export default useSessionMonitor;
