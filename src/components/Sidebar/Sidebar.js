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
import { useDispatch, useSelector } from 'react-redux';
import db, { auth } from '../../firebase/firebase';
import { selectVideoChannelId, selectVoiceChannelId, setPeerVideos, setVideoChannelInfo } from '../../features/appSlice';
import TextChannel from '../TextChannel/TextChannel';
import VoiceChannel from '../VoiceChannel/VoiceChannel';
import VideoChannel from '../VideoChannels/VideoChannel';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

function Sidebar() {

    const [showTextChannels, setShowTextChannels] = useState(false);
    const [showVoiceChannels, setShowVoiceChannels] = useState(false);
    const [showVideoChannels, setShowVideoChannels] = useState(false);
    const [micStatus, setMicStatus] = useState(true);
    const [videoStatus, setVideoStatus] = useState(true);
    const [voiceConnected, setVoiceConnected] = useState(null);
    const [videoConnected, setVideoConnected] = useState(null);
    const [textChannels, setTextChannels] = useState([]);
    const [voiceChannels, setVoiceChannels] = useState([]);
    const [videoChannels, setVideoChannels] = useState([]);
    const user = useSelector(selectUser);
    const disconnectAudio = new Audio(disconnectSound);
    const connectAudio = new Audio(connectSound);
    const isMounted = useRef(null);
    const voiceChannelId = useSelector(selectVoiceChannelId);
    const videoChannelId = useSelector(selectVideoChannelId);
    const [stream, setStream] = useState(null);
    const [peers, setPeers] = useState([]);
    const dispatch = useDispatch();

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
    const toggleVideoChannels = () => {
        setShowVideoChannels(!showVideoChannels);
    }
    const toggleMicStatus = () => {
        setMicStatus((old) => !old);
        if(stream) stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
    }
    const toggleVideoStatus = () => {
        setVideoStatus((old) => !old);
        if(stream) stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
    }

    const disconnectVoiceChannel = async () => {
        dispatch(setPeerVideos({
            peerVideos: []
        }));
        await db.collection('voiceChannels').doc(voiceChannelId).collection('users')
        .where('user','==', user).get()
        .then((snapshot) => {
            snapshot.docs.forEach(async (doc) => {
                await  db.collection('voiceChannels').doc(voiceChannelId).collection('users').doc(doc.id).delete()
            })
        });
        peers.forEach((peer) => {
            peer.close();
        })
        setVoiceConnected(null);
    }

    const disconnectVideoChannel = async () => {
        await db.collection('videoChannels').doc(videoChannelId).collection('users')
        .where('user','==', user).get()
        .then((snapshot) => {
            snapshot.docs.forEach(async (doc) => {
                await  db.collection('videoChannels').doc(videoChannelId).collection('users').doc(doc.id).delete()
            })
        });
        peers.forEach((peer) => {
            peer.close();
        });
        dispatch(setVideoChannelInfo({
            channelId: null,
            channelName: null
        }));
        setVideoConnected(null);
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

    const handleAddVideoChannel = () => {
        const channelName = prompt('Enter the new channel name');
        if(channelName) {
            db.collection('videoChannels').add({
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
            if(videoStatus) {
                connectAudio.play();
            }
            else {
                disconnectAudio.play();
            }
        }
    }, [videoStatus]);

    useEffect(() => {
        if(isMounted.current) {
            if(voiceConnected) {
                connectAudio.play();
            }
            else {
                disconnectAudio.play();
            }
        }
    }, [voiceConnected]);

    useEffect(() => {
        if(isMounted.current) {
            if(videoConnected) {
                connectAudio.play();
            }
            else {
                disconnectAudio.play();
            }
        }
        else {
            isMounted.current = true;
        }
    }, [videoConnected]);

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
        db.collection('videoChannels').onSnapshot((snapshot) => {
            setVideoChannels(snapshot.docs.map((doc) => {
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
                                        <VoiceChannel setPeers = {setPeers} stream = { stream } setStream = { setStream } key={ channel.id } channel={ channel.channel } id={ channel.id } setVoiceConnected = { setVoiceConnected } user = { user } videoConnected = { videoConnected } voiceConnected = { voiceConnected } />
                                    )) 
                                }   
                            </motion.div>  
                        }
                    </AnimatePresence>
                </div>
                <div className="sidebar__videoChannels">
                    <div  className="sidebar__channelsHeader">
                        { showVideoChannels ? <ExpandMoreIcon  onClick = { toggleVideoChannels } className="sidebar__icon" /> : <ChevronRightIcon onClick = { toggleVideoChannels } className="sidebar__icon" /> }
                        <h4 onClick = { toggleVideoChannels } >Video Channels</h4>
                        <AddIcon onClick={ handleAddVideoChannel } className="sidebar__icon" />
                    </div>
                    <AnimatePresence exitBeforeEnter>
                        { showVideoChannels && <motion.div initial="hidden" exit="exit" 
                            animate="visible"  variants={ channelVariants } className="sidebar__channelsList">
                                {   videoChannels.map((channel) => (
                                        <VideoChannel setPeers = {setPeers} stream = { stream } setStream = { setStream } key={ channel.id } channel={ channel.channel } id={ channel.id } user = { user } setVideoConnected = { setVideoConnected }  videoConnected = { videoConnected } voiceConnected = { voiceConnected }/>
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

            { videoConnected && <div className="sidebar__voice">
                        <SignalCellularAltIcon  className="sidebar__voiceIcon" fontSize="large"/>
                        <div className="sidebar__voiceInfo">
                            <h3>Video Connected</h3>
                            <p>{ videoConnected[0] } / XTC</p>
                        </div>
                        <div className="sidebar__voiceIcons">
                            {videoStatus ? <VideocamIcon  onClick={ toggleVideoStatus }  className="sidebar__videoOn" /> : <VideocamOffIcon onClick={ toggleVideoStatus } className="sidebar__videoOff" /> }
                            <CallIcon onClick = { disconnectVideoChannel } className="sidebar__voiceDisconnect" />
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
