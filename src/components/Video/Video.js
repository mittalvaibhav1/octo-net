import React, { useRef } from 'react'
import { useEffect } from 'react';
import './Video.css';

function Video({ stream }) {
    const videoRef = useRef(null);
    useEffect(() => {
        if(videoRef.current) {
            videoRef.current.srcObject = stream;
        }
    }, [videoRef])
    return stream ? (
        <div className="video">
            <video muted autoPlay ref = { videoRef } />
        </div>
    ) :
    (
        <></>
    )
}

export default Video
