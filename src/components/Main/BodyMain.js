import { useState, useCallback, useEffect, useRef } from "react";
import { Col, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchCards, deleteCard, updateCard } from "../../services/api";
import viewsCards from "../../utils/viewsCards";

import "./BodyMain.css";

import BodyMainAll from "./BodyMainAll";
import BodyMainProject from "./BodyMainProject";
import BodyMainStat from "./BodyMainStat";

function BodyMain({
  viewCard,
  searchTerm,
  triggerLoadCards,
  setTriggerLoadCards,
  setTotalFilteredCards,
  statusFilters,
  projectNameSelected,
}) {
  const developmentModeEnabled =
    process.env.REACT_APP_DESIGN_ENABLED === "true";
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = parseInt(process.env.REACT_APP_CARDS_PER_PAGE) || 6;
  // ✅ Add ref to track if cards are currently loading
  const isLoadingRef = useRef(false);
  // ✅ Track the last total that was actually SET to parent
  const lastSetTotalRef = useRef(0);
  // ✅ Track previous searchTerm to avoid unnecessary filtering
  const prevSearchTermRef = useRef(searchTerm);
  const prevCardsLengthRef = useRef(0);
  // ✅ Add render tracking
  const renderCountRef = useRef(0);
  renderCountRef.current++;

  if (process.env.NODE_ENV === "development") {
    console.log("📦 BodyMain render #", renderCountRef.current, {
      cardsLength: cards.length,
      filteredCardsLength: filteredCards.length,
      loading,
      triggerLoadCards,
      searchTerm,
      lastSetTotalRef: lastSetTotalRef.current,
      isLoadingRef: isLoadingRef.current,
    });
  }

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);
  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Render pagination items
  const renderPaginationItems = () => {
    const items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }
    return items;
  };

  // Load cards from API
  const loadCards = useCallback(async () => {
    if (process.env.NODE_ENV === "development") {
      console.log("🔄 BodyMain: loadCards() called");
    }

    setLoading(true);
    try {
      // Build query string from filters
      const params = new URLSearchParams();
      if (statusFilters.todo) params.append("status", "todo");
      if (statusFilters.doing) params.append("status", "doing");
      if (statusFilters.done) params.append("status", "done");
      if (projectNameSelected.length > 0) {
        params.append("title", projectNameSelected);
      }
      const queryParams = params.toString() ? `?${params.toString()}` : "";
      const data = await fetchCards(queryParams);

      if (process.env.NODE_ENV === "development") {
        console.log("✅ BodyMain: Cards fetched, count:", data.length);
      }

      setCards(data);
      setFilteredCards(data);
      prevCardsLengthRef.current = data.length;

      // ✅ Only call parent setter if total actually changed
      if (lastSetTotalRef.current !== data.length) {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "📊 BodyMain: Updating total from",
            lastSetTotalRef.current,
            "to",
            data.length
          );
        }
        lastSetTotalRef.current = data.length;
        setTotalFilteredCards(data.length);
      } else {
        if (process.env.NODE_ENV === "development") {
          console.log(
            "🚫 BodyMain: Skipping total update (same value:",
            data.length,
            ")"
          );
        }
      }
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  }, [
    statusFilters.todo,
    statusFilters.doing,
    statusFilters.done,
    setTotalFilteredCards,
    projectNameSelected,
  ]);

  // Filter cards based on search term
  useEffect(() => {
    // ✅ Only run if searchTerm or cards actually changed
    if (
      prevSearchTermRef.current === searchTerm &&
      prevCardsLengthRef.current === cards.length
    ) {
      if (process.env.NODE_ENV === "development") {
        console.log("🚫 BodyMain: Skipping filter (no changes)", {
          searchTerm,
          cardsLength: cards.length,
        });
      }
      return;
    }

    prevSearchTermRef.current = searchTerm;
    prevCardsLengthRef.current = cards.length;

    if (process.env.NODE_ENV === "development") {
      console.log("🎯 BodyMain: useEffect [searchTerm, cards] triggered", {
        searchTerm,
        cardsLength: cards.length,
      });
    }

    let newTotal;
    if (searchTerm.trim() === "") {
      setFilteredCards(cards);
      newTotal = cards.length;
    } else {
      const filtered = cards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCards(filtered);
      newTotal = filtered.length;
    }
    // ✅ Only call parent setter if value actually changed
    if (lastSetTotalRef.current !== newTotal) {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "📊 BodyMain (filter): Updating total from",
          lastSetTotalRef.current,
          "to",
          newTotal
        );
      }
      lastSetTotalRef.current = newTotal;
      setTotalFilteredCards(newTotal);
    } else {
      if (process.env.NODE_ENV === "development") {
        console.log(
          "🚫 BodyMain (filter): Skipping total update (same value:",
          newTotal,
          ")"
        );
      }
    }

    setCurrentPage(1);
  }, [searchTerm, cards, setTotalFilteredCards]);

  // Load cards when triggerLoadCards changes to true.
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("🎯 BodyMain: useEffect [triggerLoadCards] triggered", {
        triggerLoadCards,
        isLoadingRef: isLoadingRef.current,
      });
    }

    // ✅ Guard: Only load if triggered AND not already loading
    if (triggerLoadCards && !isLoadingRef.current) {
      isLoadingRef.current = true;
      if (process.env.NODE_ENV === "development") {
        console.log("📦 BodyMain: Loading cards...");
      }
      // ✅ Reset trigger FIRST to prevent multiple calls
      setTriggerLoadCards(false);

      // ✅ Then load cards async
      loadCards().finally(() => {
        isLoadingRef.current = false;
      });
    }
  }, [triggerLoadCards, setTriggerLoadCards, loadCards]);

  // Handle card update
  const handleCardUpdate = async (updatedCardData) => {
    try {
      console.log("handleCardUpdate called with:", updatedCardData);
      const { _id, title, description, status } = updatedCardData;
      const updatedCard = await updateCard(_id, {
        title,
        description,
        status,
      });
      console.log("Update response:", updatedCard);

      // ✅ Trigger reload FIRST to ensure fresh data
      setTriggerLoadCards(true);
      // ✅ Update local state for immediate UI feedback
      setCards((prevCards) =>
        prevCards.map((card) =>
          card._id === updatedCard._id ? updatedCard : card
        )
      );
      // ✅ Also update filtered cards to reflect changes immediately
      setFilteredCards((prevFiltered) =>
        prevFiltered.map((card) =>
          card._id === updatedCard._id ? updatedCard : card
        )
      );

      toast.success("Card updated successfully!");
    } catch (error) {
      console.error("Error updating card:", error);
      toast.error("Failed to update card. Please try again.");
    }
  };

  // Handle card deletion
  const handleCardDelete = async (id) => {
    try {
      await deleteCard(id);
      setCards(cards.filter((card) => card._id !== id));
      toast.success("Card deleted!");
      setTriggerLoadCards(true);
    } catch (error) {
      console.error("Error deleting card:", error);
      // Set a user-friendly message based on error
      if (error.response?.status === 403) {
        toast.error("You do not have permission to delete this card.");
      } else {
        toast.error("An error occurred while deleting the card.");
      }
    } finally {
      setTriggerLoadCards(true);
    }
  };

  return (
    <Col
      className={`layout-main${
        developmentModeEnabled ? " dev-mode" : ""
      } main-window-height`}
    >
      {viewCard === viewsCards[0] ? (
        <BodyMainAll
          filteredCards={filteredCards}
          searchTerm={searchTerm}
          loading={loading}
          currentCards={currentCards}
          renderPaginationItems={renderPaginationItems}
          cardsPerPage={cardsPerPage}
          handleCardUpdate={handleCardUpdate}
          handleCardDelete={handleCardDelete}
        />
      ) : viewCard === viewsCards[1] ? (
        <BodyMainProject
          loading={loading}
          filteredCards={filteredCards}
          searchTerm={searchTerm}
          handleCardUpdate={handleCardUpdate}
          handleCardDelete={handleCardDelete}
        />
      ) : viewCard === viewsCards[2] ? (
        <BodyMainStat />
      ) : (
        <div className="layout-main">
          <h2 className="text-center my-5">Select a mode to view cards.</h2>
        </div>
      )}
    </Col>
  );
}
export default BodyMain;
