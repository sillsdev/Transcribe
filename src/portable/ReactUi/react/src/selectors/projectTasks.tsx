import { createSelector } from 'reselect';
import { IState } from '../model/state';

const selectorProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const projectTasks = createSelector( selectAllProjects, selectorProject, (allProjects, projectId) => {
    const currentProject = allProjects.filter(p => p.id === projectId);
    return (currentProject.length > 0? currentProject[0].task: []);
});

export default projectTasks;
