import { OTSession, OTStreams, OTSubscriber } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useState } from 'react';
import { useLocation } from "react-router-dom";

export default function Subscriber(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [token, setToken] = useState();

  useEffect(() => {
    axios.post('http://localhost:8080/token', {
      id: sessionId
    }).then((result) => {
      setToken(result.data)
    })
  },[])

  return(
    token ?
    <div id="videos">
      <OTSession apiKey="47527401" sessionId={sessionId} token={token}>
        <OTStreams>
          <OTSubscriber />
        </OTStreams>
      </OTSession>
    </div> : null
  )
}