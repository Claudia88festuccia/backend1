import React from "react";
import { Button, Container, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./styles.css";
import { logout } from "../../utils/auth"
import { useNavigate } from "react-router-dom"
import { getCurrentUser } from "../../utils/auth"

const user = getCurrentUser()


const NavBar = props => {
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <Navbar expand="lg" className="blog-navbar" fixed="top">
      <Container className="justify-content-between">
        <Navbar.Brand as={Link} to="/">
          <img className="blog-navbar-brand" alt="logo" src={logo} />
        </Navbar.Brand>


        <Button as={Link} to="/new" className="blog-navbar-add-button bg-dark" size="lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-plus-lg"
            viewBox="0 0 16 16"
          >
            <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z" />
          </svg>
          Nuovo Articolo
        </Button>
        <Button as={Link} to="/authors" className="blog-navbar-add-button bg-dark" size="lg">Autori</Button>
        <Button as={Link} to="/authors/new" className="blog-navbar-add-button bg-dark" size="lg">
          Nuovo Autore
        </Button>
        <Button onClick={handleLogout} variant="outline-light">
          Logout
        </Button>
        <Navbar>
          {user ? <span>Ciao, {user.email}</span> : <Link to="/login">Login</Link>}
        </Navbar>

      </Container>
    </Navbar>
  );
};

export default NavBar;
