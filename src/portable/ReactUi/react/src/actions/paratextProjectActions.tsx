import Axios from 'axios';
import { fetchTasksOfProject } from './taskActions';
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

export const selectParatextProject = (project: IParatextProject) => (dispatch: any) => {
    dispatch({
        payload: project.id,
        type: SELECT_PARATEXT_PROJECT
    })
    Axios.put('/api/UpdateProject?project=' + project.id + '&name=' + project.name + '&guid=' + project.guid + '&lang=' + project.lang + '&langName=' + project.langName + '&font=' + project.font + '&size=' + project.size + '&features=' + project.features + '&dir=' + project.direction + '&type=' + project.type ).
        then (dispatch(fetchTasksOfProject(project.id)));
}