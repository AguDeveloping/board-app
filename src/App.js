import { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import { isAuthenticated, logout, getUser } from "./services/auth";
import viewsCards from "./utils/viewsCards";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AppContainer from "./components/App/AppContainer";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import MainContent from "./components/App/MainContent";
import BodyMain from "./components/Main/BodyMain";
import SideMain from "./components/Main/SideMain";
import BodyHead from "./components/Head/BodyHead";
import SideHead from "./components/Head/SideHead";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());

  const [searchTerm, setSearchTerm] = useState("");
  const [totalFilteredCards, setTotalFilteredCards] = useState(0);
  const [searchProject, setSearchProject] = useState("");

  const [showRegister, setShowRegister] = useState(false); // Toggle between login and register

  const [viewCard, setViewCard] = useState(viewsCards[0]); // Default to "all"

  const [triggerLoadCards, setTriggerLoadCards] = useState(false);

  // Handle successful login
  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
    // loadCards();
    setTriggerLoadCards(true);
  };

  // Handle successful registration
  const handleRegisterSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
    // loadCards();
    setTriggerLoadCards(true);
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

  // // Load cards on initial render if authenticated
  useEffect(() => {
    if (authenticated) {
      // loadCards();
      setTriggerLoadCards(true);
    }
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
    <AppContainer>
      <Header username={user?.username} onLogout={handleLogout} />

      <MainContent>
        {/* Head - Upper container: Sidebar and Main Content Layout */}
        <Container className="layout-page-container">
          <Row className="layout-body">
            <SideHead viewCard={viewCard} setViewCard={setViewCard} />

            <BodyHead
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setTriggerLoadCards={setTriggerLoadCards}
              totalFilteredCards={totalFilteredCards}
            />
          </Row>
        </Container>

        {/* Main - Lower container: Sidebar and Main Content Layout */}
        <Container className="layout-page-container">
          <Row className="layout-body">
            <SideMain
              viewCard={viewCard}
              setTriggerLoadCards={setTriggerLoadCards}
            />
            <BodyMain
              viewCard={viewCard}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              triggerLoadCards={triggerLoadCards}
              setTriggerLoadCards={setTriggerLoadCards}
              setTotalFilteredCards={setTotalFilteredCards}
              searchProject={searchProject}
              setSearchProject={setSearchProject}
            />
          </Row>
        </Container>
      </MainContent>

      <Footer />
    </AppContainer>
  );
}

export default App;
