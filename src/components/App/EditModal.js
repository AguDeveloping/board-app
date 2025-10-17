import { Modal, Form, Button, Spinner, Col } from "react-bootstrap";

const EditModal = ({
  show,
  title,
  description,
  status,
  submitting,
  onClose,
  onSubmit,
  onTitleChange,
  onDescriptionChange,
  onStatusChange,
  id,
}) => (
  <Modal show={show} onHide={onClose}>
    <Modal.Header closeButton>
      <Col>
        <Modal.Title>Edit Card</Modal.Title>
        <p className="p-0 m-0 mt-2 ms-1 fs-8 text-muted">id: {id}</p>
      </Col>
    </Modal.Header>
    <Modal.Body>
      <Form onSubmit={onSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={title}
            onChange={onTitleChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={description}
            onChange={onDescriptionChange}
            required
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Select value={status} onChange={onStatusChange}>
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </Form.Select>
        </Form.Group>
        <div className="d-flex justify-content-end">
          <Button variant="secondary" onClick={onClose} className="me-2">
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
              "Save Changes"
            )}
          </Button>
        </div>
      </Form>
    </Modal.Body>
  </Modal>
);

export default EditModal;
