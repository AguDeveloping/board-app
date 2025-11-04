import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import viewsCards from "./utils/viewsCards";
import useAuth from "./hooks/useAuth";
import useSessionMonitor from "./hooks/useSessionMonitor";

import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import MemoizedDashboard from "./components/Layout/MemoizedDashboard";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    todo: true,
    doing: true,
    done: true,
  });
  // ✅ Memoize statusFilters to prevent reference changes
  const memoizedStatusFilters = useMemo(
    () => statusFilters,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [statusFilters.todo, statusFilters.doing, statusFilters.done]
  );
  const [totalFilteredCards, setTotalFilteredCards] = useState(0);
  const {
    user,
    authenticated,
    showRegister,
    handleRegisterSuccess,
    handleLoginSuccess,
    handleSwitchToRegister,
    handleSwitchToLogin,
    handleLogout,
  } = useAuth();
  // ✅ Only run once when authenticated changes from false to true
  const prevAuthenticatedRef = useRef(authenticated);
  // ✅ Use ref to track initialization - NO state updates = NO re-renders
  const hasInitializedDashboardRef = useRef(false);
  // 🔍 ADD EXECUTION COUNTERS TO TRACK REACT STRICTMODE
  const authEffectExecutionCount = useRef(0);
  const filterEffectExecutionCount = useRef(0);
  const initialLoadEffectExecutionCount = useRef(0);
  // ✅ Combine related state into single object
  const [dashboardState, setDashboardState] = useState({
    viewCard: viewsCards[0],
    triggerLoadCards: false,
    projectNameSelected: "",
  });
  // ✅ Memoize setter functions with useCallback
  const setViewCard = useCallback((view) => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 setViewCard called with:", view);
    }
    setDashboardState((prev) => ({ ...prev, viewCard: view }));
  }, []);
  const setTriggerLoadCards = useCallback((trigger) => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 setTriggerLoadCards called with:", trigger);
    }
    setDashboardState((prev) => ({ ...prev, triggerLoadCards: trigger }));
  }, []);
  const setProjectNameSelected = useCallback((name) => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 setProjectNameSelected called with:", name);
    }
    setDashboardState((prev) => ({ ...prev, projectNameSelected: name }));
  }, []);
  const handleSearchTermChange = useCallback((term) => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 handleSearchTermChange called with:", term);
    }
    // ✅ Only update if value actually changed
    setSearchTerm((prev) => {
      if (prev === term) {
        console.log("🚫 Skipping searchTerm update - same value");
        return prev;
      }
      return term;
    });
  }, []);
  const handleStatusFiltersChange = useCallback((filters) => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 handleStatusFiltersChange called with:", filters);
    }
    setStatusFilters(filters);
  }, []);
  const handleTotalFilteredCardsChange = useCallback((total) => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 handleTotalFilteredCardsChange called with:", total);
    }
    // ✅ Only update if value actually changed
    setTotalFilteredCards((prev) => {
      if (prev === total) {
        console.log("🚫 Skipping totalFilteredCards update - same value");
        return prev;
      }
      return total;
    });
  }, []);
  // Session monitoring
  useSessionMonitor(authenticated, handleLogout);
  // Add unique ID to track renders
  const renderIdRef = useRef(Math.random().toString(36).substr(2, 9));
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  if (process.env.NODE_ENV === "development") {
    console.log(
      "🔄 App render #",
      renderCountRef.current,
      "ID:",
      renderIdRef.current,
      {
        authenticated,
        user: user?.username,
        showRegister,
      }
    );
  }

  // TODO AR: Temporarily to verify config loading
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔧 App Config Check: ###################################", {
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
        REACT_APP_API_AUTH_URL: process.env.REACT_APP_API_AUTH_URL,
        REACT_APP_CARDS_PER_PAGE: process.env.REACT_APP_CARDS_PER_PAGE,
        REACT_APP_DESIGN_ENABLED: process.env.REACT_APP_DESIGN_ENABLED,
      });
    }
  }, []);

  // ✅ Memoize status filters to prevent unnecessary re-renders
  const statusFiltersString = useMemo(
    () => JSON.stringify(statusFilters),
    [statusFilters]
  );
  // ✅ Track if this is the first mount
  const isInitialMountRef = useRef(true);
  // ✅ Track if cards have been loaded at least once
  const hasLoadedCardsRef = useRef(false);
  // ✅ Track previous project name to detect when switching from project to all view
  const prevProjectNameRef = useRef("");

  // ✅ Validate token only once on mount
  useEffect(() => {
    authEffectExecutionCount.current++; // 🔍 Increment counter
    const executionNumber = authEffectExecutionCount.current;

    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(
      `🎯 [EXECUTION #${executionNumber}] useEffect [authenticated] triggered`,
      {
        authenticated,
        prevAuthenticated: prevAuthenticatedRef.current,
        hasInitialized: hasInitializedDashboardRef.current,
        executionCount: authEffectExecutionCount.current,
        timestamp: new Date().toISOString(),
      }
    );

    if (authenticated) {
      const token = localStorage.getItem("token");
      const tokenTimestamp = localStorage.getItem("tokenTimestamp");

      if (!token || !tokenTimestamp) {
        console.log(
          `❌ [EXECUTION #${executionNumber}] Token missing, logging out`
        );
        prevAuthenticatedRef.current = false; // ✅ Update before logout
        handleLogout();
        return;
      }

      const tokenAge = Date.now() - parseInt(tokenTimestamp);
      const maxAge = 24 * 60 * 60 * 1000;

      if (tokenAge > maxAge) {
        console.log(
          `❌ [EXECUTION #${executionNumber}] Token expired, logging out`
        );
        handleLogout();
        prevAuthenticatedRef.current = false; // ✅ Update ref before return
        return;
      }
      // ✅ Only log transition, don't set hasInitialized flag here
      if (!prevAuthenticatedRef.current) {
        console.log(
          `🎯 [EXECUTION #${executionNumber}] User just logged in (transition detected)`
        );
        console.log(`   📝 prevAuth: ${prevAuthenticatedRef.current} → true`);
        prevAuthenticatedRef.current = true;
      } else {
        console.log(
          `🔄 [EXECUTION #${executionNumber}] User already authenticated`,
          {
            prevAuthenticated: prevAuthenticatedRef.current,
          }
        );
      }
    } else {
      console.log(
        `📤 [EXECUTION #${executionNumber}] User is not authenticated`
      );
      // ✅ Reset flags when user logs out
      if (hasInitializedDashboardRef.current) {
        console.log(
          `🎯 [EXECUTION #${executionNumber}] User logged out - resetting initialization flag`
        );
        hasInitializedDashboardRef.current = false;
      }
      prevAuthenticatedRef.current = false;
    }
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    // 🔍 CLEANUP FUNCTION TO TRACK STRICTMODE UNMOUNT
    return () => {
      console.log(
        `🧹 [CLEANUP #${executionNumber}] Authentication effect cleanup called`
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticated, handleLogout]); // ✅ Only re-run when authenticated changes

  // Load cards on initial render if authenticated and when status filters change
  useEffect(() => {
    filterEffectExecutionCount.current++; // 🔍 Increment counter
    const executionNumber = filterEffectExecutionCount.current;

    if (process.env.NODE_ENV === "development") {
      console.log(
        `🎯 [FILTER EXECUTION #${executionNumber}] useEffect [statusFiltersString] triggered for filter change`,
        {
          isInitialMount: isInitialMountRef.current,
          hasLoadedCards: hasLoadedCardsRef.current,
          authenticated,
        }
      );
    }

    // ✅ Skip on first mount - let initial triggerLoadCards: true handle it
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🚫 [FILTER EXECUTION #${executionNumber}] Skipping filter effect on initial mount`
        );
      }
      return;
    }

    // ✅ Skip until cards have been loaded at least once
    if (!hasLoadedCardsRef.current) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🚫 [FILTER EXECUTION #${executionNumber}] Skipping filter effect - cards not loaded yet`
        );
      }
      return;
    }

    if (authenticated) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🔄 [FILTER EXECUTION #${executionNumber}] Filter changed - triggering reload`
        );
      }
      setDashboardState((prev) => ({
        ...prev,
        triggerLoadCards: true,
      }));
    }
    // 🔍 CLEANUP FUNCTION
    return () => {
      console.log(
        `🧹 [FILTER CLEANUP #${executionNumber}] Filter effect cleanup called`
      );
    };
  }, [statusFiltersString, authenticated]);

  // ✅ Update hasLoadedCardsRef when cards are loaded
  useEffect(() => {
    if (authenticated && totalFilteredCards > 0 && !hasLoadedCardsRef.current) {
      hasLoadedCardsRef.current = true;
      if (process.env.NODE_ENV === "development") {
        console.log("✅ Cards loaded for first time - enabling filter effect");
      }
    }
  }, [authenticated, totalFilteredCards]);

  // ✅ Handle view changes - reset project filter when switching view
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🎯 useEffect [viewCard] triggered", {
        viewCard: dashboardState.viewCard,
        projectNameSelected: dashboardState.projectNameSelected,
        prevProjectName: prevProjectNameRef.current,
        authenticated,
        hasLoadedCards: hasLoadedCardsRef.current,
      });
    }

    // When switching to "all" view from a project view, reload cards
    if (
      authenticated &&
      hasLoadedCardsRef.current &&
      ["all", "stats"].includes(dashboardState.viewCard) &&
      prevProjectNameRef.current !== "" // Check if we HAD a project selected
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "🔄 Switching to 'all' view from project - clearing filter and reloading",
          {
            previousProject: prevProjectNameRef.current,
          }
        );
      }
      prevProjectNameRef.current = ""; // Reset tracker
      setDashboardState((prev) => ({
        ...prev,
        projectNameSelected: "", // Ensure project filter is cleared
        triggerLoadCards: true, // Trigger reload
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardState.viewCard, authenticated]);

  // ✅ Trigger reload when project name changes
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🎯 useEffect [projectNameSelected] triggered", {
        projectName: dashboardState.projectNameSelected,
        prevProjectName: prevProjectNameRef.current,
        viewCard: dashboardState.viewCard,
        authenticated,
        hasLoadedCards: hasLoadedCardsRef.current,
      });
    }

    // Check if project selection changed (both ways: selected → cleared OR changed project)
    const projectChanged =
      dashboardState.projectNameSelected !== prevProjectNameRef.current;

    // Update the previous project name tracker
    if (projectChanged) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "📝 Updating prevProjectNameRef:",
          prevProjectNameRef.current,
          "→",
          dashboardState.projectNameSelected
        );
      }
    }

    // Trigger reload if:
    // 1. User is authenticated
    // 2. Cards have been loaded at least once
    // 3. Currently in project view
    // 4. Project selection changed
    // 5. New selection is not empty (has a project selected)
    if (
      authenticated &&
      hasLoadedCardsRef.current &&
      dashboardState.viewCard === "project" &&
      projectChanged &&
      dashboardState.projectNameSelected !== ""
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "🔄 Project selected - triggering reload:",
          dashboardState.projectNameSelected
        );
      }
      setDashboardState((prev) => ({
        ...prev,
        triggerLoadCards: true,
      }));
    }

    // Handle clearing project selection (going back to "Choose...")
    if (
      authenticated &&
      hasLoadedCardsRef.current &&
      dashboardState.viewCard === "project" &&
      projectChanged &&
      dashboardState.projectNameSelected === "" &&
      prevProjectNameRef.current !== ""
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "🔄 Project cleared (Choose...) - triggering reload to show all cards"
        );
      }
      setDashboardState((prev) => ({
        ...prev,
        triggerLoadCards: true,
      }));
    }

    // Update the tracker AFTER checking
    prevProjectNameRef.current = dashboardState.projectNameSelected;
  }, [
    dashboardState.projectNameSelected,
    dashboardState.viewCard,
    authenticated,
  ]);

  // ✅ Trigger initial load when authenticated becomes true
  useEffect(() => {
    initialLoadEffectExecutionCount.current++; // 🔍 Increment counter
    const executionNumber = initialLoadEffectExecutionCount.current;

    if (process.env.NODE_ENV === "development") {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log(
        `🚀 [INITIAL LOAD EXECUTION #${executionNumber}] useEffect [authenticated] for initial load`,
        {
          authenticated,
          hasInitialized: hasInitializedDashboardRef.current,
          executionCount: initialLoadEffectExecutionCount.current,
          timestamp: new Date().toISOString(),
        }
      );
    }

    if (authenticated && !hasInitializedDashboardRef.current) {
      // This will only run ONCE when logging in (protected by ref)
      if (process.env.NODE_ENV === "development") {
        console.log(
          `✅ [INITIAL LOAD EXECUTION #${executionNumber}] Condition passed - triggering initial dashboard load`
        );
        console.log(`   📝 Setting triggerLoadCards to TRUE for initial load`);
        console.log(`   📝 Setting hasInitialized to TRUE`);
      }
      hasInitializedDashboardRef.current = true; // ✅ Set flag HERE, not in auth effect
      setDashboardState((prev) => ({
        ...prev,
        triggerLoadCards: true,
      }));
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🚫 [INITIAL LOAD EXECUTION #${executionNumber}] Skipping initial load`,
          {
            authenticated,
            hasInitialized: hasInitializedDashboardRef.current,
            reason: !authenticated
              ? "not authenticated"
              : "already initialized",
          }
        );
      }
    }

    if (process.env.NODE_ENV === "development") {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
    }

    // 🔍 CLEANUP FUNCTION TO TRACK STRICTMODE UNMOUNT
    return () => {
      if (process.env.NODE_ENV === "development") {
        console.log(
          `🧹 [INITIAL LOAD CLEANUP #${executionNumber}] Initial load effect cleanup called`
        );
      }
    };
  }, [authenticated]);

  // If not authenticated, show login or registration screen
  if (!authenticated) {
    return showRegister ? (
      <Register
        onRegisterSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />
    ) : (
      <Login
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />
    );
  }

  return (
    <MemoizedDashboard
      user={user}
      handleLogout={handleLogout}
      searchTerm={searchTerm}
      handleSearchTermChange={handleSearchTermChange}
      setTriggerLoadCards={setTriggerLoadCards}
      totalFilteredCards={totalFilteredCards}
      memoizedStatusFilters={memoizedStatusFilters}
      handleStatusFiltersChange={handleStatusFiltersChange}
      dashboardState={dashboardState}
      setViewCard={setViewCard}
      setProjectNameSelected={setProjectNameSelected}
      handleTotalFilteredCardsChange={handleTotalFilteredCardsChange}
    />
  );
}

export default App;
