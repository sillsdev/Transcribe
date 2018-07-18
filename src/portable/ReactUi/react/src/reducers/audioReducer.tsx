import { PLAY_STATUS, PLAYSPEEDRATE_CHANGE } from '../actions/types';

const initialState = {
    playSpeedRate: 1,
    playing: false
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case PLAY_STATUS:
            return {
                ...state,
                playing: action.payload
            }
        case PLAYSPEEDRATE_CHANGE:
            return {
                ...state,
                playSpeedRate: action.payload
            }
        default:
            return state;
    }
}