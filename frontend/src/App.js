import React, { useEffect, useState } from "react";
import './App.css';
import io from "socket.io-client";
const socket=io.connect("http://localhost:3001");


function App() {

  const [name, setName] = useState("");
  const [roomName, setRoomName] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");
  const [allMessage, setAllMessage] = useState([]);

  useEffect(() => {
    // Listen for "receive_message" event
    socket.on('receive_message', (data) => {
      console.log("Received data:", data);
      // Update allMessage state with received data
      setAllMessage(prevAllMessages => [...prevAllMessages, data]);
    });

    // Clean up the event listener on component unmount
    return () => {
      socket.off('receive_message');
    };
  }, []);

  const submit = () => {
    const data = {
      name: name,
      roomName: roomName
    }

    socket.emit('join_room', data);
  }

  const messageSend = async () => {
    const data = {
      name: name,
      room: roomName,
      currentMessage: currentMessage
    }

    await socket.emit('send_message', data);
  }

  return (
    <div>
      <input placeholder="enter name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <input placeholder="enter room name" type="text" value={roomName} onChange={(e) => setRoomName(e.target.value)} />
      <button onClick={submit}>join</button>

      <div>
        <input placeholder="enter message" type="text" value={currentMessage} onChange={(e) => setCurrentMessage(e.target.value)} />
        <button onClick={messageSend}>send message</button>
      </div>
    </div>
  );
}

export default App;
