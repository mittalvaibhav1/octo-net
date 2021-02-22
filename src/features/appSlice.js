import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: "app",
    initialState: {
        channelId: null,
        channelName: null,
        voiceChannelId: null,
        voiceChannelName: null,
        videoChannelId: null,
        videoChannelName: null,
        peerVideos: []
    },
    reducers: {
        setChannelInfo : (state, action) => {
            state.channelId = action.payload.channelId;
            state.channelName = action.payload.channelName;
        },
        setVoiceChannelInfo: (state, action) => {
            state.voiceChannelId = action.payload.channelId;
            state.voiceChannelName = action.payload.channelName;
        },
        setVideoChannelInfo: (state, action) => {
            state.videoChannelId = action.payload.channelId;
            state.videoChannelName = action.payload.channelName;
        },
        setPeerVideos: (state, action) => {
            state.peerVideos = action.payload.peerVideos;
        }
    },
});

export const { setChannelInfo, setVoiceChannelInfo, setVideoChannelInfo, setPeerVideos } = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;

export const selectVoiceChannelId = (state) => state.app.voiceChannelId;
export const selectVoiceChannelName = (state) => state.app.voiceChannelName;


export const selectVideoChannelId = (state) => state.app.videoChannelId;
export const selectVideoChannelName = (state) => state.app.videoChannelName;

export const selectPeerVideos = (state) => state.app.peerVideos;

export default appSlice.reducer;
