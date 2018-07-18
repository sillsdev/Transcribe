import { FETCH_USERS, SELECT_USER } from '../actions/types';

const initialState = {
    selectedUser: "",
    users: Array<IUser>(),
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
                selectedUser: action.payload,
                users: users(state.users, action)
            }
        default:
            return state;
    }
}

function users(state: IUser[] = Array<IUser>(), action: any) {
    switch (action.type) {
        case SELECT_USER:
            return state.map((user: IUser) =>{
                return {
                    ...user,
                    username: {...user.username}
                }
            }
        )
        default: 
            return state;
        }
}