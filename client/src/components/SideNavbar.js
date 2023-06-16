import React, { useContext, useEffect } from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from "react-redux";
import { AppContext } from '../context/appContext';
import { addNotifications, resetNotifications } from "../Feat/UserSlice";

function SideNavbar() {

  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { socket, setBuddy, buddy, setCurrentGroupChat, currentGroupChat, groupChat, setGroupChat, directMsg, setDirectMsg } = useContext(AppContext);
  socket.off("new-user").on("new-user", (payload) => {
    setBuddy(payload);
  });

  function joinChat(room, isPublic = true) {
    if (!user) {
      return alert("Login Ranger")
    }

    socket.emit("join-room", room, currentGroupChat);
    setCurrentGroupChat(room);

    if (isPublic) {
      setDirectMsg(null)
    }

    dispatch(resetNotifications(room));
  }

  socket.off("notifications").on("notifications", (room) => {
    if (currentGroupChat != room) dispatch(addNotifications(room));
  });

  
   useEffect(() => {
    if (user) {
      setCurrentGroupChat("general");
      getRooms();
      socket.emit("join-room", "general");
      socket.emit("new-user");
      }
  }, [])

  
  function getRooms() {
    fetch("http://localhost:4001/groupChat")
      .then((res) => res.json())
      .then(data => setGroupChat(data));
  }

  function orderIds(id1, id2) {
        if (id1 > id2) {
            return id1 + "-" + id2;
        } else {
            return id2 + "-" + id1;
        }
    }


  function holdDirectMsg(member) {
    setDirectMsg(member);
    const roomId = orderIds(user._id, member._id)
    joinChat(roomId, false);
  }

   if (!user) {
    return null
  }

  

  return (
    <>
      <h2 id="text2" className='mt-5 mb-3 text-center'>Space Room</h2>
      <ListGroup>
        {groupChat.map((space, idx) => (
          <ListGroup.Item id="rooms-bg" key={idx} onClick={() => joinChat(space)} active={space == currentGroupChat}
          style={{cursor: 'pointer', display: "flex", justifyContent: "space-between"}}>
            {space} {currentGroupChat !== space && <span className="badge rounded-pill bg-secondary">{user.newMessages[space]}</span>}
          </ListGroup.Item>
        ))}
      </ListGroup>
      <h2 id="text2" className='text-center mt-5 mb-3'>Other Rangers</h2>
      <ListGroup>
          {buddy.map((member) => (
        <ListGroup.Item id="rooms-bg" key={member.id} style={{ cursor: "pointer" }} active={directMsg?._id == member?._id} onClick={() => holdDirectMsg(member)}
          disabled={member._id === user._id}>
          <Row>
              <Col xs={2} className="member-status">
                  <img src={member.picture} className="member-status-img" />
                  {member.status == "online" ? <i className="fas fa-circle sidebar-online-status"></i> : <i className="fas fa-circle sidebar-offline-status"></i>}
              </Col>
              <Col xs={9}>
                  {member.firstName}
                  {member._id === user?._id && " (You)"}
                  {member.status == "offline" && " (Offline)"}
              </Col>
              <Col xs={1}>
                  <span className="badge rounded-pill bg-secondary">{user.newMessages[orderIds(member._id, user._id)]}</span>
              </Col>
          </Row>
        </ListGroup.Item>
            ))}
      </ListGroup>
      
    </>
  )
}

export default SideNavbar

