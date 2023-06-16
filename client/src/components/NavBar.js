import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap";
import { useLogoutUserMutation } from "../service/Api";
import { useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";

function NavBar() {

  const user = useSelector((state) => state.user);
  const [logoutUser] = useLogoutUserMutation();

  async function holdLogout(e) {
    e.preventDefault();
    await logoutUser(user);

    window.location.replace("/")
  }

  return (
    <Navbar id="nav" bg="light" expand="lg">
      <Container>
            <LinkContainer to="/">
                <Navbar.Brand id="text">DevJohn</Navbar.Brand>
            </LinkContainer>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user && (
              <>
            <LinkContainer to="/login">
                <Nav.Link id="text">Login</Nav.Link>
            </LinkContainer>
            <LinkContainer to="/register">
                <Nav.Link id="text">Register</Nav.Link>
            </LinkContainer>
              </>
              )}
            <LinkContainer to="/chats">
                <Nav.Link id="text">SpaceChat</Nav.Link>
            </LinkContainer>
            {user && (
              <>
              <NavDropdown title={
                  <>
                    <img src={user.picture} style={{ width: 30, height:30, marginRight: 10, objectFit: "cover", borderRadius: "50%" }} />
                    {user.firstName}
                  </>
              } id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Another action </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Item>
                <Button onClick={holdLogout}>
                    Logout
                </Button>
              </NavDropdown.Item>
            </NavDropdown>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavBar