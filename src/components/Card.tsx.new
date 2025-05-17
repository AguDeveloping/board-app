import React, { useState } from 'react';
import { Card as BootstrapCard, Button, Modal, Form, Spinner } from 'react-bootstrap';
import styled from 'styled-components';
import { updateCard } from '../services/api';

const StyledCard = styled(BootstrapCard)`
  height: 100%;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CardTitle = styled(BootstrapCard.Title)`
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const CardDescription = styled(BootstrapCard.Text)`
  color: #6c757d;
  margin-bottom: 1rem;
`;

const CardStatus = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  margin-bottom: 1rem;
  background-color: ${({ status }) => {
    switch (status) {
      case 'todo':
        return '#e9ecef';
      case 'in-progress':
        return '#cff4fc';
      case 'done':
        return '#d1e7dd';
      default:
        return '#e9ecef';
    }
  }};
  color: ${({ status }) => {
    switch (status) {
      case 'todo':
        return '#495057';
      case 'in-progress':
        return '#055160';
      case 'done':
        return '#0f5132';
      default:
        return '#495057';
    }
  }};
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: auto;
`;

interface CardProps {
  id: string;
  title: string;
  description: string;
  status: string;
  onDelete: () => void;
}

const Card: React.FC<CardProps> = ({ id, title, description, status, onDelete }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editDescription, setEditDescription] = useState(description);
  const [editStatus, setEditStatus] = useState(status);
  const [submitting, setSubmitting] = useState(false);

  const handleCloseModal = () => {
    setShowEditModal(false);
    // Reset form values
    setEditTitle(title);
    setEditDescription(description);
    setEditStatus(status);
  };

  const handleShowModal = () => setShowEditModal(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await updateCard(id, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
      });
      // Update local state with new values
      // This would typically be handled by refetching cards or updating the parent component
      window.location.reload(); // Simple solution for now
    } catch (error) {
      console.error('Error updating card:', error);
    } finally {
      setSubmitting(false);
      handleCloseModal();
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      default:
        return status;
    }
  };

  return (
    <>
      <StyledCard>
        <BootstrapCard.Body className="d-flex flex-column">
          <CardStatus status={status}>{getStatusLabel(status)}</CardStatus>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <CardActions>
            <Button variant="outline-primary" size="sm" onClick={handleShowModal}>
              Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </CardActions>
        </BootstrapCard.Body>
      </StyledCard>

      <Modal show={showEditModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value)}
              >
                <option value="todo">To Do</option>
                <option value="in-progress">In Progress</option>
                <option value="done">Done</option>
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" onClick={handleCloseModal} className="me-2">
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
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Card;
