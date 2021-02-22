import { Avatar } from '@material-ui/core'
import React from 'react';
import './ConnectedUser.css';

function ConnectedUser({ user }) {
    return (
        <div className="connecteduser">
            <Avatar className="connecteduser__avatar" src={ user.photo } />
            <span>{ user.displayName }</span>
        </div>
    )
}

export default ConnectedUser
