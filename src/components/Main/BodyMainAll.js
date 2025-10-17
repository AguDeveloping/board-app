import { Row, Col, Pagination, Spinner } from "react-bootstrap";

import "./BodyMainAll.css";

import Card from "../App/Card";
import PaginationContainer from "../App/PaginationContainer";

const BodyMainAll = ({
  filteredCards,
  searchTerm = "",
  loading,
  currentCards,
  renderPaginationItems,
  cardsPerPage,
  handleCardDelete,
  handleCardUpdate,
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
            <Row>
              {currentCards.map((card) => (
                <Col key={card._id} sm={12} md={6} lg={4} className="mb-2">
                  <Card
                    id={card._id}
                    title={card.title}
                    description={card.description}
                    status={card.status}
                    onUpdate={handleCardUpdate}
                    onDelete={() => handleCardDelete(card._id)}
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
