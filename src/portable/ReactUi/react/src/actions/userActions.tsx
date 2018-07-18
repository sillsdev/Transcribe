import Axios from 'axios';
import { FETCH_USERS, SELECT_USER } from './types';


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
