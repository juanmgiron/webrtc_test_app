import { OTSession, OTPublisher } from 'opentok-react';
import React, { useEffect, useRef, useState } from 'react';
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";
import { drawLandmarks } from '@mediapipe/drawing_utils';

export default function PublisherVideo(props){
    const [video, setVideo] = useState(false);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('')
    const publisher = useRef();
    const session = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        setName(props.name)
    },[])

    const handleVideo = () => {
        publisher.current.getPublisher().publishVideo(video)
        setVideo(!video)
    }

    const sendMessage = () => {
        session.current.sessionHelper.session.signal({
            type: 'msg',
            data: {
                message,
                name: name
            }
        }, function(error) {
            if (error) {
                console.log('Error sending signal:', error.name, error.message);
            } else {
                setMessage('')
            }
        })
    }

    const onResults = (results) => {
        const canvasElement = canvasRef.current;
        const canvasCtx = canvasElement.getContext('2d')
        canvasCtx.save();
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        drawLandmarks(canvasCtx, results.poseLandmarks, {color: '#FF0000', lineWidth: 2, radius: 0.5})
        canvasCtx.restore();
    }

    const detectPose = (element) => {
        const pose = new Pose({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }});
        pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
        });
        pose.onResults(onResults);
        const camera = new Camera(element, {
            onFrame: async () => {
                await pose.send({image: element});
            },
            width: 1280,
            height: 720
        });
        camera.start();
    }

    const eventHandlers = {
        'videoElementCreated': event => {
            detectPose(event.element)
        }
    }

    return (
        <div id="videos">
            <OTSession apiKey="47527401" sessionId={props.sessionId} token={props.token} ref={session}>
                <OTPublisher ref={publisher} properties={{name: props.name, mirror: false, height: 480, width: 640}} eventHandlers={eventHandlers}/>
            </OTSession>
            <canvas
                ref={canvasRef}
                className="output_canvas"
                style={{
                    position: "fixed",
                    left: 8,
                    top: 8,
                    width: 640,
                    height: 480,
                }}
            ></canvas>
            <p>publishing...</p>
            <button onClick={handleVideo}>{video ? "turn on video" : "turn off video"}</button>
            <br/>
            <input value={message} onChange={(e) => setMessage(e.target.value)} type='text'/>
            <button onClick={sendMessage}>{"send message"}</button>
        </div>
    )
}