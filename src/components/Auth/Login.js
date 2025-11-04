import { useState } from "react";
import { Form, Button, Card, Container, Alert, Spinner } from "react-bootstrap";
import { toast } from "react-toastify";
import styled from "styled-components";
import { login } from "../../services/auth";

const LoginContainer = styled(Container)`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
`;

const LoginCard = styled(Card)`
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

const Login = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    if (!username || !password) {
      toast.error("Please enter username and password");
      return;
    }
    setError(null);
    setLoading(true);
    // Attempt login
    try {
      console.log("Request payload:", { username, password });
      console.log("API Auth URL:", `${process.env.REACT_APP_API_AUTH_URL}/login`);
      const response = await login(username, password);
      console.log("Login response data:", response);

      // ✅ Pass user data to the handler
      if (response && response.user) {
        onLoginSuccess(response.user); // ✅ Pass user object
        toast.success(`Welcome back, ${response.user.username}!`);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("Login failed. Please check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginContainer fluid>
      <LoginCard>
        <CardHeader>
          <CardTitle>Card Board App</CardTitle>
          <CardSubtitle>Sign in to manage your cards</CardSubtitle>
        </CardHeader>
        <CardBody>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              disabled={loading}
              className="w-100 py-2"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Form>
          <div className="text-center mt-4">
            <p className="mb-2">
              Don't have an account?{" "}
              <ToggleLink onClick={onSwitchToRegister}>Sign up now</ToggleLink>
            </p>
            <small className="text-muted">
              Default credentials: admin / admin123
            </small>
          </div>
        </CardBody>
      </LoginCard>
    </LoginContainer>
  );
};

export default Login;
