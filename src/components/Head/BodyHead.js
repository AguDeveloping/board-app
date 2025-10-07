import { useState } from "react";
import { Row, Col, Button, Form, Spinner, Badge, Modal } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { createCard } from "../../services/api";
import config from "../../config";

import "./BodyHead.css";

import SearchContainer from "../App/SearchContainer";
import ClearButton from "../App/ClearButton";

const BodyHeadAll = ({
  searchTerm,
  setSearchTerm,
  setTriggerLoadCards,
  totalFilteredCards,
  statusFilters,
  setStatusFilters,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [newCardStatus, setNewCardStatus] = useState("todo");
  const [submitting, setSubmitting] = useState(false);

  const handleStatusChange = (e) => {
    const { name, checked } = e.target;
    setStatusFilters((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const developmentModeEnabled = config.developmentMode?.enabled || false;

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
    setTriggerLoadCards(true);
  };

  // Handle card creation
  const handleCreateCard = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const newCard = {
        title: newCardTitle,
        description: newCardDescription,
        status: newCardStatus,
      };

      await createCard(newCard);
      setTriggerLoadCards(true);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating card:", error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle modal open/close
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewCardTitle("");
    setNewCardDescription("");
  };

  return (
    <Col className={`layout-main${developmentModeEnabled ? " dev-mode" : ""}`}>
      <Row className="main-item">
        <Col md={6}>
          <SearchContainer>
            <Form.Control
              type="text"
              placeholder="Search cards by title or description"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            {searchTerm && (
              <ClearButton onClick={handleClearSearch}>✕</ClearButton>
            )}
          </SearchContainer>
          {/* Checkboxes for status filters */}
          <Form className="mt-2 ms-1">
            <div className="d-flex gap-4">
              <Form.Check
                type="checkbox"
                label="Todo"
                name="todo"
                checked={statusFilters.todo}
                onChange={handleStatusChange}
              />
              <Form.Check
                type="checkbox"
                label="Doing"
                name="doing"
                checked={statusFilters.doing}
                onChange={handleStatusChange}
              />
              <Form.Check
                type="checkbox"
                label="Done"
                name="done"
                checked={statusFilters.done}
                onChange={handleStatusChange}
              />
            </div>
          </Form>
        </Col>
        <Col
          md={6}
          className="d-flex justify-content-end align-items-start gap-4"
        >
          <Button variant="primary" /* onClick={handleShowModal}*/ disabled>
            <PlusCircleFill className="me-2 mb-1" />
            Create New Project
          </Button>
          <Button variant="primary" onClick={handleShowModal}>
            <PlusCircleFill className="me-2 mb-1" />
            Create New Card
          </Button>
        </Col>
      </Row>
      <Row className="main-item m-0 p-0 me-3 mt-3 justify-content-end">
        <Col xs="auto" className="m-0 p-0 fs-5">
          <p className="m-0 p-0 ps-3">
            Total Cards{" "}
            <Badge className="p-3 fs-6" bg="secondary">
              {totalFilteredCards}
            </Badge>
          </p>
        </Col>
      </Row>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleCreateCard}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter card title"
                value={newCardTitle}
                onChange={(e) => setNewCardTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter card description"
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={newCardStatus}
                onChange={(e) => setNewCardStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="doing">Doing</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="me-2"
              >
                Cancel
              </Button>
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Creating...
                  </>
                ) : (
                  "Create Card"
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Col>
  );
};

export default BodyHeadAll;
