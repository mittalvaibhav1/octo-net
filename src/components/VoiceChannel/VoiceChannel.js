import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setVoiceChannelInfo } from '../../features/appSlice';
import db from '../../firebase/firebase';
import { createSenderPeer, getUserAudio, createResponsePeer } from '../../WebRTC/utils'
import ConnectedUser from '../ConnectedUser/ConnectedUser';
import './VoiceChannel.css';

function VoiceChannel({ id: docID, channel, voiceConnected, setVoiceConnected, user, stream, setStream, setPeers }) {
 
    const dispatch = useDispatch();
    let peers = [];
    let responsePeers = [];
    let offers = [];
    let answers = [];
    let userDocID = null;
    let k = 0;
    const [connectedUsers, setConnectedUsers] = useState([]);
    const connectToChannel = async () => {
        console.log("Function Called connect to channel");
        if(voiceConnected) {
            console.log("Please Disconnect from current channel!!");
            return;
        }
        setVoiceConnected([
            channel.channelName
        ]);
        await db.collection('voiceChannels').doc(docID)
        .collection('users').add({
            user: user
        }).then((res) => {
            userDocID = String(res.id);
            console.log("current user ki docid is", userDocID);
        });

        await db.collection('voiceChannels').doc(docID)
        .collection('users')
        .where('user','!=', user)
        .get().then((snapshot) => {
            if(snapshot.docs.length !== 0) {
                snapshot.docs.forEach((doc) => {
                    const peer = createSenderPeer(stream);
                    peer.onicecandidate = (e) => {
                        console.log("Creating offer...");
                        if(e.currentTarget.iceGatheringState === 'complete') {
                            offers.push({
                                for: doc.data().user,
                                offer: {type: "offer", sdp: e.currentTarget.localDescription.sdp},
                            });
                            try {
                                console.log("current user ki docid is offer", userDocID);
                                db.collection('voiceChannels').doc(docID)
                                .collection('users').doc(userDocID).update({
                                    offers: offers
                                })
                            }
                            catch(err) {
                                console.log("Error when creating offer", err.message)
                            } 
                            console.log("Offer sent");
                        }
                    }
                    peer.createOffer().then(offer => {
                        peer.setLocalDescription(offer);
                    })
                    peers.push(peer);
                    setPeers([...peers,...responsePeers]);
                });


            }
            else {
                console.log("I AM THE ONLY ONE HERE");
            }
        });

        db.collection('voiceChannels').doc(docID)
        .collection('users')
        .where('user','!=', user)
        .onSnapshot((snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if(change.type === 'modified') {
                    const doc = change.doc.data();
                    if(doc.answers) {
                        const currAnswers = doc.answers;
                        currAnswers.forEach((currAnswer) => {
                            if(currAnswer.for.uid === user.uid && k < peers.length) {
                                console.log("Got an answer...");
                                console.log(peers);
                                peers[k++].setRemoteDescription(currAnswer.answer);
                            }
                        })
                    }
                    else if(doc.offers) {
                        const currOffers = doc.offers;
                        currOffers.forEach((currOffer) => {
                            if(currOffer.for.uid === user.uid) {
                                const responsePeer = createResponsePeer(stream);
                                responsePeer.setRemoteDescription(currOffer.offer)
                                responsePeer.onicecandidate = async (e) => {
                                    console.log("Creating answer...");
                                    if(e.currentTarget.iceGatheringState === 'complete') {
                                        answers.push({
                                            for: doc.user,
                                            answer: {type: "answer", sdp: e.currentTarget.localDescription.sdp},
                                        });
                                        try {
                                            console.log("current user ki docid is answer", userDocID);
                                            await db.collection('voiceChannels').doc(docID)
                                            .collection('users').doc(userDocID).update({
                                                answers: answers
                                            })
                                        }
                                        catch(err) {
                                            console.log("Error when creating answer", err.message)
                                        }
                                        console.log("Ansnswer sent!!");
                                    }
                                }
                                responsePeer.createAnswer().then((answer) => {
                                    responsePeer.setLocalDescription(answer);
                                });
                                responsePeers.push(responsePeer);
                                setPeers([...peers,...responsePeers]);
                            }
                        })
                        
                    }
                }
            })
        })
        dispatch(setVoiceChannelInfo({
            channelId: docID,
            channelName: channel.channelName
        }));
    }

    useEffect(() => {
        getUserAudio()
        .then((stream) => {
            setStream(stream);
        })
        .catch((err) => {
            console.log(err.message);
        })
    },[setStream]);

    useEffect(() => {
        db.collection('voiceChannels').doc(docID)
        .collection('users')
        .onSnapshot((snapshot) => {
            setConnectedUsers(() => [])
            setConnectedUsers(snapshot.docs.map((doc) => {
                const data = doc.data();
                const { user: currUser } = data;
                return currUser;
            }))
        })
    }, [setConnectedUsers, docID])

    return (
        <div key={docID} onClick= { connectToChannel } className="voiceChannel">
            <h4>
                <span className="voiceChannel__hash">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M11.383 3.07904C11.009 2.92504 10.579 3.01004 10.293 3.29604L6 8.00204H3C2.45 8.00204 2 8.45304 2 9.00204V15.002C2 15.552 2.45 16.002 3 16.002H6L10.293 20.71C10.579 20.996 11.009 21.082 11.383 20.927C11.757 20.772 12 20.407 12 20.002V4.00204C12 3.59904 11.757 3.23204 11.383 3.07904ZM14 5.00195V7.00195C16.757 7.00195 19 9.24595 19 12.002C19 14.759 16.757 17.002 14 17.002V19.002C17.86 19.002 21 15.863 21 12.002C21 8.14295 17.86 5.00195 14 5.00195ZM14 9.00195C15.654 9.00195 17 10.349 17 12.002C17 13.657 15.654 15.002 14 15.002V13.002C14.551 13.002 15 12.553 15 12.002C15 11.451 14.551 11.002 14 11.002V9.00195Z">   
                        </path>
                    </svg>
                </span>
                <span>{ channel.channelName }</span>
            </h4>
            {
                connectedUsers.map((user, idx) => (
                    <ConnectedUser key={ idx } user={ user } />
                ))
            }
        </div>
    )
}

export default VoiceChannel;
