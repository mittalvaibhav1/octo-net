import { Avatar } from '@material-ui/core';
import React from 'react';
import './Message.css';

function Message() {
    return (
        <div className="message">
            <Avatar  src="./IronMan.jpg" />
            <div className="message__info">
                <h4>
                    Dean Winchester
                    <span className="message__timestamp">Today at 2:17 AM</span>
                </h4>
                <p>Hey! I'm watching Brookyln 99 rn.</p>
            </div>
        </div>
    )
}

export default Message
