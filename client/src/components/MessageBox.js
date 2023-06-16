import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Col, Form, Row } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AppContext } from '../context/appContext';

function MessageBox() {
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.user);
  const { socket, currentGroupChat, messages, setMessages, directMsg } = useContext(AppContext)
  const messageEndRef = useRef(null)

  useEffect(() => {
        scrollToBottom()
    }, [messages])

  function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    let month = (1 + date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;
    let day = date.getDate().toString();

    day = day.length > 1 ? day : "0" + day;

    return month + "/" + day + "/" + year;
  }

  function holdSubmit(e) {
    e.preventDefault();
  }

  function scrollToBottom() {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const todayDate = getFormattedDate();
  socket.off("room-messages").on("room-messages", (roomMessages) => {
    console.log("room messages", roomMessages)
    setMessages(roomMessages)
  });


  function holdSubmit(e) {
    e.preventDefault();
    if (!message) return;
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;
    const gcId = currentGroupChat
    socket.emit("message-room", gcId, message, user, time, todayDate)
    setMessage("");
  }

  return (
    <>
      <div className="chat-output">
        {user && !directMsg?._id && <div className="alert alert-info">You are in the {currentGroupChat} space</div>}
        {user && directMsg?._id && (
          <>
          <div className="alert alert-info conversation-info">
              <div>
                  Your conversation with {directMsg.firstName} <img src={directMsg.picture} className="conversation-profile-pic" />
              </div>
          </div>
          </>
      )}
        {!user && <div className='alert alert-danger'>Login First Ranger</div>}

        {user &&
          messages.map(({ _id: date, messagesByDate }, idx) => (
            <div key={idx}>
              <p className="alert alert-info text-center  message-date-indicator">{date}</p>
              {messagesByDate?.map(({ content, time, from: sender }, msgIdx) => (
                <div className={sender?.email == user?.email ? "message" : "incoming-message"} key={msgIdx}>
                  <div className="message-inner">
                    <div className="d-flex align-items-center mb-3">
                      <img src={sender.picture} style={{ width: 35, height: 35, objectFit: 'cover', borderRadius: "50%", marginRight: 10 }} />
                      <p className="message-sender">{sender._id == user?._id ? "You" : sender.firstName } </p>
                    </div>
                    <p className="message-content">{content}</p>
                    <p className="message-timestamp-left">{ time }</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
          <div ref={messageEndRef}/>
      </div>
        <Form onSubmit={holdSubmit}>
          <Row>
            <Col md={11}>
              <Form.Group>
                <Form.Control type="text" placeholder="Report Here" disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={1}>
                <Button id="msg-btn" type="submit" disabled={!user}>
                  <i className="fa solid fa-rocket"></i>
                </Button>
            </Col>
          </Row>
        </Form>
    </>
  )
}

export default MessageBox