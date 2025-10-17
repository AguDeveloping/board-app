import { useState } from "react";
import { Card as BootstrapCard, Button } from "react-bootstrap";

import "./Card.css";

import EditModal from "./EditModal";
import { getStatusLabel } from "../../utils/getStatusLabel";

const Card = ({ id, title, description, status, onDelete, onUpdate }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Create an updated card object to pass to the parent component
      const updatedCardData = {
        _id: id,
        title: editTitle,
        description: editDescription,
        status: editStatus,
      };
      // console.log("ON card component - Submitting updated card:", updatedCardData);
      onUpdate(updatedCardData);

      handleCloseModal();
    } catch (error) {
      console.error("Error updating card:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <BootstrapCard className="styled-card">
        <div className="box-with-style">PROJECT / CARD</div>
        <BootstrapCard.Body className="d-flex flex-column">
          <span className={`card-status ${status}`}>
            {getStatusLabel(status)}
          </span>
          <BootstrapCard.Title className="card-title">
            {title.length > 30 ? title.substring(0, 30) + "..." : title}
          </BootstrapCard.Title>
          <BootstrapCard.Text className="card-description">
            {description.length > 70
              ? description.substring(0, 70) + "..."
              : description}
          </BootstrapCard.Text>
          <div className="card-actions">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={handleShowModal}
            >
              Edit
            </Button>
            <Button variant="outline-danger" size="sm" onClick={onDelete}>
              Delete
            </Button>
          </div>
        </BootstrapCard.Body>
      </BootstrapCard>

      <EditModal
        show={showEditModal}
        title={editTitle}
        description={editDescription}
        status={editStatus}
        submitting={submitting}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onTitleChange={(e) => setEditTitle(e.target.value)}
        onDescriptionChange={(e) => setEditDescription(e.target.value)}
        onStatusChange={(e) => setEditStatus(e.target.value)}
        id={id}
      />
    </>
  );
};

export default Card;
