import React from 'react'
import { Container, Row, Col } from "react-bootstrap";
import SideNavBar from "../components/SideNavbar"
import MessageBox from "../components/MessageBox"

function SpaceChat() {
  return (
    <Container>
      <Row>
        <Col md={4}>
            <SideNavBar />
        </Col>
        <Col md={8}>
            <MessageBox />
        </Col>
      </Row>
    </Container>
  )
}

export default SpaceChat