import { useEffect, useState } from "react";
import { Col, Row, Spinner } from "react-bootstrap";
import { fetchCards } from "../../services/api";

import Card from "../Card";

import "./BodyMainProject.css";

const BodyMainProject = ({
  searchTerm = "",
  setSearchTerm,
  searchProject = "",
  setTotalFilteredCards,
}) => {
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);

  const [loading, setLoading] = useState(true);

  // Load cards from API
  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await fetchCards();
      setCards(data);
      setTotalFilteredCards(data.length);
      console.log("Cards loaded in BodyMainProject:", data.length);
      console.log("Search Term:", searchTerm);
      console.log("Search Project:", searchProject);
      console.log("data:\n" + JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter cards based on search term and project
  useEffect(() => {
    loadCards();
  }, [searchProject, searchTerm]);
  // }, []);

  // load cards on component mount
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
  }, [searchTerm, cards]);

  // Update total filtered cards count.
  useEffect(() => {
    setTotalFilteredCards(filteredCards.length);
  }, [filteredCards, setTotalFilteredCards]);

  return (
    <Col className="layout-main">
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
              <Col>
                <h4 className="text-center my-2">To Do</h4>
                <Col className="project-column-scroll">
                  {filteredCards
                    .filter((card) => card.status === "todo")
                    .map((card, id) => (
                      <div key={id} className="vertical-card">
                        <Card
                          key={id}
                          id={card._id}
                          title={card.title}
                          description={card.description}
                          status={card.status}
                          // onDelete={() => {}}
                          // onUpdate={() => {}}
                        />
                      </div>
                    ))}
                </Col>
              </Col>
              <Col>
                <h4 className="text-center my-2">In Progress</h4>
                <Col className="project-column-scroll">
                  {filteredCards
                    .filter((card) => card.status === "in-progress")
                    .map((card, id) => (
                      <div key={id} className="vertical-card">
                        <Card
                          key={id}
                          id={card._id}
                          title={card.title}
                          description={card.description}
                          status={card.status}
                          // onDelete={() => {}}
                          // onUpdate={() => {}}
                        />
                      </div>
                    ))}
                </Col>
              </Col>
              <Col>
                <h4 className="text-center my-2">Done</h4>
                <Col className="project-column-scroll">
                  {filteredCards
                    .filter((card) => card.status === "done")
                    .map((card, id) => (
                      <div key={id} className="vertical-card">
                        <Card
                          key={id}
                          id={card._id}
                          title={card.title}
                          description={card.description}
                          status={card.status}
                          // onDelete={() => {}}
                          // onUpdate={() => {}}
                        />
                      </div>
                    ))}
                </Col>
              </Col>
            </Row>
          )}
        </>
      )}
    </Col>
  );
};

export default BodyMainProject;
