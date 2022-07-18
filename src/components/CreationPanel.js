import axios from "axios";
import React, { useEffect, useState } from "react";
import {Link } from "react-router-dom";

export default function CreationPanel() {
    const [name, setName] = useState('');
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        axios.get('/sessions')
            .then((results) => {
                setSessions(results.data)
            })
    },[])

    const showSessions = sessions.map(
        (session) => 
        <li key={session.sessionId} className="list-group-item">
            <div className="row">
                <div className="col-sm" align="center">
                    {session.name}
                </div>
                <div className="col-sm" align="center">
                    <Link to={"/publisher"} state={{ id: session.sessionId }}>
                        <button className="btn btn-primary">publish</button>
                    </Link>
                </div>
                <div className="col-sm" align="center">
                    <Link to={"/subscriber"} state={{ id: session.sessionId }}>
                        <button className="btn btn-primary">subscribe</button>
                    </Link>
                </div>
            </div>
        </li>
    )

    const handleCreation = () => {
        axios.post('/createSession', {
            name: name
        }).then((result) => {
            var session = {name: name, sessionId: result.data}
            setSessions([...sessions, session])
        })
    }

    return (
        <div className="container">
            <div className="input-group mb-3 my-5">
                <input value={name} onChange={(e) => setName(e.target.value)} type='text' className="form-control"/>
                <div className="input-group-append">
                    <button onClick={handleCreation} className="btn btn-outline-secondary">create session</button>
                </div>
            </div>
            <ul className="list-group">
                {showSessions}
            </ul>
        </div>
    )
}