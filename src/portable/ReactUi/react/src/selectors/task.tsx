import { createSelector } from 'reselect';
import { IState } from '../model/state';

const selectorProject = (state: IState) => state.paratextProjects.selectedParatextProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const allTasks = createSelector( selectAllProjects, selectorProject, (allProjects, projectId) => {
    alert("selectedProject: " + projectId + " allProjects: " + JSON.stringify(allProjects))
    const currentProject = allProjects.filter(p => p.id === projectId);
    alert("current project: " + JSON.stringify(currentProject))
    return (currentProject.length > 0? currentProject[0].task: []);
});

export default allTasks;
