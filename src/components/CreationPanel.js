import instance from "../axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function CreationPanel() {
    const [sessionId, setSessionId] = useState('');

    const handleCreation = () => {
        instance.get('/session').then((result) => {
            setSessionId(result.data)
        }).catch((error) => {
            console.log(error)
        })
    }

    return (
        <div className="container">
            <div className="input-group mb-3 my-5">
                <div className="input-group-append">
                    <button onClick={handleCreation} className="btn btn-primary">create session</button>
                </div>
                <input value={sessionId} onChange={e => setSessionId(e.target.value)} type='text' className="form-control"/>
                <div className="input-group-append">
                    <Link to={"/publisher"} state={{ id: sessionId }}>
                        <button className="btn btn-outline-secondary" disabled={!sessionId.length}>publish to session</button>
                    </Link>
                    <Link to={"/subscriber"} state={{ id: sessionId }}>
                        <button className="btn btn-outline-secondary" disabled={!sessionId.length}>subscribe to session</button>
                    </Link>
                </div>
            </div>
            <div>
                <p className="lead">Create and use the id to connect to the session from other devices.</p>
            </div>
        </div>
    )
}