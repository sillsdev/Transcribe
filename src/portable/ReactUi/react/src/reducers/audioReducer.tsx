import { FETCH_TASKS, JUMP_CHANGE, PLAY_STATUS, PLAYSPEEDRATE_CHANGE, REPORT_POSITION, REQUEST_POSITION, SAVE_TOTAL_SECONDS } from '../actions/types';

const initialState = {
    jump: 0,
    playSpeedRate: 1,
    playing: false,
    reportedPosition: 0,
    requestReport: false,
    totalSeconds: 0,
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
        case REPORT_POSITION:
            return {
                ...state,
                reportedPosition: action.payload,
                requestReport: false,
            }
        case REQUEST_POSITION:
            return {
                ...state,
                requestReport: true
            }
        case SAVE_TOTAL_SECONDS:
            return {
                ...state,
                totalSeconds: action.payload
            }
        default:
            return state;
    }
}