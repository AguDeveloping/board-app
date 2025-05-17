import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import styled from 'styled-components';

const StyledNavbar = styled(Navbar)`
  background-color: #343a40;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.span`
  font-weight: 700;
  font-size: 1.5rem;
  color: white;
`;

const UserInfo = styled.span`
  color: #adb5bd;
  margin-right: 1rem;
`;

interface HeaderProps {
  username?: string;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <StyledNavbar variant="dark" expand="lg">
      <Container>
        <Navbar.Brand href="#">
          <Logo>Card Board</Logo>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav>
            {username && (
              <UserInfo className="d-flex align-items-center">
                Logged in as: <strong className="ms-1">{username}</strong>
              </UserInfo>
            )}
            <Button variant="outline-light" size="sm" onClick={onLogout}>
              Logout
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </StyledNavbar>
  );
};

export default Header;
