import Axios from 'axios';
import { log } from '../actions/logAction';
import { setSubmitted } from './audioActions';
import { ADD_MANY_TASKS, ASSIGN_TASK_PENDING, COMPLETE_REVIEW_PENDING,
    COMPLETE_TRANSCRIPTION_PENDING, COPY_TO_CLIPBOARD, DELETE_TASK,
    FETCH_FILTERED_TASK, FETCH_TASKS, FETCH_TRANSCRIPTION, FETCH_ZTT_PROJECTS_COUNT, INIT_TASKS, SELECT_POPUP_TASK,
    SELECT_PROJECT, SELECT_TASK, SET_SELECTED_OPTION, SET_TODO_HIGHLIGHT, SHOW_HELP, UNASSIGN_TASK_PENDING, UPDATE_PROJECT, UPDATE_PROJECT_AVATAR,  UPDATE_TASK,
    WRITE_FULFILLED, WRITE_PENDING } from './types';
import { fetchUsers, saveUserSetting } from './userActions';

export const assignTask = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: ASSIGN_TASK_PENDING});
    Axios.put('/api/TaskEvent?action=Assigned&task=' + taskid + '&user=' + userid)
        .then(dispatch(fetchTasks(userid)))
        .then(dispatch(setSubmitted(false)))
        .then(dispatch(selectTask(userid, taskid)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + ASSIGN_TASK_PENDING +  ", id=" + taskid + ", user=" + userid))
        });
}

export const unAssignTask = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: UNASSIGN_TASK_PENDING});
    Axios.put('/api/TaskEvent?action=Unassigned&task=' + taskid + '&user=' + userid)
        .then(dispatch(saveUserSetting(userid, "lastTask", "")))
        .then(dispatch(selectTask(userid, "")))
        .then(dispatch(fetchUsers()))
        .then(dispatch(fetchTasks(userid)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + UNASSIGN_TASK_PENDING +  ", id=" + taskid + ", user=" + userid))
        });
}

export const completeTranscription = (taskid: string, userid: string) => (dispatch: any) => {
    dispatch({type: COMPLETE_TRANSCRIPTION_PENDING});
    Axios.put('/api/TaskEvent?action=TranscribeEnd&task=' + taskid + '&user=' + userid)
        .then(dispatch(selectTask(userid, "")))
        .then(dispatch(fetchUsers()))
        .then(dispatch(fetchTasks(userid)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + COMPLETE_TRANSCRIPTION_PENDING +  ", id=" + taskid + ", user=" + userid))
        });
}

export const completeReview = (taskid: string, userid: string, heading: string, sync: boolean | undefined) => (dispatch: any) => {
    dispatch({type: COMPLETE_REVIEW_PENDING});
    Axios.put('/api/TaskEvent?action=ReviewEnd&task=' + taskid + '&user=' + userid)
        .then(dispatch(sync? uploadTranscription(taskid, userid, heading): fetchTasks(userid)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + COMPLETE_REVIEW_PENDING +  ", id=" + taskid + ", user=" + userid))
        });
}

export const uploadTranscription = (taskid: string, userid: string, heading: string) => (dispatch: any) => {
    Axios.put('/api/TaskEvent?action=Upload&task=' + taskid + '&user=' + userid + '&heading=' + heading)
        .then(dispatch(selectTask(userid, "")))
        .then(dispatch(fetchUsers()))
        .then(dispatch(fetchTasks(userid)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " upload transcription, id=" + taskid + ", user=" + userid))
        });
}

export const writeTranscription = (taskid: string, length: number, lang: string, dir: string, data: any) => (dispatch: any) => {
    dispatch({type: WRITE_PENDING});
    Axios.put('/api/WriteTranscription?task=' + taskid + "&length=" + length.toString() + "&lang=" + lang + "&dir=" + dir, data)
        .then(dispatch({type: WRITE_FULFILLED}))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + WRITE_PENDING +  ", id=" + taskid))
        });
}

export const fetchTasks = (username: string) => (dispatch: any) => {
    Axios.get('/api/GetTasks?user=' + username)
        .then(tasks => {
            dispatch({
                payload: tasks,
                type: FETCH_TASKS
            });
        })
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " fetch tasks, user=" + username))
        });
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
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " fetch tasks of project, id=" + projectname))
        });
    }

export const fetchZttProjectsCount = () => (dispatch: any) => {
    Axios.get('/api/GetZttProjectsCount')
        .then(zttProjectsCount => {
            dispatch({
                payload: zttProjectsCount,
                type: FETCH_ZTT_PROJECTS_COUNT
            });
        })
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " fetch Ztt Projects Count"))
        });
}


