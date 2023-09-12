import './App.css';
import { useState } from 'react';
import io from 'socket.io-client'
import Chat from './Chat';

const socket = io.connect("http://localhost:3001");

function App() {
  const [userid, setUserId] = useState("");
  const [chatRoom, setChatRoom] = useState("");
  const [showChat, setShowChat] = useState(false);


  const joinChatRoom = () => {
    if(userid !== "" && chatRoom !== ""){
      // this will sent the room id to the back end
      socket.emit("join_room", chatRoom);
      setShowChat(true);
    }
  };



  return (
    <div className="App">
      {!showChat ? (
      <div className="joinChatContainer">
        <h3>Chatter App
            
        </h3>
        <input type="text" placeholder="John..." 
          onChange={(event) =>{ 
            setUserId(event.target.value)
        }}/>
        <input type="text" placeholder="Room Id...."
          onChange={(event) =>{ 
            setChatRoom(event.target.value)
          }}
        />
        <button onClick={joinChatRoom}>Join a Room</button>
      </div>
      ) : (
      <Chat socket={socket} userid={userid} chatRoom={chatRoom}/>
      )}
    </div>
  );
}

export default App;
