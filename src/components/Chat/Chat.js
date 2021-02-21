import React, { useEffect, useState } from 'react';
import ChatHeader from '../ChatHeader/ChatHeader';
import './Chat.css';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import CardGiftcardIcon from '@material-ui/icons/CardGiftcard';
import GifIcon from '@material-ui/icons/Gif';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import Message from '../Message/Message';
import { useSelector } from 'react-redux';
import { selectChannelId, selectChannelName } from '../../features/appSlice';
import { selectUser } from '../../features/userSlice';
import db from '../../firebase/firebase';
import firebase from 'firebase';
import notificationSound from '../../sounds/micSound.mp3'

function Chat() {

    const channelName = useSelector(selectChannelName);
    const channelId = useSelector(selectChannelId);
    const user = useSelector(selectUser);
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const notificationAudio = new Audio(notificationSound);

    const handleSubmit = (e) => {
        e.preventDefault();
        notificationAudio.play(); 
        db.collection('textChannels').doc(channelId)
        .collection("messages").add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: user,
            message: input
        });
        setInput("");
    }

    useEffect(() => {
        if(channelId) {
            db.collection('textChannels').doc(channelId)
            .collection("messages").orderBy('timestamp')
            .onSnapshot((snapshot) => {
                setMessages(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    message: doc.data()
                })));
            })
        }
        
    }, [channelId]);

    return (
        <div className="chat">
            <ChatHeader channelName = { channelName } />
            <div className="chat__messages">
                {
                    messages.map(({id, message}) => (
                        <Message 
                            key = { id }
                            timestamp = { message.timestamp }
                            message = { message.message }
                            user = { message.user }
                        />
                    )) 
                }
            </div>
            <div className="chat__input">
                <AddCircleIcon fontSize="large" />
                <form onSubmit={ handleSubmit } >
                    <input disabled = { !channelId } value={ input } onChange={ e => setInput(e.target.value) } type="text" placeholder={`Message #${channelName}`}/>
                    <button type="submit" className="chat__sendMessage"> Send Message</button>
                </form>
                <div className="chat__inputIcons">
                    <CardGiftcardIcon fontSize="large" />
                    <GifIcon fontSize="large" />
                    <EmojiEmotionsIcon fontSize="large" />
                </div>
            </div>
        </div>
    )
}

export default Chat
