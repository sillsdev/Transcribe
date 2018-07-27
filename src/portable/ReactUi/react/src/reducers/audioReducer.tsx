import { FETCH_TASKS, JUMP_CHANGE, PLAY_STATUS, PLAYSPEEDRATE_CHANGE } from '../actions/types';

const initialState = {
    jump: 0,
    playSpeedRate: 1,
    playing: false,
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case PLAY_STATUS:
            return {
                ...state,
                playing: action.payload
            }
        case FETCH_TASKS:
            return {
                ...state,
                playing: false,
            }
        case PLAYSPEEDRATE_CHANGE:
            return {
                ...state,
                playSpeedRate: action.payload
            }
        case JUMP_CHANGE:
            return {
                ...state,
                jump: action.payload
            }
        default:
            return state;
    }
}