import { useState, useEffect } from "react";
import { Container, Row } from "react-bootstrap";
import viewsCards from "./utils/viewsCards";
import useAuth from "./hooks/useAuth";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import AppContainer from "./components/Layout/AppContainer";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import MainContent from "./components/Layout/MainContent";
import BodyMain from "./components/Main/BodyMain";
import SideMain from "./components/Main/SideMain";
import BodyHead from "./components/Head/BodyHead";
import SideHead from "./components/Head/SideHead";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilters, setStatusFilters] = useState({
    todo: true,
    doing: true,
    done: true,
  });
  const [searchProject, setSearchProject] = useState("");
  const [totalFilteredCards, setTotalFilteredCards] = useState(0);

  const [viewCard, setViewCard] = useState(viewsCards[0]); // Default to "all"

  const [triggerLoadCards, setTriggerLoadCards] = useState(false);

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

  // Load cards on initial render if authenticated and when status filters change
  useEffect(() => {
    if (authenticated) {
      setTriggerLoadCards(true);
    }
  }, [authenticated, statusFilters]);

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
              statusFilters={statusFilters}
              setStatusFilters={setStatusFilters}
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
              statusFilters={statusFilters}
            />
          </Row>
        </Container>
      </MainContent>

      <Footer />
    </AppContainer>
  );
}

export default App;
