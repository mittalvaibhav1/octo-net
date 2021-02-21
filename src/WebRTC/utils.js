

export async function getUserAudio() {
    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
    });
    return stream;
}

export function createSenderPeer(stream) {
    const configuration = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                ],
            },
        ],
    }; 
    const peer = new RTCPeerConnection(configuration);
    peer.addStream(stream);
    peer.onconnectionstatechange = (e) => console.log("sender",e.currentTarget.connectionState);
    peer.onaddstream = (e) => {
        console.log("sender peer ki",e.stream);
        const audio = new Audio();
        audio.srcObject = e.stream;
        audio.play();
    }
    return peer;
}

export function createResponsePeer(stream) {
    const configuration = {
        iceServers: [
            {
                urls: [
                    'stun:stun1.l.google.com:19302',
                    'stun:stun2.l.google.com:19302',
                ],
            },
        ],
    }; 
    const peer = new RTCPeerConnection(configuration);
    peer.addStream(stream);
    console.log("RESPONSEEEEEE",peer);
    peer.onconnectionstatechange = (e) => console.log("receiver", e.currentTarget.connectionState);
    peer.onaddstream = (e) => {
        console.log("respose peer ki",e.stream);
        const audio = new Audio();
        audio.srcObject = e.stream;
        audio.play();
    }
    return peer;
}