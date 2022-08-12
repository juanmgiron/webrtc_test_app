import React from "react";
import { OTSubscriber } from "opentok-react";
import RaisedHand from "./RaisedHand";

export default function SubscriberLayout(props){
    const handleLayout = () => {
        var count = props.streams.length;
        var screens = [];
        var extraScreens = [];
        if (props.selected === undefined) {
          for (let i = 0; i < count; i++) {
            screens.push(
            <div onClick={() => props.modifySelected(i)} key={i}>
              <OTSubscriber
                key={props.streams[i].id}
                session={props.session}
                stream={props.streams[i]}
                properties={{height: 200, width: 266}}
                style={{position: "absolute", top: Math.floor(i/7)*200, left: (i%7)*266, zIndex: 0}}
              />
              <RaisedHand show={props.hands.includes(props.streams[i].connection.id)} top={Math.floor(i/7)*200} left={(i%7)*266} />
              <h1 style={{top: Math.floor(i/7)*200, left: (i%7)*266+230, zIndex: 1, position: "absolute"}}>{props.counter[i]}</h1>
            </div>)
          }
        } else {
          screens.push(
          <div onClick={() => props.modifySelected(undefined)}>
            <OTSubscriber
              key={props.streams[props.selected].id}
              session={props.session}
              stream={props.streams[props.selected]}
              properties={{height: 900, width: 1200}}
              style={{position: "absolute", top: 0, left: 0}}
            />
            <RaisedHand show={props.hands.includes(props.streams[props.selected].connection.id)} top={0} left={0} />
            <h1 style={{top: 0, left: 1150, zIndex: 1, position: "absolute"}}>{props.counter[props.selected]}</h1>
          </div>)
          var offset = 0;
          for (let i = 0; i < count; i++) {
            if (i !== props.selected) {
              extraScreens.push(
                <div onClick={() => props.modifySelected(i)} key={i}>
                  <OTSubscriber
                    key={props.streams[i].id}
                    session={props.session}
                    stream={props.streams[i]}
                    properties={{height: 210, width: 280}}
                    style={{position: "absolute", top: Math.floor((i-offset)/2)*210, left: ((i-offset)%2)*280}}
                  />
                  <RaisedHand show={props.hands.includes(props.streams[i].connection.id)} top={Math.floor((i-offset)/2)*210} left={((i-offset)%2)*280} />
                  <h1 style={{top: Math.floor((i-offset)/2)*210, left: ((i-offset)%2)*280+250, zIndex: 1, position: "absolute"}}>{props.counter[i]}</h1>
                </div>)
            } else {
              offset++;
            }
          }
        }
        return (
          <div id="layout" style={{position: "absolute", left: 0, top: 0, right: 0, bottom: 150}}>
            {screens}
            <div style={{position: "absolute", left: 1200, top: 0, right: 0, bottom: 0, overflow: "auto"}}>
              {extraScreens}
            </div>
          </div>
        )
    }

    return handleLayout()
}