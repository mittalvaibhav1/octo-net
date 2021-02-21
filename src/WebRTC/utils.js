export async function getUserAudio() {
    navigator.mediaDevices.getUserMedia({
        audio: true
    });
}