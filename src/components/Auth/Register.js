import React, { useState } from 'react';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { PersonPlusFill } from 'react-bootstrap-icons';
import styled from 'styled-components';
import { register } from '../../services/auth';

const RegisterContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
`;

const RegisterCard = styled(Card)`
  width: 100%;
  max-width: 450px;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const CardHeader = styled(Card.Header)`
  background-color: #fff;
  border-bottom: none;
  padding: 30px 30px 0;
`;

const CardTitle = styled.h2`
  font-weight: 700;
  color: #333;
  margin-bottom: 10px;
  text-align: center;
`;

const CardSubtitle = styled.p`
  color: #6c757d;
  text-align: center;
  margin-bottom: 0;
`;

const CardBody = styled(Card.Body)`
  padding: 30px;
`;

const ToggleLink = styled.button`
  background: none;
  border: none;
  color: #007bff;
  padding: 0;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:hover {
    color: #0056b3;
  }
`;

const Register = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setError(null);
    setLoading(true);

    try {
      await register(username, email, password);
      onRegisterSuccess();
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message ||
        'Registration failed. Please try again with different credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <RegisterContainer fluid>
      <RegisterCard>
        <CardHeader>
          <CardTitle>Create Account</CardTitle>
          <CardSubtitle>Sign up to manage your cards</CardSubtitle>
        </CardHeader>
        <CardBody>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              className="w-100 py-2 fw-bold"
            >
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-2"
                  />
                  Registering...
                </>
              ) : (
                <>
                  <PersonPlusFill className="me-2" />
                  Create Account
                </>
              )}
            </Button>
          </Form>
          <div className="text-center mt-4">
            <p className="mb-0">
              Already have an account?{' '}
              <ToggleLink onClick={onSwitchToLogin}>
                Sign in
              </ToggleLink>
            </p>
          </div>
        </CardBody>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default Register;
