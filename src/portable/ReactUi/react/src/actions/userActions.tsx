import Axios from 'axios';
import { DELETE_USER, FETCH_USERS, SELECT_POPUP_USER, SELECT_USER, UPDATE_AVATAR, UPDATE_USER_PENDING } from './types';


export const fetchUsers = () => (dispatch: any) => {
    Axios.get('/api/GetUsers').
        then(users => {
            dispatch({
                payload: users,
                type: FETCH_USERS
            });
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
}

export const updateUser = (user: string, project: string, query: string) => (dispatch: any) => {
    dispatch({type: UPDATE_USER_PENDING});
    Axios.put('/api/UpdateUser?user=' + user + '&project=' + project + query)
        .then(dispatch(fetchUsers()))
}

export const updateAvatar = (user: string, data: object) => (dispatch: any) => {
    dispatch({type: UPDATE_AVATAR});
    Axios.put('/api/UpdateAvatar?user=' + user, data)
        .then(dispatch(fetchUsers()))
}

export const deleteUser = (user: string) => (dispatch: any) => {
    alert("I am on delete action");
    dispatch({type: DELETE_USER});
    Axios.put('/api/DeleteUser?user=' + user)
        .then(dispatch(fetchUsers()))
}

export const saveUserSetting = (user: string, setting: string, value: string) => (dispatch: any) => {
    Axios.put('/api/UpdateUser?user=' + user + "&setting=" + setting + "&value=" + value)
}
