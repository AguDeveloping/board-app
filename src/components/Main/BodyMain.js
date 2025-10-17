import { useState, useCallback, useEffect } from "react";
import { Col, Pagination } from "react-bootstrap";
import { toast } from "react-toastify";
import { fetchCards, deleteCard, updateCard } from "../../services/api";
import viewsCards from "../../utils/viewsCards";
import config from "../../config";

import "./BodyMain.css";

import BodyMainAll from "./BodyMainAll";
import BodyMainProject from "./BodyMainProject";
import BodyMainStat from "./BodyMainStat";

function BodyMain({
  viewCard,
  searchTerm,
  setSearchTerm,
  triggerLoadCards,
  setTriggerLoadCards,
  setTotalFilteredCards,
  statusFilters,
  projectNameSelected,
}) {
  const developmentModeEnabled = config.developmentMode?.enabled || false;

  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const cardsPerPage = config.pagination.cardsPerPage;

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

      setCards(data);
      setFilteredCards(data);
      setTotalFilteredCards(data.length);
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  }, [statusFilters, setTotalFilteredCards, projectNameSelected]);

  // Load cards on component mount
  useEffect(() => {
    loadCards();
    setSearchTerm("");
  }, [loadCards, setSearchTerm]);

  // Filter cards based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(
        (card) =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCards(filtered);
      setTotalFilteredCards(filtered.length);
    }
    setCurrentPage(1);
  }, [searchTerm, cards, setTotalFilteredCards]);

  // Load cards when triggerLoadCards changes to true.
  useEffect(() => {
    if (triggerLoadCards) {
      loadCards();
      setTriggerLoadCards(false);
    }
  }, [triggerLoadCards, setTriggerLoadCards, loadCards]);

  // Handle card update
  const handleCardUpdate = async (updatedCardData) => {
    try {
      // console.log('handleCardUpdate called with:', updatedCardData);
      const { _id, title, description, status } = updatedCardData;
      const updatedCard = await updateCard(_id, {
        title,
        description,
        status,
      });
      // console.log('Update response:', updatedCard);
      setCards(
        cards.map((card) => (card._id === updatedCard._id ? updatedCard : card))
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
