import { useState } from "react";
import { Row, Col, Button, Form, Spinner, Badge, Modal } from "react-bootstrap";
import { PlusCircleFill } from "react-bootstrap-icons";
import { createCard } from "../../services/api";
import { generateSampleCards } from "../../utils/sampleCards";

import SearchContainer from "../App/SearchContainer";
import ClearButton from "../App/ClearButton";

import "./BodyHeadAll.css";

const BodyHeadAll = ({
  searchTerm,
  setSearchTerm,
  setTriggerLoadCards,
  totalFilteredCards,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDescription, setNewCardDescription] = useState("");
  const [newCardStatus, setNewCardStatus] = useState("todo");
  const [submitting, setSubmitting] = useState(false);

  const [generatingSamples, setGeneratingSamples] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm("");
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

  // Handle sample card generation
  const handleGenerateSampleCards = async () => {
    setGeneratingSamples(true);
    try {
      await generateSampleCards(10);
      setTriggerLoadCards(true);
      alert("10 sample cards have been generated successfully!");
    } catch (error) {
      console.error("Error generating sample cards:", error);
      alert("Failed to generate sample cards. Please try again.");
    } finally {
      setGeneratingSamples(false);
    }
  };

  return (
    <Col className="layout-main">
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
        </Col>
        <Col
          md={6}
          className="d-flex justify-content-end align-items-start gap-2"
        >
          <Button
            variant="success"
            onClick={handleGenerateSampleCards}
            disabled={generatingSamples}
          >
            {generatingSamples ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Generating...
              </>
            ) : (
              <>
                <PlusCircleFill className="me-2" />
                Add 10 Sample Cards
              </>
            )}
          </Button>
          <Button variant="primary" onClick={handleShowModal}>
            Create New Card
          </Button>
        </Col>
      </Row>
      <Row className="main-item m-0 p-0">
        <Col className="m-0 p-0">
          <p className="m-0 p-0 ps-3">
            Total Cards: <Badge bg="secondary">{totalFilteredCards}</Badge>
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
                <option value="in-progress">In Progress</option>
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
