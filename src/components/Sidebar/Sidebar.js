import React, { useState, useEffect, useRef } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddIcon from '@material-ui/icons/Add';
import './Sidebar.css';
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
import { AnimatePresence, motion } from 'framer-motion';
import { selectUser } from '../../features/userSlice';
import { useSelector } from 'react-redux';
import db, { auth } from '../../firebase/firebase';
import { selectVoiceChannelId } from '../../features/appSlice';
import TextChannel from '../TextChannel/TextChannel';
import VoiceChannel from '../VoiceChannel/VoiceChannel';

function Sidebar() {

    const [showTextChannels, setShowTextChannels] = useState(false);
    const [showVoiceChannels, setShowVoiceChannels] = useState(false);
    const [micStatus, setMicStatus] = useState(true);
    const [voiceConnected, setVoiceConnected] = useState(null);
    const [textChannels, setTextChannels] = useState([]);
    const [voiceChannels, setVoiceChannels] = useState([]);
    const user = useSelector(selectUser);
    const disconnectAudio = new Audio(disconnectSound);
    const connectAudio = new Audio(connectSound);
    const isMounted = useRef(null);
    const voiceChannelId = useSelector(selectVoiceChannelId);
    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]);
 

    const channelVariants = {
        hidden: {
            opactiy: 0,
            y: -10
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                mass: 0.4,
                stiffness: 220,
                damping: 8,
            }
        },
        exit: {
            opacity: 0,
            y: -10
        }
    }

    const toggleTextChannels = () => {
        setShowTextChannels(!showTextChannels);
    }
    const toggleVoiceChannels = () => {
        setShowVoiceChannels(!showVoiceChannels);
    }
    const toggleMicStatus = () => {
        const toggleVal = !micStatus;
        setMicStatus(toggleVal);
        if(micStatus && stream) {
            stream.getAudioTracks()[0].enabled = true;

            console.log(stream.getAudioTracks()[0], toggleVal);
        }
        else if(stream) {
            stream.getAudioTracks()[0].enabled = false;
            console.log(stream.getAudioTracks()[0],  toggleVal);
        }
    }
    const disconnectVoiceChannel = async () => {
        peers.forEach((peer) => {
            peer.close();
        })
        await db.collection('voiceChannels').doc(voiceChannelId).collection('users')
        .where('user','==', user).get()
        .then((snapshot) => {
            snapshot.docs.forEach(async (doc) => {
                await  db.collection('voiceChannels').doc(voiceChannelId).collection('users').doc(doc.id).delete()
            })
        })
        setVoiceConnected(null);
    }

    const handleAddTextChannel = () => {
        const channelName = prompt('Enter the new channel name');
        if(channelName) {
            db.collection('textChannels').add({
                channelName: channelName
            });
        }
    }

    const handleAddVoiceChannel = () => {
        const channelName = prompt('Enter the new channel name');
        if(channelName) {
            db.collection('voiceChannels').add({
                channelName: channelName
            });
        }
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

    useEffect(() => {
        db.collection('textChannels').onSnapshot((snapshot) => {
            setTextChannels(snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    channel: doc.data(),
                }
            }))
        })
        db.collection('voiceChannels').onSnapshot((snapshot) => {
            setVoiceChannels(snapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    channel: doc.data(),
                }
            }))
        })
    }, []);

    window.addEventListener('beforeunload', function(e) {
        e.preventDefault();
        disconnectVoiceChannel();
        e.returnValue = '';
    });

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
                        <AddIcon onClick={ handleAddTextChannel } className="sidebar__icon" />
                    </div>
                    <AnimatePresence exitBeforeEnter>
                        { showTextChannels && <motion.div initial="hidden" exit="exit"
                            animate="visible"  variants={ channelVariants } className="sidebar__channelsList">
                                {   textChannels.map((channel) => (
                                        <TextChannel key={ channel.id } channel={ channel.channel } id={ channel.id } />
                                    ))
                                }
                            </motion.div> 
                        }
                    </AnimatePresence>
                </div>
                <div className="sidebar__voiceChannels">
                    <div  className="sidebar__channelsHeader">
                        { showVoiceChannels ? <ExpandMoreIcon  onClick = { toggleVoiceChannels } className="sidebar__icon" /> : <ChevronRightIcon onClick = { toggleVoiceChannels } className="sidebar__icon" /> }
                        <h4 onClick = { toggleVoiceChannels } >Voice Channels</h4>
                        <AddIcon onClick={ handleAddVoiceChannel } className="sidebar__icon" />
                    </div>
                    <AnimatePresence exitBeforeEnter>
                        { showVoiceChannels && <motion.div initial="hidden" exit="exit" 
                            animate="visible"  variants={ channelVariants } className="sidebar__channelsList">
                                {   voiceChannels.map((channel) => (
                                        <VoiceChannel setPeers = {setPeers} stream = { stream } setStream = { setStream } key={ channel.id } channel={ channel.channel } id={ channel.id } setVoiceConnected = { setVoiceConnected } user = { user } voiceConnected = { voiceConnected } />
                                    )) 
                                }   
                            </motion.div>  
                        }
                    </AnimatePresence>
                </div>
            </div>
            { voiceConnected && <div className="sidebar__voice">
                        <SignalCellularAltIcon  className="sidebar__voiceIcon" fontSize="large"/>
                        <div className="sidebar__voiceInfo">
                            <h3>Voice Connected</h3>
                            <p>{ voiceConnected[0] } / XTC</p>
                        </div>
                        <div className="sidebar__voiceIcons">
                            <InfoOutlinedIcon className="sidebar__voiceInfoIcon" />
                            <CallIcon onClick = { disconnectVoiceChannel } className="sidebar__voiceDisconnect" />
                        </div>
                </div> 
            }
            <div className="sidebar__profile">
                <Avatar onClick = { () => auth.signOut() } src={ user.photo } className="sidebar__avatar" />
                <div className="sidebar__profileInfo">
                    <h3>{ user.displayName }</h3>
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
