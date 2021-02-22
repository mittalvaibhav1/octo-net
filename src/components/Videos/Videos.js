import React from 'react'
import { useSelector } from 'react-redux';
import { selectPeerVideos } from '../../features/appSlice';
import Video from '../Video/Video';
import './Videos.css';

function Videos() {
    const peerVideos = useSelector(selectPeerVideos);
    return (
        <div className="videos">
            {
                peerVideos.map((stream, index) => (
                    <Video key={ index } stream = {stream} />
                ))
            }
        </div>
    )
}

export default Videos
