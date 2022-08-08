import React from "react"

export default function RaisedHand(props){
    return(
        props.show ?
            <img src="/hand.png" alt="hand" style={{zIndex: 1, position: "absolute", top: props.top, left: props.left, height: 50, width: 50}}/>
            : null
    )
}