import { OTSession, OTPublisher } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";

export default function Publisher(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [token, setToken] = useState();
  const [video, setVideo] = useState(false);
  const [message, setMessage] = useState('');
  const publisher = useRef();
  const session = useRef();

  useEffect(() => {
    axios.post('http://localhost:8080/token', {
      id: sessionId
    }).then((result) => {
      setToken(result.data)
    })
  },[])

  const handleVideo = () => {
    publisher.current.getPublisher().publishVideo(video)
    setVideo(!video)
  }

  const sendMessage = () => {
    session.current.sessionHelper.session.signal({
      type: 'msg',
      data: message
    }, function(error) {
      if (error) {
        console.log('Error sending signal:', error.name, error.message);
      } else {
        setMessage('')
      }
    })
  }

  return(
    token ?
    <div id="videos">
      <OTSession apiKey="47527401" sessionId={sessionId} token={token} ref={session}>
        <OTPublisher ref={publisher} />
      </OTSession>
      <p>publishing...</p>
      <button onClick={handleVideo}>{video ? "turn on video" : "turn off video"}</button>
      <br/>
      <input value={message} onChange={(e) => setMessage(e.target.value)} type='text'/>
      <button onClick={sendMessage}>{"send message"}</button>
    </div> : null
  )
}