import { SAVE_AVATAR, SET_AVATAR_RADIUS, SET_SAVE_TO_PROJECT } from '../actions/types';
    
const initialState: IAvatarState = {
    borderRadius: 1,
    data: "/assets/Smile.svg",
    saveToProject: "",
    uri: "/assets/Smile.svg",
  }

export default function (state = initialState, action: any) {
    switch (action.type) {
        case SAVE_AVATAR:
            return {
                ...state,
                data: action.payload.data,
                uri: action.payload.uri,
            }
        case SET_AVATAR_RADIUS:
            return {
                ...state,
                borderRadius: action.payload
            }
        case SET_SAVE_TO_PROJECT:
            return {
                ...state,
                saveToProject: action.payload
            }
        default:
            return state;
    }
};