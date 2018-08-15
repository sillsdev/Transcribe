import { FETCH_TASKS, FETCH_TRANSCRIPTION, INITIAL_TRANSCRIPTION, JUMP_CHANGE, PLAY_STATUS, PLAYSPEEDRATE_CHANGE, REPORT_POSITION, REQUEST_POSITION, SAVE_TOTAL_SECONDS, SELECT_TASK } from '../actions/types';

const initialState = {
    initialPosition: 0,
    initialTranscription: true,
    jump: 0,
    playSpeedRate: 1,
    playing: false,
    reportedPosition: 0,
    requestReport: false,
    totalSeconds: 0,
    transcription: "",
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
        case FETCH_TRANSCRIPTION:
            // tslint:disable-next-line:no-console
            console.log(action.payload.data.position + "<>" + action.payload.data.transcription)
            return {
                ...state,
                initialPosition: action.payload.data.position,
                transcription: action.payload.data.transcription,
            }
        case INITIAL_TRANSCRIPTION:
            return {
                ...state,
                initialTranscription: action.payload,
            }
        case SELECT_TASK:
            return {
                ...state,
                initialTranscription: true,
                transcription: "",
            }
        default:
            return state;
    }
}