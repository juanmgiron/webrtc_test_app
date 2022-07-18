import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import PublisherVideo from './PublisherVideo';

export default function Publisher(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [token, setToken] = useState();
  const name = useRef();

  useEffect(() => {
    name.current = 'user' + Math.floor((Math.random() * 1000) + 1);
    axios.post('/token', {
      id: sessionId
    }).then((result) => {
      setToken(result.data)
    })
  },[])

  return(
    token ?
    <PublisherVideo token={token} sessionId={sessionId} name={name.current} /> : null
  )
}