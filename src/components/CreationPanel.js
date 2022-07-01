import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link } from "react-router-dom";

export default function CreationPanel() {
    const [name, setName] = useState('');
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/sessions')
            .then((results) => {
                setSessions(results.data)
            })
    },[])

    const showSessions = sessions.map(
        (session) => 
        <li key={session.sessionId}>
            {session.name}
            <Link to={"/publisher"} state={{ id: session.sessionId }}>
                <button>publish</button>
            </Link>
            <Link to={"/subscriber"} state={{ id: session.sessionId }}>
                <button>subscribe</button>
            </Link>
        </li>
    )

    const handleCreation = () => {
        axios.post('http://localhost:8080/createSession', {
            name: name
        }).then((result) => {
            var session = {name: name, sessionId: result.data}
            setSessions([...sessions, session])
        })
    }

    return (
        <div>
            <input value={name} onChange={(e) => setName(e.target.value)} type='text'/>
            <button onClick={handleCreation}>create session</button>
            <ul>
                {showSessions}
            </ul>
        </div>
    )
}