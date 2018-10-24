import { createSelector } from 'reselect';
import { log } from '../actions/logAction';
import { IState } from '../model/state';

const selectedProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;
const selectedTask = (state: IState) => state.tasks.selectedTask;

const tasks = createSelector( selectAllProjects, selectedProject, (allProjects, projectId) => {
    const currentProject = allProjects && allProjects.filter(p => p.id === projectId);
    return (currentProject && currentProject.length > 0? currentProject[0].task: []);
});

const projectState = createSelector( tasks, selectedTask, (projectTasks, taskid) => {
    const task = projectTasks && projectTasks.filter(t => t.id === taskid);
    log("ProjectState=" + (task && task.length === 1? task[0].state: ""))
    return (task && task.length === 1? task[0].state: "");
})

export default projectState;
