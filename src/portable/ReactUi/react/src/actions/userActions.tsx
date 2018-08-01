import Axios from 'axios';
import { FETCH_USERS, SELECT_USER, UPDATE_AVATAR, UPDATE_USER_PENDING } from './types';


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