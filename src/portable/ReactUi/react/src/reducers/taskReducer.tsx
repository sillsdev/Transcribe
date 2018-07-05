import { FETCH_USERS, SELECT_USER } from '../actions/types';


const initialState = {
    selectedUser: 0,
    users: []
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                users: action.payload.data
            };
        case SELECT_USER:
            return {
                ...state,
                selectedUser: action.payload
            }
        default:
            return state;
    }
}