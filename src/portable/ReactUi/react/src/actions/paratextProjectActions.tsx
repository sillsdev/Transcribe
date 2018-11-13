import Axios from 'axios';
import { log } from '../actions/logAction';
import { fetchTasksOfProject } from './taskActions';
import { FETCH_PARATEXT_PROJECTS, SELECT_PARATEXT_PROJECT } from './types';

export const fetchParatextProjects = () => (dispatch: any) => {
    Axios.get('/api/GetParatextProjects')
        .then(paratextProjects => {
            dispatch({
                payload: paratextProjects,
                type: FETCH_PARATEXT_PROJECTS
            });
        })
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " fetch Paratext projects"))
        });
}

export const selectParatextProject = (project: IParatextProject) => (dispatch: any) => {
    dispatch({
        payload: project.id,
        type: SELECT_PARATEXT_PROJECT
    })
    Axios.put('/api/UpdateProject?project=' + project.id + '&name=' + project.name + '&guid=' + project.guid + '&lang=' + project.lang + '&langName=' + project.langName + '&font=' + project.font + '&size=' + project.size + '&features=' + project.features + '&dir=' + project.direction + '&type=' + project.type + '&uri=' + project.uri + '&sync=true&claim=true' )
        .then (dispatch(fetchTasksOfProject(project.id)))
        .catch((reason: any) => {
            dispatch(log(JSON.stringify(reason) + " " + SELECT_PARATEXT_PROJECT +  ", id=" + project.id))
        });
}