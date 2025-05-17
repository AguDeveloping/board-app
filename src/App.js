import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Container, Row, Col, Pagination, Button, Modal, Form, Spinner, Badge } from 'react-bootstrap';
import { PersonCircle, ShieldLock, PlusCircleFill } from 'react-bootstrap-icons';
import Header from './components/Header';
import Footer from './components/Footer';
import Card from './components/Card';
import Login from './components/Login';
import Register from './components/Register';
import { fetchCards, createCard, deleteCard } from './services/api';
import { isAuthenticated, logout, getUser } from './services/auth';
import { generateSampleCards } from './utils/sampleCards';
import 'bootstrap/dist/css/bootstrap.min.css';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem 0;
`;

const SearchContainer = styled.div`
  position: relative;
  margin-bottom: 2rem;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #6c757d;
  &:hover {
    color: #343a40;
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

function App() {
  const [authenticated, setAuthenticated] = useState(isAuthenticated());
  const [user, setUser] = useState(getUser());
  const [cards, setCards] = useState([]);
  const [filteredCards, setFilteredCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');
  const [newCardStatus, setNewCardStatus] = useState('todo');
  const [submitting, setSubmitting] = useState(false);
  const [generatingSamples, setGeneratingSamples] = useState(false);
  const [showRegister, setShowRegister] = useState(false); // Toggle between login and register
  const cardsPerPage = 6;

  // Handle successful login
  const handleLoginSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
    loadCards();
  };
  
  // Handle successful registration
  const handleRegisterSuccess = () => {
    setAuthenticated(true);
    setUser(getUser());
    loadCards();
  };
  
  // Switch to registration form
  const handleSwitchToRegister = () => {
    setShowRegister(true);
  };
  
  // Switch to login form
  const handleSwitchToLogin = () => {
    setShowRegister(false);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    setAuthenticated(false);
    setUser(null);
  };

  // Load cards from API
  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await fetchCards();
      setCards(data);
      setFilteredCards(data);
    } catch (error) {
      console.error('Error loading cards:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter cards based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCards(cards);
    } else {
      const filtered = cards.filter(
        card =>
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCards(filtered);
    }
    setCurrentPage(1);
  }, [searchTerm, cards]);

  // Load cards on initial render if authenticated
  useEffect(() => {
    if (authenticated) {
      loadCards();
    }
  }, [authenticated]);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear search
  const handleClearSearch = () => {
    setSearchTerm('');
  };

  // Handle card update
  const handleCardUpdate = (updatedCard) => {
    setCards(cards.map(card => card._id === updatedCard._id ? updatedCard : card));
  };

  // Handle card deletion
  const handleCardDelete = async (id) => {
    try {
      await deleteCard(id);
      setCards(cards.filter(card => card._id !== id));
    } catch (error) {
      console.error('Error deleting card:', error);
    }
  };

  // Pagination logic
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = filteredCards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(filteredCards.length / cardsPerPage);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle modal open/close
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setNewCardTitle('');
    setNewCardDescription('');
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

      const createdCard = await createCard(newCard);
      setCards([...cards, createdCard]);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating card:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  // Handle sample card generation
  const handleGenerateSampleCards = async () => {
    setGeneratingSamples(true);
    try {
      const sampleCards = await generateSampleCards(10);
      setCards([...cards, ...sampleCards]);
      alert('10 sample cards have been generated successfully!');
    } catch (error) {
      console.error('Error generating sample cards:', error);
      alert('Failed to generate sample cards. Please try again.');
    } finally {
      setGeneratingSamples(false);
    }
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

  // If not authenticated, show login or registration screen
  if (!authenticated) {
    return showRegister ? (
      <Register 
        onRegisterSuccess={handleRegisterSuccess} 
        onSwitchToLogin={handleSwitchToLogin} 
      />
    ) : (
      <Login 
        onLoginSuccess={handleLoginSuccess} 
        onSwitchToRegister={handleSwitchToRegister} 
      />
    );
  }

  return (
    <AppContainer>
      <Header username={user?.username} onLogout={handleLogout} />
      <MainContent>
        <Container>
          <Row className="mb-4">
            <Col md={8}>
              <SearchContainer>
                <Form.Control
                  type="text"
                  placeholder="Search cards by title or description"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {searchTerm && (
                  <ClearButton onClick={handleClearSearch}>
                    ✕
                  </ClearButton>
                )}
              </SearchContainer>
            </Col>
            <Col md={4} className="d-flex justify-content-end align-items-start gap-2">
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
                  <p>No cards found. {searchTerm ? 'Try a different search term.' : 'Create a new card to get started.'}</p>
                </div>
              ) : (
                <Row>
                  {currentCards.map(card => (
                    <Col key={card._id} sm={12} md={6} lg={4} className="mb-4">
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
        </Container>
      </MainContent>

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
                    Creating...
                  </>
                ) : (
                  'Create Card'
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      <Footer />
    </AppContainer>
  );
}

export default App;
