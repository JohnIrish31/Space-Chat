import React, { useContext, useState } from 'react';
import { Col, Container, Form, Row, Button, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../service/Api"
import { AppContext } from '../context/appContext';

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();
  const { socket } = useContext(AppContext);
  const [loginUser, { isLoading, error }] = useLoginUserMutation();


  function holdLogin(e) {
    e.preventDefault()

    loginUser({ email, password }).then(({ data }) => {
      if (data) {
        socket.emit("new-user")
        Navigate("/chats")
      }
    })

  }

  return (
    <Container>
      <Row>
        <Col md={6} className="login-bg">
          
        </Col>
        <Col md={6} className="d-flex align-items-center justify-content-center flex-direction-column">
          <Form className="form" onSubmit={holdLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              {error && <p className="alert alert-danger">{error.data}</p>}
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)} value={email} required/>
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password"
              onChange={(e) => setPassword(e.target.value)} value={password} required/>
            </Form.Group>
            <Button id="login-btn" type="submit">
              {isLoading ? <Spinner animation="grow" /> : "Take Off"}
            </Button>
            <div className="py-4">
              <p className="text-center">
                Don't have an account? <Link to="/register">Register</Link>
              </p>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  )
}

export default Login