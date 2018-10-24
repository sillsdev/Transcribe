import { createSelector } from 'reselect';
import { log } from '../actions/logAction';
import { IState } from '../model/state';

const selectedUser = (state: IState) => state.users.selectedUser;
const selectedProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const tasks = createSelector( selectAllProjects, selectedProject, (allProjects, projectId) => {
    const currentProject = allProjects.filter(p => p.id === projectId);
    return (currentProject.length > 0? currentProject[0].task: []);
});

const taskLists = createSelector( tasks, selectedUser, (projectTasks, username) => {
    const assignedTranscribe =  projectTasks.filter(t => t.assignedto === username && t.state === "Transcribe");
    const availableTranscribe =  projectTasks.filter(t => !(t.assignedto) && t.state === "Transcribe");
    const assignedReview =  projectTasks.filter(t => t.assignedto === username && t.state === "Review");
    const availableReview =  projectTasks.filter(t => !(t.assignedto) && t.state === "Review");
    log("TaskLists&myType=" + assignedTranscribe.length + "&myReview=" + assignedReview.length + "&allType=" + availableTranscribe.length + "&allReview" + availableReview.length)
    return ({
        assignedReview,
        assignedTranscribe,
        availableReview,
        availableTranscribe,
    })
});

export default taskLists;
