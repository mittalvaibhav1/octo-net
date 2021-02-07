import React, { useState } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import './Sidebar.css';
import SidebarChannel from './SidebarChannel/SidebarChannel';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

function Sidebar() {

    const [showTextChannels, setShowTextChannels] = useState(false);
    const [showVoiceChannels, setShowVoiceChannels] = useState(false);

    const toggleTextChannels = () => {
        setShowTextChannels(!showTextChannels);
    }
    const toggleVoiceChannels = () => {
        setShowVoiceChannels(!showVoiceChannels);
    }

    return (
        <div className="sidebar">
            <div className="sidebar__top">
                <h3>Iron Man Discussions</h3>
                <ExpandMoreIcon className="sidebar__icon" />
            </div>
            <div className="sidebar__channels">
                <div className="sidebar__textChannels">
                    <div className="sidebar__channelsHeader">
                        { showTextChannels ? <ExpandMoreIcon onClick = { toggleTextChannels } className="sidebar__icon" /> : <ChevronRightIcon onClick = { toggleTextChannels } className="sidebar__icon" /> }
                        <h4 onClick = { toggleTextChannels } >Text Channels</h4>
                        <AddIcon className="sidebar__icon" />
                    </div>
                    { showTextChannels && <div className="sidebar__channelsList">
                        <SidebarChannel />
                        <SidebarChannel />
                        <SidebarChannel />
                    </div> }
                </div>
                <div className="sidebar__voiceChannels">
                    <div  className="sidebar__channelsHeader">
                        { showVoiceChannels ? <ExpandMoreIcon  onClick = { toggleVoiceChannels } className="sidebar__icon" /> : <ChevronRightIcon onClick = { toggleVoiceChannels } className="sidebar__icon" /> }
                        <h4 onClick = { toggleVoiceChannels } >Voice Channels</h4>
                        <AddIcon className="sidebar__icon" />
                    </div>
                    { showVoiceChannels && <div className="sidebar__channelsList">
                        <SidebarChannel />
                        <SidebarChannel />
                        <SidebarChannel />
                    </div>  }
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
