import { ASSIGN_TASK_PENDING, DELETE_TASK, FETCH_FILTERED_TASK, FETCH_TASKS, FETCH_ZTT_PROJECTS_COUNT, INIT_TASKS, SELECT_POPUP_TASK, SELECT_PROJECT, SELECT_TASK, SET_SELECTED_OPTION, SET_TODO_HIGHLIGHT, UNASSIGN_TASK_PENDING } from '../actions/types';

const initialState = {
    deleted: false,
    loaded: false,
    pending: false,
    projects: Array<IProject>(),
    selectedOption: "mytasks",
    selectedPopupTask: "",
    selectedProject: "",
    selectedTask: "",
    zttProjectsCount: "",
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case ASSIGN_TASK_PENDING:
            return {
                ...state,
                loaded: false,
                pending: true,
                projects: state.projects.map((p: IProject) => project(p, action)),
            }
        case UNASSIGN_TASK_PENDING:
            return {
                ...state,
                loaded: false,
                pending: true,
                projects: state.projects.map((p: IProject) => project(p, action)),
            }
        case FETCH_TASKS:
            return {
                ...state,
                loaded: true,
                pending: false,
                projects: action.payload.data,
                selectedProject: action.payload.data.length === 1?
                    action.payload.data[0].id: state.selectedProject
            };
        case SELECT_POPUP_TASK:
            return {
                ...state,
                deleted: false,
                projects: state.projects.map((p: IProject) => project(p, action)),
                selectedPopupTask: action.payload,
        }
        case FETCH_ZTT_PROJECTS_COUNT:
            return {
                ...state,
                zttProjectsCount: action.payload.data,
        }
        case DELETE_TASK:
            return {
                ...state,
                deleted: true,
                projects: state.projects.map((p: IProject) => project(p, action)),
        }
        case SELECT_PROJECT:
            return {
                ...state,
                projects: state.projects.map((p: IProject) => project(p, action)),
                selectedProject: action.payload,
            }
        case SELECT_TASK:
            return {
                ...state,
                projects: state.projects.map((p: IProject) => project(p, action)),
                selectedTask: action.payload,
            }
        case INIT_TASKS:
            return {
                ...initialState
            }
        case SET_SELECTED_OPTION:
            return {
                ...state,
                selectedOption: action.payload,
            }
        case FETCH_FILTERED_TASK:
            return {
                ...state,
                loaded: true,
                pending: false,
                projects: action.payload.data,
                selectedProject: action.payload.data.length === 1?
                    action.payload.data[0].id: state.selectedProject
            };
        case SET_TODO_HIGHLIGHT:
            return {
                ...state,
                todoHighlight: action.payload
            };
        default:
            return state;
    }
}

function project (state:IProject = {id: "", lang:"", task: Array<ITask>()}, action:any) {
    switch (action.type) {
        default:
            return {
                ...state,
                task: state.task.map((t: ITask) => task(t, action)),
            }
    }
}

function task (state:ITask = {id:"", state:"Transcribe"}, action: any) {
    switch (action.type) {
        default:
            return {
                ...state,
                history: state.history && state.history.map((h: IHistory) => ({...h})),
            }
    }
}