
const callAllPeers = () => {
    db.collection('voiceChannels').doc(id)
    .collection('users')
    .where('user','!=', user)
    .onSnapshot((snapshot) => {
        snapshot.docs.forEach((doc) => {
            const data = doc.data();
            callPeer(data.uid);

        })
    })
}

const callPeer = (id) => {
    const peer = new Peer({
        initiator: true,
        trickle: false,
        stream: stream
    });

    peer.on("signal", async (data) => {
        await db.collection('voiceChannels').doc(id)
        .collection('notifs').add({
            userToCall: id,
            signalData: data,
            from: user.uid
        });
    });

    peer.on("stream", stream => {
        const audio = new Audio();
        audio.srcObject = stream;
        audio.play();
    })

    db.collection('voiceChannels').doc(id)
    .collection('notifs').onSnapshot((snapshot) => {
        snapshot.docChanges.forEach(change => {
            const doc = change.doc;
            if(change.type === 'added') {
                doc.data()
            }
        });
    })
}
