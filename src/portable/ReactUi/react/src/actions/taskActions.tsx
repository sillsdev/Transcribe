import Axios from 'axios';
import { ASSIGN_TASK_PENDING, FETCH_TASKS, SELECT_PROJECT, SELECT_TASK, UNASSIGN_TASK_PENDING, WRITE_PENDING } from './types';

export const assignTask = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: ASSIGN_TASK_PENDING});
    Axios.put('/api/TaskEvent?action=Assigned&task=' + taskid + '&user=' + userid)
        .then(dispatch(fetchTasks(userid)))
}

export const unAssignTask = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: UNASSIGN_TASK_PENDING});
    Axios.put('/api/TaskEvent?action=Unassigned&task=' + taskid + '&user=' + userid)
        .then(dispatch(fetchTasks(userid)))
}

export const writeTranscription = (taskid: string, length: number, lang: string, dir: string, data: any) => (dispatch: any) => {
    dispatch({type: WRITE_PENDING});
    Axios.put('/api/WriteTranscription?task=' + taskid + "&length=" + length.toString() + "&lang=" + lang + "&dir=" + dir, data)
        .then()
}

export const fetchTasks = (username: string) => (dispatch: any) => {
    Axios.get('/api/GetTasks?user=' + username)
        .then(tasks => {
            dispatch({
                payload: tasks,
                type: FETCH_TASKS
            });
        })
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
