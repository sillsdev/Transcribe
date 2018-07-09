import Axios from 'axios';
import { FETCH_TASKS, SELECT_PROJECT, SELECT_TASK } from './types';


export const fetchTasks = (username: string) => (dispatch: any) => {
    Axios.get('/api/GetTasks?user=' + username).
        then(tasks => {
            dispatch({
                payload: tasks,
                type: FETCH_TASKS
            });
        });
}

export function selectProject(id: string): any{
    return {
        payload: id,
        type: SELECT_PROJECT
    }
}

export function selectTask(id: string): any{
    return {
        payload: id,
        type: SELECT_TASK
    }
}
