import { createSelector } from 'reselect';
import { log } from '../actions/logAction';
import { IState } from '../model/state';

const selectorProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const currentProject = createSelector( selectAllProjects, selectorProject, (allProjects, projectId) => {
    log("CurrentProject=" + projectId)
    return allProjects.filter(p => p.id === projectId)[0];
});

export default currentProject;
