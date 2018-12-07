import { SAVE_AVATAR, SET_AVATAR_RADIUS, SET_SAVE_TO_PROJECT } from './types';

export function saveAvatar(avatar: IAvatar): any{
    return {
        payload: avatar,
        type: SAVE_AVATAR
    }
}

export function setUserAvatar(): any {
    return {
        payload: 100,
        type: SET_AVATAR_RADIUS
    }
}

export function setProjectAvatar(): any {
    return {
        payload: 1,
        type: SET_AVATAR_RADIUS
    }
}

export function setSaveToProject(projectId: string): any {
    return {
        payload: projectId,
        type: SET_SAVE_TO_PROJECT
    }
}