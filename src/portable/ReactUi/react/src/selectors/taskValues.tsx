import { createSelector } from 'reselect';
import { log } from '../actions/logAction';
import { IState } from '../model/state';

const selectedTask = (state: IState) => state.tasks.selectedTask;
const selectedProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const tasks = createSelector( selectAllProjects, selectedProject, (allProjects, projectId) => {
    const currentProject = allProjects.filter(p => p.id === projectId);
    return (currentProject.length > 0? currentProject[0].task: []);
});

const taskValues = createSelector( tasks, selectedTask, (projectTasks, taskId) => {
    const task = projectTasks && projectTasks.filter(t => t.id === taskId)[0];
    log("TaskValues=" + (task?task.name:""))
    return ({
        heading: task && task.name? task.name: "",
    })
});

export default taskValues;
