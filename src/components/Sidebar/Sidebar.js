import React, { useState, useEffect, useRef } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import './Sidebar.css';
import SidebarChannel from '../SidebarChannel/SidebarChannel';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SignalCellularAltIcon from '@material-ui/icons/SignalCellularAlt';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import CallIcon from '@material-ui/icons/Call';
import { Avatar } from '@material-ui/core';
import MicIcon from '@material-ui/icons/Mic';
import HeadsetIcon from '@material-ui/icons/Headset';
import SettingsIcon from '@material-ui/icons/Settings';
import MicOffIcon from '@material-ui/icons/MicOff';
import disconnectSound  from '../../sounds/disconnectSound.mp3';
import connectSound from '../../sounds/connectSound.mp3';
import { motion } from 'framer-motion';

function Sidebar() {

    const [showTextChannels, setShowTextChannels] = useState(false);
    const [showVoiceChannels, setShowVoiceChannels] = useState(false);
    const [micStatus, setMicStatus] = useState(false);
    const [voiceConnected, setVoiceConnected] = useState(false);
    const disconnectAudio = new Audio(disconnectSound);
    const connectAudio = new Audio(connectSound);
    const isMounted = useRef(null);

    const channelVariants = {
        hidden: {
            opactiy: 0,
        },
        visible: {
            opacity: 1,
            transition: {
                type: 'spring',
                mass: 0.4,
                damping: 8,
                duration: 1,
                when: "beforeChildren",
                staggerChildren: 1
            }
        }
    }

    const toggleTextChannels = () => {
        setShowTextChannels(!showTextChannels);
    }
    const toggleVoiceChannels = () => {
        setShowVoiceChannels(!showVoiceChannels);
    }
    const toggleMicStatus = () => {
        setMicStatus(!micStatus);
    }
    const disconnectVoiceChannel = () => {
        setVoiceConnected(false);
    }
    const connectVoiceChannel = () => {
        setVoiceConnected(true);
    }

    useEffect(() => {
        if(isMounted.current) {
            if(micStatus) {
                connectAudio.play();
            }
            else {
                disconnectAudio.play();
            }
        }
    }, [micStatus]);


    useEffect(() => {
        if(isMounted.current) {
            if(voiceConnected) {
                connectAudio.play();
            }
            else {
                disconnectAudio.play();
            }
        }
        else {
            isMounted.current = true;
        }
    }, [voiceConnected]);

    return (
        <div className="sidebar">
            <div className="sidebar__top">
                <h3>XTC</h3>
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
                        <SidebarChannel textChannel="true" />
                        <SidebarChannel textChannel="true"/>
                        <SidebarChannel textChannel="true"/>
                    </div> }
                </div>
                <div className="sidebar__voiceChannels">
                    <div  className="sidebar__channelsHeader">
                        { showVoiceChannels ? <ExpandMoreIcon  onClick = { toggleVoiceChannels } className="sidebar__icon" /> : <ChevronRightIcon onClick = { toggleVoiceChannels } className="sidebar__icon" /> }
                        <h4 onClick = { toggleVoiceChannels } >Voice Channels</h4>
                        <AddIcon className="sidebar__icon" />
                    </div>
                    { showVoiceChannels && <motion.div initial="hidden" 
                        animate="visible"  variants={ channelVariants } className="sidebar__channelsList">
                        <SidebarChannel onClick = { connectVoiceChannel } />
                        <SidebarChannel onClick = { connectVoiceChannel } />
                        <SidebarChannel onClick = { connectVoiceChannel } />
                    </motion.div>  }
                </div>
            </div>
            { voiceConnected && <div className="sidebar__voice">
                        <SignalCellularAltIcon  className="sidebar__voiceIcon" fontSize="large"/>
                        <div className="sidebar__voiceInfo">
                            <h3>Voice Connected</h3>
                            <p>Music / XTC</p>
                        </div>
                        <div className="sidebar__voiceIcons">
                            <InfoOutlinedIcon className="sidebar__voiceInfoIcon" />
                            <CallIcon onClick = { disconnectVoiceChannel } className="sidebar__voiceDisconnect" />
                        </div>
                </div> 
            }
            <div className="sidebar__profile">
                <Avatar src='./IronMan.jpg' />
                <div className="sidebar__profileInfo">
                    <h3>Dean Winchester</h3>
                    <p>#8733</p>
                </div>
                <div className="sidebar__profileIcons">
                    { micStatus ? <MicIcon onClick = { toggleMicStatus } /> : <MicOffIcon className= "sidebar__micOff" onClick = { toggleMicStatus } /> }
                    <HeadsetIcon />
                    <SettingsIcon />
                </div>
            </div>
        </div>
    )
}

export default Sidebar;
