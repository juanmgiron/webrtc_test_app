import axios from "axios";
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
    axios.put('https://cors-everywhere.herokuapp.com/http://sitterpocbackend-env.eba-zb3abxvr.us-east-2.elasticbeanstalk.com/token', {
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