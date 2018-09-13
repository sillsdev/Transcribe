import { createSelector } from 'reselect';
import { IState } from '../model/state';

const selectedProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const allTasks = createSelector( selectAllProjects, selectedProject, (allProjects, projectId) => {
    const currentProject = allProjects.filter(p => p.id === projectId);
    return (currentProject.length > 0? currentProject[0].task: []);
});

export default allTasks;
