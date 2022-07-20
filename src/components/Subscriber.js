import { createSession, OTSubscriber } from 'opentok-react';
import axios from "axios";
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from "react-router-dom";
import { Button, Grid } from '@mui/material';
import HandsDialog from './HandsDialog';

export default function Subscriber(){
  const location = useLocation();
  const sessionId = location.state.id;
  const [token, setToken] = useState();
  const [streams, setStreams] = useState([]);
  const [open, setOpen] = useState(false);
  const [hands, setHands] = useState([])
  const handsRef = useRef(hands);
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
      setToken(result.data)
    })
  },[])

  const handleClose = () => setOpen(false)

  return(
    token ?
    <div>
      <Grid container spacing={2}>
        {streams.map(stream => {
          return (
            <Grid item xs={4}>
              <OTSubscriber
                key={stream.id}
                session={session.current.session}
                stream={stream}
              />
            </Grid>
          );
        })}
      </Grid>
      <Button onClick={() => setOpen(true)} variant="outlined" style={{position: "absolute", right: 50, bottom: 50}}>{"Raised hands: " + hands.length}</Button>
      <HandsDialog 
        open={open}
        onClose={handleClose}
        users={hands}
      />
    </div> : null
  )
}