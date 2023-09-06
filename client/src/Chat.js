import React, { useEffect } from 'react'
import { useState } from 'react';
import ScrollToBottom from "react-scroll-to-bottom"

function Chat({socket, userid, chatRoom}){
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState([]);

    const sendMessage = async () => {
        if(currentMessage !== ""){
            const messageData = {
                chatRoom: chatRoom,
                author: userid, 
                message: currentMessage,
                time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
            };

            await socket.emit("send_message", messageData);
            setMessageList((list) => [...list, messageData])
            // will make it so after message is sent
            // it will refresh the text box
            setCurrentMessage("");
        }
    };

    useEffect(() => {
        // callback function for what to do to the received
        // message
        socket.on("receive_message", (data) => {
            // will get current previous message list which is list
            // and it will add the new message(data) on to the same list
            // ...list
            setMessageList((list) => [...list, data]);
        });
        return () => socket.removeListener("receive_message")
    }, [socket])


    return(
        <div className='chat-window'>
            <div className="chat-header">
                <p>Live Chat</p>
            </div>
            <div className="chat-body">
                <ScrollToBottom className="message-container">
                {messageList.map((messageContent) => {
                    return (
                    // This will distinguish the message between the user and the other person in the chat room
                    <div className="message" id={userid === messageContent.author ? "you" : "other"}>
                        <div> 
                            <div className='message-content'>
                                <p>{messageContent.message}</p>
                            </div>
                            <div className='message-meta'>
                                <p id="time">{messageContent.time}</p>
                                <p id="author">{messageContent.author}</p>
                            </div>
                        </div>
                    </div>
                    )
                })}
                </ScrollToBottom>
            </div>
            <div className="chat-footer">
                <input type="text" 
                 value={currentMessage}
                 placeholder='Hey...' 
                 onChange={(event) => {
                    setCurrentMessage(event.target.value);
                 }}   
                 onKeyDown={(event) => {event.key === "Enter" && sendMessage();
                }}
                />
                <button onClick={sendMessage}>&#9658;</button>
            </div>
        </div>
    )
}

export default Chat