import { FETCH_PARATEXT_PROJECTS, SELECT_PARATEXT_PROJECT } from '../actions/types';

const initialState = {
    loaded: false,    
    paratextProjects: Array<IParatextProject>(),
    selectedParatextProject: "",
}

export default function (state = initialState, action: any) {
    switch (action.type) {
        case FETCH_PARATEXT_PROJECTS:
            return {
                ...state,
                loaded: true,
                paratextProjects: action.payload.data,
            };
            case SELECT_PARATEXT_PROJECT:
            return {
                ...state,                
                paratextProjects: paratextProjects(state.paratextProjects, action),
                selectedParatextProject: action.payload,
            }
            default:
            return state;
    }
}

function paratextProjects(state: IParatextProject[] = Array<IParatextProject>(), action: any) {
    switch (action.type) {
        case SELECT_PARATEXT_PROJECT:
            if(state.length === 0)
            {
                return Array<IParatextProject>();
            }

            return state.map((paratextProject: IParatextProject) =>{
                return {
                    ...paratextProject,
                    project: {...paratextProject}
                }
            }
        )
        default: 
            return state;
        }
}