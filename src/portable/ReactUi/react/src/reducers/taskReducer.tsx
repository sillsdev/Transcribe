import { ASSIGN_TASK_PENDING, FETCH_TASKS, SELECT_PROJECT, SELECT_TASK } from '../actions/types';

const initialState = {
    loaded: false,
    pending: false,
    projects: Array<IProject>(),
    selectedProject: "",
    selectedTask: "",
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case ASSIGN_TASK_PENDING:
            return {
                ...state,
                loaded: false,
                pending: true,
                projects: projects(state.projects, action),
            }
        case FETCH_TASKS:
            return {
                ...state,
                loaded: true,
                pending: false,
                projects: action.payload.data,
            };
        case SELECT_PROJECT:
            return {
                ...state,
                projects: projects(state.projects, action),
                selectedProject: action.payload,
            }
        case SELECT_TASK:
            return {
                ...state,
                projects: projects(state.projects, action),
                selectedTask: action.payload,
            }
        default:
            return state;
    }
}

function projects (state:IProject[] = Array<IProject>(), action:any) {
    switch (action.type) {
        case SELECT_PROJECT:
        case SELECT_TASK:
            return [
                ...state,
            ];
        default:
            return state;
    }
}