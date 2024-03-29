import instance from '../axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import PublisherVideo from './PublisherVideo';

export default function Publisher(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [credentials, setCredentials] = useState();
  const name = useRef();

  useEffect(() => {
    name.current = 'user' + Math.floor((Math.random() * 1000) + 1);
    instance.put('/token', {
      id: sessionId
    }).then((result) => {
      setCredentials({
        key: result.data.key,
        token: result.data.token
      })
    }).catch((error) => {
      console.log(error)
    })
  },[sessionId])

  return(
    credentials ?
    <PublisherVideo token={credentials.token} apiKey={credentials.key} sessionId={sessionId} name={name.current} /> : null
  )
}