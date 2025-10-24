import { memo } from "react";
import { Container, Row } from "react-bootstrap";
import { ToastContainer } from "react-toastify";

import AppContainer from "./AppContainer";
import Header from "./Header";
import Footer from "./Footer";
import MainContent from "./MainContent";
import BodyMain from "../Main/BodyMain";
import SideMain from "../Main/SideMain";
import BodyHead from "../Head/BodyHead";
import SideHead from "../Head/SideHead";

// ✅ Memoize child components to prevent unnecessary re-renders
const MemoizedHeader = memo(Header);
const MemoizedFooter = memo(Footer);
const MemoizedSideHead = memo(SideHead);
const MemoizedSideMain = memo(SideMain);
const MemoizedBodyMain = memo(BodyMain);

// ✅ Memoized dashboard component
const MemoizedDashboard = memo(
  function Dashboard({
    user,
    handleLogout,
    searchTerm,
    handleSearchTermChange,
    setTriggerLoadCards,
    totalFilteredCards,
    memoizedStatusFilters,
    handleStatusFiltersChange,
    dashboardState,
    setViewCard,
    setProjectNameSelected,
    handleTotalFilteredCardsChange,
  }) {
    return (
      <AppContainer>
        <MemoizedHeader username={user?.username} onLogout={handleLogout} />

        <MainContent>
          <Container className="layout-page-container">
            <Row className="layout-body">
              <MemoizedSideHead
                viewCard={dashboardState.viewCard}
                setViewCard={setViewCard}
                setProjectNameSelected={setProjectNameSelected}
              />

              <BodyHead
                searchTerm={searchTerm}
                setSearchTerm={handleSearchTermChange}
                setTriggerLoadCards={setTriggerLoadCards}
                totalFilteredCards={totalFilteredCards}
                statusFilters={memoizedStatusFilters}
                setStatusFilters={handleStatusFiltersChange}
              />
            </Row>
          </Container>

          <Container className="layout-page-container">
            <Row className="layout-body">
              <MemoizedSideMain
                viewCard={dashboardState.viewCard}
                setTriggerLoadCards={setTriggerLoadCards}
                projectNameSelected={dashboardState.projectNameSelected}
                setProjectNameSelected={setProjectNameSelected}
              />
              <MemoizedBodyMain
                viewCard={dashboardState.viewCard}
                searchTerm={searchTerm}
                triggerLoadCards={dashboardState.triggerLoadCards}
                setTriggerLoadCards={setTriggerLoadCards}
                setTotalFilteredCards={handleTotalFilteredCardsChange}
                statusFilters={memoizedStatusFilters}
                projectNameSelected={dashboardState.projectNameSelected}
              />
            </Row>
          </Container>
        </MainContent>

        <MemoizedFooter />
        <ToastContainer />
      </AppContainer>
    );
  },
  (prevProps, nextProps) => {
    // ✅ Custom comparison - Check totalFilteredCards AND triggerLoadCards
    const isEqual =
      prevProps.user?.username === nextProps.user?.username &&
      prevProps.handleLogout === nextProps.handleLogout &&
      prevProps.searchTerm === nextProps.searchTerm &&
      prevProps.handleSearchTermChange === nextProps.handleSearchTermChange &&
      prevProps.setTriggerLoadCards === nextProps.setTriggerLoadCards &&
      prevProps.totalFilteredCards === nextProps.totalFilteredCards &&
      prevProps.memoizedStatusFilters === nextProps.memoizedStatusFilters &&
      prevProps.handleStatusFiltersChange ===
        nextProps.handleStatusFiltersChange &&
      prevProps.dashboardState.viewCard === nextProps.dashboardState.viewCard &&
      prevProps.dashboardState.triggerLoadCards ===
        nextProps.dashboardState.triggerLoadCards &&
      prevProps.dashboardState.projectNameSelected ===
        nextProps.dashboardState.projectNameSelected &&
      prevProps.setViewCard === nextProps.setViewCard &&
      prevProps.setProjectNameSelected === nextProps.setProjectNameSelected &&
      prevProps.handleTotalFilteredCardsChange ===
        nextProps.handleTotalFilteredCardsChange;

    if (!isEqual && process.env.NODE_ENV === "development") {
      const changes = {
        userChanged: prevProps.user?.username !== nextProps.user?.username,
        handleLogoutChanged: prevProps.handleLogout !== nextProps.handleLogout,
        searchTermChanged: prevProps.searchTerm !== nextProps.searchTerm,
        handleSearchTermChangeChanged:
          prevProps.handleSearchTermChange !== nextProps.handleSearchTermChange,
        setTriggerLoadCardsChanged:
          prevProps.setTriggerLoadCards !== nextProps.setTriggerLoadCards,
        totalFilteredCardsChanged:
          prevProps.totalFilteredCards !== nextProps.totalFilteredCards, // ✅ This will now trigger re-render
        memoizedStatusFiltersChanged:
          prevProps.memoizedStatusFilters !== nextProps.memoizedStatusFilters,
        handleStatusFiltersChangeChanged:
          prevProps.handleStatusFiltersChange !==
          nextProps.handleStatusFiltersChange,
        viewCardChanged:
          prevProps.dashboardState.viewCard !==
          nextProps.dashboardState.viewCard,
        triggerLoadCardsChanged:
          prevProps.dashboardState.triggerLoadCards !==
          nextProps.dashboardState.triggerLoadCards,
        projectNameSelectedChanged:
          prevProps.dashboardState.projectNameSelected !==
          nextProps.dashboardState.projectNameSelected,
        setViewCardChanged: prevProps.setViewCard !== nextProps.setViewCard,
        setProjectNameSelectedChanged:
          prevProps.setProjectNameSelected !== nextProps.setProjectNameSelected,
        handleTotalFilteredCardsChangeChanged:
          prevProps.handleTotalFilteredCardsChange !==
          nextProps.handleTotalFilteredCardsChange,
      };
      console.log("🔵 MemoizedDashboard re-render because:");
      Object.entries(changes).forEach(([key, value]) => {
        if (value) {
          console.log(`  ✅ ${key}: TRUE`);
        }
      });
    }
    return isEqual;
  }
);

export default MemoizedDashboard;
