import { OTSession, OTStreams, OTSubscriber } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";

export default function Subscriber(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [token, setToken] = useState();
  const [messages, setMessages] = useState([]);
  const messagesRef = useRef(messages);

  useEffect(() => {
    axios.post('http://localhost:8080/token', {
      id: sessionId
    }).then((result) => {
      setToken(result.data)
    })
  },[])

  const eventHandlers = {
    'signal:msg': event => {
      var msg = event.data.name + ': ' + event.data.message
      messagesRef.current = [...messagesRef.current, msg]
      setMessages(messagesRef.current)
    }
  }

  const showMessages = messages.map((message) => <li>{message}</li>)

  return(
    token ?
    <div id="videos">
      <OTSession apiKey="47527401" sessionId={sessionId} token={token} eventHandlers={eventHandlers}>
        <OTStreams>
          <OTSubscriber />
        </OTStreams>
      </OTSession>
      <div style={{border: '2px solid black', height: 100, overflow: 'scroll', display: 'flex', flexDirection: 'column-reverse'}}>
        <ul style={{listStyleType: 'none'}}>
          {showMessages}
        </ul>
      </div>
    </div> : null
  )
}