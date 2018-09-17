import { createSelector } from 'reselect';
import { IState } from '../model/state';

const selectorProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const currentProject = createSelector( selectAllProjects, selectorProject, (allProjects, projectId) => {
    return allProjects.filter(p => p.id === projectId)[0];
});

export default currentProject;
