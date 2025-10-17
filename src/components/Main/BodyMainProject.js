import { Col, Row, Spinner } from "react-bootstrap";

import Card from "../App/Card";

import "./BodyMainProject.css";

const BodyMainProject = ({
  loading,
  filteredCards,
  searchTerm = "",
  handleCardUpdate,
  handleCardDelete,
}) => {
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
            <div className="text-center my-5 text-secondary">
              <h4>
                No cards found.{" "}
                {searchTerm
                  ? "Try a different search term."
                  : "Create a new card to get started."}
              </h4>
            </div>
          ) : (
            <Row className="project-columns">
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
                          onUpdate={handleCardUpdate}
                          onDelete={() => handleCardDelete(card._id)}
                        />
                      </div>
                    ))}
                </Col>
              </Col>
              <Col>
                <h4 className="text-center my-2">Doing</h4>
                <Col className="project-column-scroll">
                  {filteredCards
                    .filter((card) => card.status === "doing")
                    .map((card, id) => (
                      <div key={id} className="vertical-card">
                        <Card
                          key={id}
                          id={card._id}
                          title={card.title}
                          description={card.description}
                          status={card.status}
                          onUpdate={handleCardUpdate}
                          onDelete={() => handleCardDelete(card._id)}
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
                          onUpdate={handleCardUpdate}
                          onDelete={() => handleCardDelete(card._id)}
                        />
                      </div>
                    ))}
                </Col>
              </Col>
            </Row>
          )}
        </>
      )}
    </>
  );
};

export default BodyMainProject;
