import { Avatar } from '@material-ui/core';
import React from 'react';
import './Message.css';
import { formatRelative} from 'date-fns';

function Message({ user, message, timestamp }) {
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
                <p>{ message }</p>
            </div>
        </div>
    )
}

export default Message
