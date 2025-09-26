import { useState, useEffect } from "react";
import { Row, Col, Pagination, Spinner } from "react-bootstrap";
import { fetchCards, updateCard, deleteCard } from "../../services/api";
import config from "../../config";

import "./BodyMainAll.css";

import Card from "../App/Card";
import PaginationContainer from "../App/PaginationContainer";

const BodyMainAll = ({
  searchTerm = "",
  setSearchTerm,
  triggerLoadCards = false,
  setTriggerLoadCards,
  setTotalFilteredCards,
}) => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Load cards from API
  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await fetchCards();
      setCards(data);
      setFilteredCards(data);
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load cards on component mount
  useEffect(() => {
    loadCards();
    setSearchTerm("");
  }, []);

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
    }
    setCurrentPage(1);
  }, [searchTerm, cards]);

  // Update total filtered cards count.
  useEffect(() => {
    setTotalFilteredCards(filteredCards.length);
  }, [filteredCards, setTotalFilteredCards]);

  // Load cards when triggerLoadCards changes to true.
  useEffect(() => {
    if (triggerLoadCards) {
      loadCards();
      setTriggerLoadCards(false);
    }
  }, [triggerLoadCards, setTriggerLoadCards]);

  // Handle card update
  const handleCardUpdate = async (updatedCardData) => {
    try {
      const { _id, title, description, status } = updatedCardData;
      const updatedCard = await updateCard(_id, { title, description, status });
      setCards(
        cards.map((card) => (card._id === updatedCard._id ? updatedCard : card))
      );
    } catch (error) {
      console.error("Error updating card:", error);
      alert("Failed to update card. Please try again.");
    }
  };

  // Handle card deletion
  const handleCardDelete = async (id) => {
    try {
      await deleteCard(id);
      setCards(cards.filter((card) => card._id !== id));
    } catch (error) {
      console.error("Error deleting card:", error);
    }
  };

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

  return (
    <>
      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {filteredCards.length === 0 ? (
            <div className="text-center my-5">
              <p>
                No cards found.{" "}
                {searchTerm
                  ? "Try a different search term."
                  : "Create a new card to get started."}
              </p>
            </div>
          ) : (
            <Row>
              {currentCards.map((card) => (
                <Col key={card._id} sm={12} md={6} lg={4} className="mb-2">
                  <Card
                    id={card._id}
                    title={card.title}
                    description={card.description}
                    status={card.status}
                    onDelete={() => handleCardDelete(card._id)}
                    onUpdate={handleCardUpdate}
                  />
                </Col>
              ))}
            </Row>
          )}

          {filteredCards.length > cardsPerPage && (
            <PaginationContainer>
              <Pagination>{renderPaginationItems()}</Pagination>
            </PaginationContainer>
          )}
        </>
      )}
    </>
  );
};

export default BodyMainAll;
