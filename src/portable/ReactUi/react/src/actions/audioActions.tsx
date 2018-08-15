import Axios from 'axios';
import { INITIAL_TRANSCRIPTION, JUMP_CHANGE, PLAY_STATUS, PLAYSPEEDRATE_CHANGE, REPORT_POSITION, REQUEST_POSITION, SAVE_TOTAL_SECONDS } from './types';


export function playStatus(playing: boolean): any{
    return {
        payload: playing,
        type: PLAY_STATUS
    }
}

export function playSpeedRateChange(playSpeedRate: number): any{
    return {
        payload: playSpeedRate,
        type: PLAYSPEEDRATE_CHANGE
    }
}

export function jumpChange(jump: number): any{
    return {
        payload: jump,
        type: JUMP_CHANGE
    }
}

export function saveTotalSeconds(seconds: number): any {
    return {
        payload: seconds,
        type: SAVE_TOTAL_SECONDS
    }
}

export const reportPosition = (taskid: string, seconds: number) => (dispatch: any) => {
    dispatch({payload: seconds, type: REPORT_POSITION});
    Axios.put('/api/ReportPosition?task=' + taskid + '&position=' + seconds.toString());
}

export function requestPosition(): any {
    return {
        type: REQUEST_POSITION
    }
}

export function setInitialTranscription(status: boolean): any {
    return {
        payload: status,
        type: INITIAL_TRANSCRIPTION
    }
}