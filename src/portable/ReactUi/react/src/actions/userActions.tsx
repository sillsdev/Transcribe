import Axios from 'axios';
import { log } from '../actions/logAction';
import { DELETE_USER, FETCH_USERS, RESTORE_DEFAULT_USER_HOTKEYS, SELECT_POPUP_USER, SELECT_USER, UPDATE_USER_PENDING } from './types';

export const fetchUsers = () => (dispatch: any) => {
    Axios.get('/api/GetUsers')
        .then(users => {
            dispatch({
                payload: users,
                type: FETCH_USERS
            });
        })
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + FETCH_USERS))
        });
}

export function selectUser(id: string): any{
    return {
        payload: id,
        type: SELECT_USER
    }
}

export function selectPopupUser(id: string): any{
    return {
        payload: id,
        type: SELECT_POPUP_USER
    }
}

export const selectLanguage = (user: string, lang: string) => (dispatch: any) => {
    dispatch({type: UPDATE_USER_PENDING});
    Axios.put('/api/UpdateUser?user=' + user + '&uilang=' + lang)
        .then(dispatch(fetchUsers()))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " select language, user=" + user + ", language=" + lang))
        });
}

export const updateUser = (user: string, project: string, query: string, data: object) => (dispatch: any) => {
    dispatch({type: UPDATE_USER_PENDING});
    Axios.put('/api/UpdateUser?user=' + user + '&project=' + project + query, data)
        .then(dispatch(fetchUsers()))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " update user, user=" + user))
        });
}

export const deleteUser = (user: string) => (dispatch: any) => {
    dispatch({type: DELETE_USER});
    Axios.put('/api/DeleteUser?user=' + user)
        .then(dispatch(fetchUsers()))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + DELETE_USER + ", user=" + user))
        });
}

export const saveUserSetting = (user: string, setting: string, value: string) => (dispatch: any) => {
    Axios.put('/api/UpdateUser?user=' + user + "&setting=" + setting + "&value=" + value)
    .catch((reason: any) => {
        dispatch(log(JSON.stringify(reason) + " save user setting, user=" + user+ ", setting=" + setting + ", value=" + value))
    });
}

export const restoreDefaultUserHotKeys = () => (dispatch: any) => {
    Axios.get('/api/GetDefaultUserHotKeys')
        .then(userHotKeys => {
            dispatch({
                payload: userHotKeys,
                type: RESTORE_DEFAULT_USER_HOTKEYS
            });
        })
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + RESTORE_DEFAULT_USER_HOTKEYS))
        });
}
