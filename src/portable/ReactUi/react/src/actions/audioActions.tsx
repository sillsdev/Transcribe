import Axios from 'axios';
import { COPY_AUDIO, INITIAL_TRANSCRIPTION, JUMP_CHANGE, PLAY_STATUS, PLAYSPEEDRATE_CHANGE,
    REPORT_POSITION, REQUEST_POSITION, SAVE_STATUS, SAVE_TOTAL_SECONDS, SUBMIT_STATUS } from './types';


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

export function setSubmitted(submit: boolean): any{
    return {
        payload: submit,
        type: SUBMIT_STATUS
    }
}

export function setSaved(saved: boolean): any{
    return {
        payload: saved,
        type: SAVE_STATUS
    }
}

export const copyAudio = (task: string, project: string, audioFile: string, data: object) => (dispatch: any) => {
    dispatch({type: COPY_AUDIO});
    Axios.put('/api/CopyAudio?task=' + task + '&project=' + project+ '&audioFile=' + audioFile, data)
}