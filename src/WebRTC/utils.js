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
    peer.onconnectionstatechange = (e) => console.log("Caller...",e.currentTarget.connectionState);
    peer.onaddstream = (e) => {
        console.log("Got a stream from the callie when i was the caller",e.stream);
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
    peer.onconnectionstatechange = (e) => console.log("Callie...", e.currentTarget.connectionState);
    peer.onaddstream = (e) => {
        console.log("Got a stream from the caller where i was the callie", e.stream);
        const audio = new Audio();
        audio.srcObject = e.stream;
        audio.play();
    }
    return peer;
}