import { OTSession, OTPublisher } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";

export default function Publisher(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [token, setToken] = useState();
  const [video, setVideo] = useState(false);
  const publisher = useRef();

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

  return(
    token ?
    <div id="videos">
      <OTSession apiKey="47527401" sessionId={sessionId} token={token}>
        <OTPublisher ref={publisher} />
      </OTSession>
      <p>publishing...</p>
      <button onClick={handleVideo}>{video ? "turn on video" : "turn off video"}</button>
    </div> : null
  )
}