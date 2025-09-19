import { useState, useEffect } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { isAuthenticated, logout, getUser } from "./services/auth";
import viewsCards from "./utils/viewsCards";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Register from "./components/Register";
import BodyMainProject from "./components/Main/BodyMainProject";
// import BodyHeadProject from "./components/Head/BodyHeadProject";
import BodyHeadAll from "./components/Head/BodyHeadAll";
import BodyMainAll from "./components/Main/BodyMainAll";
import AppContainer from "./components/App/AppContainer";
import MainContent from "./components/App/MainContent";

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());

  const [searchTerm, setSearchTerm] = useState("");
  const [totalFilteredCards, setTotalFilteredCards] = useState(0);

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
        {/* Sidebar and Main Content Layout */}
        <Container className="layout-page-container">
          <Row className="layout-body">
            <Col className="layout-sidebar">
              <Row className="sidebar-item">
                <h5 className="text-center">views</h5>
                <Button
                  variant="outline-primary"
                  active={viewCard === viewsCards[0]}
                  onClick={() => {
                    setViewCard(viewsCards[0]);
                  }}
                >
                  ALL
                </Button>
                <Button
                  variant="outline-success"
                  active={viewCard === viewsCards[1]}
                  onClick={() => {
                    setViewCard(viewsCards[1]);
                  }}
                >
                  Projects
                </Button>
                <Button
                  variant="outline-warning"
                  active={viewCard === viewsCards[2]}
                  onClick={() => {
                    setViewCard(viewsCards[2]);
                  }}
                >
                  Stats
                </Button>
              </Row>
            </Col>

            <BodyHeadAll
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setTriggerLoadCards={setTriggerLoadCards}
              totalFilteredCards={totalFilteredCards}
            />
          </Row>
        </Container>

        {/* New layout sidebar and main content  */}
        <Container className="layout-page-container">
          <Row className="layout-body">
            <Col className="layout-sidebar">
              <Row className="sidebar-item">
                <h5 className="text-center">modes</h5>
              </Row>
              {viewCard === viewsCards[0] ? (
                <Row className="sidebar-item">All Cards View</Row>
              ) : viewCard === viewsCards[1] ? (
                <Row className="sidebar-item">Projects View</Row>
              ) : viewCard === viewsCards[2] ? (
                <Row className="sidebar-item">Stats View</Row>
              ) : (
                <Row className="sidebar-item">Click a select mode</Row>
              )}
            </Col>
            {viewCard === viewsCards[0] ? (
              <BodyMainAll
                searchTerm={searchTerm}
                triggerLoadCards={triggerLoadCards}
                setTriggerLoadCards={setTriggerLoadCards}
                setTotalFilteredCards={setTotalFilteredCards}
              />
            ) : viewCard === viewsCards[1] ? (
              <BodyMainProject />
            ) : viewCard === viewsCards[2] ? (
              <div className="layout-main">
                <h2 className="text-center my-5">Stats View Coming Soon!</h2>
              </div>
            ) : (
              <div className="layout-main">
                <h2 className="text-center my-5">
                  Select a mode to view cards.
                </h2>
              </div>
            )}
          </Row>
        </Container>
      </MainContent>

      <Footer />
    </AppContainer>
  );
}

export default App;
