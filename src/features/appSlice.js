import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
    name: "app",
    initialState: {
        channelId: null,
        channelName: null,
        voiceChannelId: null,
        voiceChannelName: null,
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
    },
});

export const { setChannelInfo, setVoiceChannelInfo } = appSlice.actions;

export const selectChannelId = (state) => state.app.channelId;
export const selectChannelName = (state) => state.app.channelName;

export const selectVoiceChannelId = (state) => state.app.voiceChannelId;
export const selectVoiceChannelName = (state) => state.app.voiceChannelName;

export default appSlice.reducer;
