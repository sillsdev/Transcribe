import { DELETE_USER, FETCH_USERS, RESTORE_DEFAULT_USER_HOTKEYS, SELECT_POPUP_USER, SELECT_USER } from '../actions/types';

const initialState = {
    deleted: false,
    loaded: false,
    selectedUser: "",
    userHotKeys: Array<IUserKeyVal>(),
    users: Array<IUser>(),
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_USERS:
            return {
                ...state,
                loaded: true,
                selectedUser: action.payload.data.length === 1?
                     action.payload.data[0].username.id: state.selectedUser,
                users: action.payload.data
            };
        case SELECT_USER:
            return {
                ...state,
                selectedUser: action.payload,
                users: users(state.users, action)
            }
        case SELECT_POPUP_USER:
            return {
                ...state,
                deleted: false,
                selectedPopupUser: action.payload,
            }
        case DELETE_USER:
            return {
                ...state,
                deleted: true,
                selectedPopupUser: '',
            }
        case RESTORE_DEFAULT_USER_HOTKEYS:
            return {
                ...state,
                userHotKeys: action.payload.data
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
                    hotkey: user.hotkey && user.hotkey.map((h: IUserKeyVal) => ({...h})),
                    project: user.project && user.project.map((p: IUserProjectSettings) => ({...p})),
                    role: user.role.map(s => s),
                    setting: user.setting && user.setting.map((s: IUserKeyVal) => ({...s})),
                    username: {...user.username}
                }
            }
        )
        default: 
            return state;
        }
}