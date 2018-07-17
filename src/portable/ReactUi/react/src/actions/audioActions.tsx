import { PLAY_STATUS, PLAYSPEEDRATE_CHANGE, UPDATE_NAME } from './types';


export function playStatus(playing: boolean): any{
    return {
        payload: playing,
        type: PLAY_STATUS
    }
}

export function updateName(name: string): any{
    return {
        payload: name,
        type: UPDATE_NAME
    }
}

export function PlaySpeedRateChange(playSpeedRate: number): any{
    return {
        payload: playSpeedRate,
        type: PLAYSPEEDRATE_CHANGE
    }
}