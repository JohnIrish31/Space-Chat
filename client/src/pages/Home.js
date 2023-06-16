import React from 'react';
import { Row, Col, Button } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";

function Home() {
  return (
    <Row id="home" className='mx-auto'>
      <Col md={6} className="text-center d-flex flex-direction-column align-items-center justify-content-center pt-5">
        <div>
          <h1>Build A Meaningful Coversation Within Space</h1>
          <p>Space Chat Brings You to Outer Space</p>
          <LinkContainer to="chats">
            <Button id="home-btn">
              See The Space <i className="fa-solid fa-user-astronaut"></i>
            </Button>            
          </LinkContainer>
        </div>
      </Col>
      <Col md={6} className="home-bg"></Col>
    </Row>
  )
}

export default Home