import { createSession } from 'opentok-react';
import instance from '../axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import SubscriberLayout from './SubscriberLayout';

export default function Subscriber(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [streams, setStreams] = useState([]);
  const [hands, setHands] = useState([])
  const [selected, setSelected] = useState();
  const handsRef = useRef(hands);
  const streamsRef = useRef(streams);
  const selectedRef = useRef(selected);
  const session = useRef();

  useEffect(() => {
    instance.put('/token', {
      id: sessionId
    }).then((result) => {
      session.current = createSession({
        apiKey: result.data.key,
        sessionId: sessionId,
        token: result.data.token,
        onStreamsUpdated: streams => {}
      })
      session.current.session.on('signal:handUp', event => {
        var obj = event.from.id
        handsRef.current = [...handsRef.current, obj]
        setHands(handsRef.current)
      })
      session.current.session.on('signal:handDown', event => {
        handsRef.current = handsRef.current.filter(data => data !== event.from.id);
        setHands(handsRef.current)
      })
      session.current.session.on('streamCreated', event => {
        streamsRef.current = [...streamsRef.current, event.stream]
        setStreams(streamsRef.current)
      })
      session.current.session.on('streamDestroyed', event => {
        handsRef.current = handsRef.current.filter(data => data !== event.stream.connection.id);
        setHands(handsRef.current)
        if (selectedRef.current !== undefined && event.stream.id === streamsRef.current[selectedRef.current].streamId) {
          selectedRef.current = undefined;
          setSelected(selectedRef.current)
        }
        streamsRef.current = streamsRef.current.filter(data => data.id !== event.stream.id)
        setStreams(streamsRef.current)
      })
    }).catch((error) => {
      console.log(error)
    })
  },[sessionId])

  const modifySelected = (value) => {
    selectedRef.current = value
    setSelected(value)
  }

  return(
    streams.length ?
      <div>
        <SubscriberLayout
          streams={streams}
          selected={selected}
          modifySelected={modifySelected}
          session={session.current.session}
          hands={hands}
        />
      </div> : null
  )
}