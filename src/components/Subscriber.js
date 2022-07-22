import { createSession, OTSubscriber } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Button } from '@mui/material';
import HandsDialog from './HandsDialog';
import initLayoutContainer from 'opentok-layout-js';

export default function Subscriber(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [streams, setStreams] = useState([]);
  const [open, setOpen] = useState(false);
  const [hands, setHands] = useState([])
  const handsRef = useRef(hands);
  const streamsRef = useRef(streams);
  const session = useRef();
  const layout = initLayoutContainer({
    containerWidth: 1376,
    containerHeight: 811
  });

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
    var subscribers = [];
    for (var i = 0; i < count; i++) {
      subscribers.push({
        width: 640,
        height: 480,
        big: false
      })
    }
    var { boxes } = layout.getLayout(subscribers);
    var screens = [];
    for (var i = 0; i < count; i++) {
      screens.push(<OTSubscriber
        key={streams[i].id}
        session={session.current.session}
        stream={streams[i]}
        properties={{height: boxes[i].height, width: boxes[i].width}}
        style={{position: "absolute", top: boxes[i].top, left: boxes[i].left}}
      />)
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