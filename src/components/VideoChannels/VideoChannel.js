import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { selectPeerVideos, setPeerVideos, setVideoChannelInfo } from '../../features/appSlice';
import db from '../../firebase/firebase';
import { createResponsePeer, createSenderPeer, getUserAudioAndVideo } from '../../WebRTC/utils';
import ConnectedUser from '../ConnectedUser/ConnectedUser'
import './VideoChannel.css'

function VideoChannel({ id: docID, channel, voiceConnected, videoConnected, setVideoConnected, user, stream, setStream, setPeers  }) {

    const dispatch = useDispatch();
    let peers = [];
    let responsePeers = [];
    let offers = [];
    let answers = [];
    let k = 0;
    const peerVideos = useSelector(selectPeerVideos);
    const [connectedUsers, setConnectedUsers] = useState([]);
    const [peersForStream, setPeersForStream] = useState([]);
    const connectToChannel = async () => {

        if(voiceConnected || videoConnected) {
            console.log("Please Disconnect from current channel!!");
            return;
        }

        setVideoConnected([
            channel.channelName
        ]);

        let uid = user.uid;
        window.uid = uid;
        console.log(uid);
        await db.collection('videoChannels').doc(docID)
        .collection('users').doc(uid).set({
            user: user
        })

        await db.collection('videoChannels').doc(docID)
        .collection('users')
        .where('user','!=', user)
        .get().then((snapshot) => {
            if(snapshot.docs.length !== 0) {
                snapshot.docs.forEach((doc) => {
                    const peer = createSenderPeer(stream, dispatch, peerVideos);
                    peer.onicecandidate = (e) => {
                        console.log("Creating offer...");
                        if(e.currentTarget.iceGatheringState === 'complete') {
                            offers.push({
                                for: doc.data().user,
                                offer: {type: "offer", sdp: e.currentTarget.localDescription.sdp},
                            });
                            try {
                                db.collection('videoChannels').doc(docID)
                                .collection('users').doc(uid).update({
                                    offers: offers
                                })
                                console.log("Offer sent to", doc.data().user.displayName);
                            }
                            catch(err) {
                                console.log("Error when creating offer for ",doc.data().user.displayName , err.message);
                                console.log("Offer not sent");
                            } 
                        }
                    }
                    peer.createOffer().then(offer => {
                        peer.setLocalDescription(offer);
                    })
                    peers.push(peer);
                    setPeers([...peers,...responsePeers]);
                    setPeersForStream([...peersForStream, peer]);
                });


            }
            else {
                console.log("I AM THE ONLY ONE HERE");
            }
        });

        db.collection('videoChannels').doc(docID)
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
                                console.log("Got an answer from ...", doc.user.displayName);
                                console.log(peers);
                                peers[k++].setRemoteDescription(currAnswer.answer);
                            }
                        })
                    }
                    else if(doc.offers) {
                        const currOffers = doc.offers;
                        currOffers.forEach((currOffer) => {
                            if(currOffer.for.uid === user.uid) {
                                const responsePeer = createResponsePeer(stream, dispatch, peerVideos);
                                responsePeer.setRemoteDescription(currOffer.offer)
                                responsePeer.onicecandidate = async (e) => {
                                    console.log("Creating answer...");
                                    if(e.currentTarget.iceGatheringState === 'complete') {
                                        answers.push({
                                            for: doc.user,
                                            answer: {type: "answer", sdp: e.currentTarget.localDescription.sdp},
                                        });
                                        try {
                                            console.log("current user ki docid is answer", uid);
                                            await db.collection('videoChannels').doc(docID)
                                            .collection('users').doc(uid).update({
                                                answers: answers
                                            })
                                            console.log("Ansnswer sent!! to", doc.user.displayName);
                                        }
                                        catch(err) {
                                            console.log("Error when creating answer for",doc.user.displayName , err.message)
                                            console.log("Ansnswer not sent :(");
                                        }
                                        
                                    }
                                }
                                responsePeer.createAnswer().then((answer) => {
                                    responsePeer.setLocalDescription(answer);
                                });
                                responsePeers.push(responsePeer);
                                setPeers([...peers,...responsePeers]);
                                setPeersForStream([...peersForStream, responsePeer]);
                            }
                        })
                        
                    }
                }
            })
        })
        dispatch(setVideoChannelInfo({
            channelId: docID,
            channelName: channel.channelName
        }));
    }

    useEffect(() => {
        getUserAudioAndVideo()
        .then((stream) => {
            setStream(stream);
            dispatch(setPeerVideos({
                peerVideos: [stream]
            }))
        })
        .catch((err) => {
            console.log(err.message);
        })
    },[setStream]);

    useEffect(() => {
        db.collection('videoChannels').doc(docID)
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
        <div key={docID} onClick= { connectToChannel } className="videoChannel">
            <h4>
                <span className="videoChannel__hash">
                    <svg className="buttonIcon-Od8mYw withText-10pQhr" width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M21.526 8.149C21.231 7.966 20.862 7.951 20.553 8.105L18 9.382V7C18 5.897 17.103 5 16 5H4C2.897 5 2 5.897 2 7V17C2 18.104 2.897 19 4 19H16C17.103 19 18 18.104 18 17V14.618L20.553 15.894C20.694 15.965 20.847 16 21 16C21.183 16 21.365 15.949 21.526 15.851C21.82 15.668 22 15.347 22 15V9C22 8.653 21.82 8.332 21.526 8.149Z"></path>
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

export default VideoChannel
