import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import NavBar from './components/NavBar';
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SpaceChat from "./pages/SpaceChat";
import { useSelector } from "react-redux";
import { useState } from 'react';
import { AppContext, socket } from "./context/appContext";


function App() {
  const [groupChat, setGroupChat] = useState([]);
  const [currentGroupChat, setCurrentGroupChat] = useState([]);
  const [buddy, setBuddy] = useState([]);
  const [messages, setMessages] = useState([]);
  const [directMsg, setDirectMsg] = useState({});
  const [newMsgs, setNewMsgs] = useState({});

  const user = useSelector((state) => state.user);

  return (
    <AppContext.Provider value={{socket,groupChat, setGroupChat, currentGroupChat, setCurrentGroupChat, buddy, setBuddy, messages, setMessages, directMsg, setDirectMsg, newMsgs, setNewMsgs}}>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          {!user && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          <Route path="/chats" element={< SpaceChat />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
    

  )
}

export default App;
