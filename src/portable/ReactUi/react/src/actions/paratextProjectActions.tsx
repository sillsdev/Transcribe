import Axios from 'axios';
import { FETCH_PARATEXT_PROJECTS, SELECT_PARATEXT_PROJECT } from './types';

export const fetchParatextProjects = () => (dispatch: any) => {
    // tslint:disable-next-line:no-console
    console.log("in get")
    Axios.get('/api/GetParatextProjects').
        then(paratextProjects => {
            dispatch({
                payload: paratextProjects,
                type: FETCH_PARATEXT_PROJECTS
            });
        });
}

export function selectParatextProject(id: string): any{
    return {
        payload: id,
        type: SELECT_PARATEXT_PROJECT
    }
}