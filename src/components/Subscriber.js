import { createSession, OTSubscriber } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";

export default function Subscriber(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [token, setToken] = useState();
  const [messages, setMessages] = useState([]);
  const [streams, setStreams] = useState([]);
  const messagesRef = useRef(messages);
  const streamsRef = useRef(streams);
  const session = useRef();

  useEffect(() => {
    axios.post('/token', {
      id: sessionId
    }).then((result) => {
      session.current = createSession({
        apiKey: '47527401',
        sessionId: sessionId,
        token: result.data,
        onStreamsUpdated: streams => {}
      })
      session.current.session.on('signal:msg', event => {
        var msg = event.data.name + ' raised their hand'
        messagesRef.current = [...messagesRef.current, msg]
        setMessages(messagesRef.current)
      })
      session.current.session.on('streamCreated', event => {
        streamsRef.current = [...streamsRef.current, event.stream]
        setStreams(streamsRef.current)
      })
      setToken(result.data)
    })
  },[])

  const showMessages = messages.map((message) => <li>{message}</li>)

  return(
    token ?
    <div id="videos" className='container-fluid main-container' style={{float:"left"}}>
      <div className="row">
        {streams.map(stream => {
          return (
            <div className="col-sm">
              <OTSubscriber
                key={stream.id}
                session={session.current.session}
                stream={stream}
              />
            </div>
          );
        })}
      </div>
      <div style={{border: '2px solid black', height: 100, overflow: 'scroll', display: 'flex', flexDirection: 'column-reverse'}}>
        <ul style={{listStyleType: 'none'}}>
          {showMessages}
        </ul>
      </div>
    </div> : null
  )
}