export const deleteTask = (taskid: string) => (dispatch: any) => {
    const project = taskid.split('-')[0];
    dispatch({type: DELETE_TASK});
    Axios.put('/api/DeleteTask?action=Unassigned&task=' + taskid )
        .then(dispatch(fetchTasksOfProject(project)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + DELETE_TASK +  ", id=" + taskid))
        });
}

export function selectProject(id: string): any{
    return {
        payload: id,
        type: SELECT_PROJECT
    }
}

export const selectTask = (user: string, id: string) => (dispatch:any) => {
    dispatch({
        payload: id,
        type: SELECT_TASK
    })
    dispatch(fetchTasks(user))
    dispatch(fetchTranscription(id));
    dispatch(saveUserSetting(user, "lastTask", id));
    dispatch(setSubmitted(false));
}

export const  selectPopupTask = (id: string) => (dispatch:any) => {
    dispatch({
        payload: id,
        type: SELECT_POPUP_TASK
    })
}

export const fetchTranscription = (taskid: string) => (dispatch: any) => {
    const part = taskid && taskid.split('.');
    if (part) {
        Axios.get('/api/audio/' + part[0] + '.transcription')
        .then(transcription => {
            dispatch({
                payload: transcription,
                type: FETCH_TRANSCRIPTION
            });
        })
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + FETCH_TRANSCRIPTION +  ", id=" + taskid))
        });
    }
}

export const updateTask = (task: string, project: string, query: string, data: object) => (dispatch: any) => {
    dispatch({type: UPDATE_TASK});
    Axios.put('/api/UpdateTask?task=' + task + '&project=' + project + query, data)
        .then(dispatch(fetchTasksOfProject(project)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + UPDATE_TASK +  ", id=" + task))
        });
}

export const updateProject = (project: IProject) => (dispatch: any) => {
    dispatch({
        payload: project.id,
        type: UPDATE_PROJECT
    })
    Axios.put('/api/UpdateProject?project=' + project.id + '&name=' + project.name + '&guid=' + project.guid + '&lang=' + project.lang + '&langName=' + project.langName + '&font=' + project.font + '&size=' + project.size + '&features=' + project.features + '&dir=' + project.direction + '&sync=' + project.sync + '&claim=' + project.claim + '&type=' + project.type + '&uri=' + project.uri )
        .then (dispatch(fetchTasksOfProject(project.id)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + UPDATE_PROJECT +  ", id=" + project.id))
        });
}

export const copyToClipboard = (taskid: string) => (dispatch: any) => {
    dispatch({
        payload: taskid,
        type: COPY_TO_CLIPBOARD
    })
    Axios.put('/api/CopyToClipboard?task=' + taskid)
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + COPY_TO_CLIPBOARD +  ", id=" + taskid))
        });
}


export const updateProjectAvatar = (user: string, project: string,  data: object) => (dispatch: any) => {
    dispatch({type: UPDATE_PROJECT_AVATAR});
    Axios.put('/api/UpdateProjectAvatar?project=' + project, data)
        .then(dispatch(fetchTasks(user)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + UPDATE_PROJECT_AVATAR + ", user=" + user + ", project=" + project))
        });
}

export function initTasks(){
    return {
        type: INIT_TASKS
    }
}
export const addManyTasks = (user: string, project: string) => (dispatch: any) => {
    dispatch({type: ADD_MANY_TASKS});
    Axios.put('/api/AddManyTasks?user=' + user + '&project=' + project)
        .then(dispatch(fetchTasksOfProject(project)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + ADD_MANY_TASKS + ", project=" + project))
        });
}

export const showHelp = (topic: string) => (dispatch: any) => {
    dispatch({type: SHOW_HELP});
    Axios.put('/api/ShowHelp?topic=' + topic)
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + SHOW_HELP + ", topic=" + topic))
        });
}

export function setSelectedOption(selectedOption: string): any {
    return {
        payload: selectedOption,
        type: SET_SELECTED_OPTION
    }
}

export const fetchFilteredTasks = (username: string, project: string, option: string) => (dispatch: any) => {
    Axios.get('/api/GetTasks?user=' + username + '&project=' + project + '&option=' + option)
        .then(tasks => {
            dispatch({
                payload: tasks,
                type: FETCH_FILTERED_TASK
            });
        })
        .then(dispatch(setSelectedOption(option)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + FETCH_FILTERED_TASK + ", user=" + username + ", project=" + project + ", option=" + option))
        });
}

export function setToDoHightlight(setTodoHighlight: boolean): any {
    return {
        payload: setTodoHighlight,
        type: SET_TODO_HIGHLIGHT
    }
}