import { JUMP_CHANGE, PLAY_STATUS, PLAYSPEEDRATE_CHANGE } from './types';


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
