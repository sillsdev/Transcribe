import { createSelector } from 'reselect';
import { IState } from '../model/state';

const selectedTask = (state: IState) => state.tasks.selectedTask;
const selectedProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const tasks = createSelector( selectAllProjects, selectedProject, (allProjects, projectId) => {
    const currentProject = allProjects.filter(p => p.id === projectId);
    return (currentProject.length > 0? currentProject[0].task: []);
});

const taskValues = createSelector( tasks, selectedTask, (projectTasks, taskId) => {
    const task = projectTasks.filter(t => t.id === taskId)[0];
    return ({
        heading: task && task.name? task.name: "",
    })
});

export default taskValues;
