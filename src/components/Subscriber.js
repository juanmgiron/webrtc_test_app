import { createSession, OTSubscriber } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import HandsDialog from './HandsDialog';

export default function Subscriber(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [streams, setStreams] = useState([]);
  const [open, setOpen] = useState(false);
  const [hands, setHands] = useState([])
  const [selected, setSelected] = useState();
  const handsRef = useRef(hands);
  const streamsRef = useRef(streams);
  const session = useRef();

  useEffect(() => {
    axios.post('/token', {
      id: sessionId
    }).then((result) => {
      session.current = createSession({
        apiKey: result.data.key,
        sessionId: sessionId,
        token: result.data.token,
        onStreamsUpdated: streams => {}
      })
      session.current.session.on('signal:handUp', event => {
        var obj = {id: event.from.id, name: event.data.name}
        handsRef.current = [...handsRef.current, obj]
        setHands(handsRef.current)
      })
      session.current.session.on('signal:handDown', event => {
        handsRef.current = handsRef.current.filter(data => data.id != event.from.id);
        setHands(handsRef.current)
      })
      session.current.session.on('streamCreated', event => {
        streamsRef.current = [...streamsRef.current, event.stream]
        setStreams(streamsRef.current)
      })
      session.current.session.on('streamDestroyed', event => {
        handsRef.current = handsRef.current.filter(data => data.id != event.stream.connection.id);
        setHands(handsRef.current)
        streamsRef.current = streamsRef.current.filter(data => data.id != event.stream.id)
        setStreams(streamsRef.current)
      })
    })
  },[])

  const handleClose = () => setOpen(false)

  const handleLayout = () => {
    var count = streamsRef.current.length;
    var screens = [];
    if (selected === undefined) {
      for (let i = 0; i < count; i++) {
        screens.push(
        <div onClick={() => setSelected(i)} key={i}>
          <OTSubscriber
            key={streams[i].id}
            session={session.current.session}
            stream={streams[i]}
            properties={{height: 210, width: 280}}
            style={{position: "absolute", top: Math.floor(i/6)*210, left: (i%6)*280}}
          />
        </div>)
      }
    } else {
      screens.push(
      <div onClick={() => setSelected(undefined)}>
        <OTSubscriber
          key={streams[selected].id}
          session={session.current.session}
          stream={streams[selected]}
          properties={{height: 900, width: 1200}}
          style={{position: "absolute", top: 0, left: 0}}
        />
      </div>)
    }
    return <div id="layout" style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 150}}>{screens}</div>
  }

  return(
    <div>
      {handleLayout()}
      <Button onClick={() => setOpen(true)} variant="outlined" style={{position: "absolute", right: 50, bottom: 50}}>{"Raised hands: " + hands.length}</Button>
      <HandsDialog 
        open={open}
        onClose={handleClose}
        users={hands}
      />
    </div>
  )
}