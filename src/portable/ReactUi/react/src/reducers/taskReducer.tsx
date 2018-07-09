import { FETCH_TASKS, SELECT_PROJECT, SELECT_TASK } from '../actions/types';


const initialState = {
    projects: [],
    selectedProject: "",
    selectedTask: "",
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_TASKS:
            return {
                ...state,
                projects: action.payload.data
            };
        case SELECT_PROJECT:
            return {
                ...state,
                selectedProject: action.payload
            }
        case SELECT_TASK:
            return {
                ...state,
                selectedTask: action.payload
            }
        default:
            return state;
    }
}