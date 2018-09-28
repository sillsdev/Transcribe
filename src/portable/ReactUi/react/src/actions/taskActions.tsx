import Axios from 'axios';
import { setSubmitted } from './audioActions';
import { ASSIGN_TASK_PENDING, COMPLETE_REVIEW_PENDING, COMPLETE_TRANSCRIPTION_PENDING, 
    FETCH_TASKS, FETCH_TRANSCRIPTION, SELECT_POPUP_TASK, SELECT_PROJECT, SELECT_TASK,  UNASSIGN_TASK_PENDING,
    UPDATE_TASK, WRITE_FULFILLED, WRITE_PENDING } from './types';
import { saveUserSetting } from './userActions';

export const assignTask = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: ASSIGN_TASK_PENDING});
    Axios.put('/api/TaskEvent?action=Assigned&task=' + taskid + '&user=' + userid)
        .then(dispatch(fetchTasks(userid)))
        .then(dispatch(setSubmitted(false)))
}

export const unAssignTask = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: UNASSIGN_TASK_PENDING});
    Axios.put('/api/TaskEvent?action=Unassigned&task=' + taskid + '&user=' + userid)
        .then(dispatch(fetchTasks(userid)))
}

export const completeTranscription = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: COMPLETE_TRANSCRIPTION_PENDING});
    Axios.put('/api/TaskEvent?action=TranscribeEnd&task=' + taskid + '&user=' + userid)
        .then(dispatch(fetchTasks(userid)))
}

export const completeReview = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: COMPLETE_REVIEW_PENDING});
    Axios.put('/api/TaskEvent?action=ReviewEnd&task=' + taskid + '&user=' + userid)
        .then(dispatch(uploadTranscription(taskid, userid)))
}

export const uploadTranscription = (taskid: string, userid: string) => (dispatch: any) => {
    Axios.put('/api/TaskEvent?action=Upload&task=' + taskid + '&user=' + userid)
        .then(dispatch(fetchTasks(userid)))
}

export const writeTranscription = (taskid: string, length: number, lang: string, dir: string, data: any) => (dispatch: any) => {
    dispatch({type: WRITE_PENDING});
    Axios.put('/api/WriteTranscription?task=' + taskid + "&length=" + length.toString() + "&lang=" + lang + "&dir=" + dir, data)
        .then(dispatch({type: WRITE_FULFILLED}))
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

export const fetchTasksOfProject = (projectname: string) => (dispatch: any) => {
    Axios.get('/api/GetTasks?project=' + projectname)
        .then(tasks => {
            dispatch({
                payload: tasks,
                type: FETCH_TASKS
            });
            dispatch({
                payload: projectname,
                type: SELECT_PROJECT
            })
        })
    }

export function selectProject(id: string): any{
    return {
        payload: id,
        type: SELECT_PROJECT
    }
}

export const  selectTask = (user: string, id: string) => (dispatch:any) => {
    dispatch({
        payload: id,
        type: SELECT_TASK
    })
    dispatch(fetchTranscription(id));
    dispatch(saveUserSetting(user, "lastTask", id))
    dispatch(setSubmitted(false))
}

export const  selectPopupTask = (id: string) => (dispatch:any) => {
    dispatch({
        payload: id,
        type: SELECT_POPUP_TASK
    })
}

export const fetchTranscription = (taskid: string) => (dispatch: any) => {
    const part = taskid.split('.');
    Axios.get('/api/audio/' + part[0] + '.transcription').
    then(transcription => {
        dispatch({
            payload: transcription,
            type: FETCH_TRANSCRIPTION
        });
    });
}

export const updateTask = (task: string, project: string, query: string, data: object) => (dispatch: any) => {
    dispatch({type: UPDATE_TASK});
    Axios.put('/api/UpdateTask?task=' + task + '&project=' + project + query, data)
        .then(dispatch(fetchTasksOfProject(project)))
}
