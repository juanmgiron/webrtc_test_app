import { OTSession, OTPublisher } from 'opentok-react';
import React, { useEffect, useRef, useState } from 'react';
import { Camera } from "@mediapipe/camera_utils";
import { Pose } from "@mediapipe/pose";
import { drawLandmarks } from '@mediapipe/drawing_utils';

export default function PublisherVideo(props){
    const [video, setVideo] = useState(false);
    const hand = useRef(false);
    const name = useRef();
    const publisher = useRef();
    const session = useRef();
    const canvasRef = useRef();

    useEffect(() => {
        name.current = props.name
    },[])

    const handleVideo = () => {
        publisher.current.getPublisher().publishVideo(video)
        setVideo(!video)
    }

    const handUp = () => sendMessage('handUp')
    const handDown = () => sendMessage('handDown')

    const sendMessage = (type) => {
        session.current.sessionHelper.session.signal({
            type: type,
            data: {
                name: name.current
            }
        }, function(error) {
            if (error) {
                console.log('Error sending signal:', error.name, error.message);
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
        if (results.poseLandmarks) {
            var rightHand = results.poseLandmarks[16].y;
            var leftHand = results.poseLandmarks[15].y;
            var nose = results.poseLandmarks[0].y
            if (rightHand < nose || leftHand < nose) {
                if (!hand.current) {
                    handUp()
                }
                hand.current = true
            } else {
                if (hand.current) {
                    handDown()
                }
                hand.current = false
            }
        }
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
            <OTSession apiKey={props.apiKey} sessionId={props.sessionId} token={props.token} ref={session}>
                <OTPublisher ref={publisher} properties={{name: props.name, mirror: false, height: 480, width: 640}} eventHandlers={eventHandlers}/>
            </OTSession>
            <canvas
                ref={canvasRef}
                className="output_canvas"
                style={{
                    position: "fixed",
                    left: 0,
                    top: 0,
                    width: 640,
                    height: 480,
                }}
            ></canvas>
            <p>publishing...</p>
            <button onClick={handleVideo}>{video ? "turn on video" : "turn off video"}</button>
        </div>
    )
}