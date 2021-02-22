import { Avatar } from '@material-ui/core';
import React from 'react';
import './Message.css';
import { formatRelative } from 'date-fns';

function Message({ user, message, timestamp, gifUrl }) {
    return (
        <div className="message">
            <Avatar  src={ user.photo } />
            <div className="message__info">
                <h4>
                    { user.displayName }
                    <span className="message__timestamp">
                        { timestamp && formatRelative(new Date(timestamp?.toDate()), new Date()) }
                    </span>
                </h4>
                { 
                    message ? <p>{ message }</p> :
                    <img src={gifUrl} alt="gif" />
                }
            </div>
        </div>
    )
}

export default Message
