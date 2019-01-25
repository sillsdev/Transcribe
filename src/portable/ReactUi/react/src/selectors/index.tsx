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
    const inProgressTasks = projectTasks.filter(t => t.assignedto === username && (t.state === "Transcribe" || t.state === "Review"));
    const transcribedTasks = projectTasks.filter(t => t.assignedto === username && t.state === "Review");
    const transcribedOtherTasks = projectTasks.filter(t => t.assignedto !== username && t.state === "Review");
    const reviewedTasks = projectTasks.filter(t => t.assignedto === username && t.state === "Upload");
    const reviewedOtherTasks = projectTasks.filter(t => t.assignedto !== username && t.state === "Upload");
    const syncedTasks = projectTasks.filter(t => t.assignedto === username && t.state === "Complete");
    const syncedOtherTasks = projectTasks.filter(t => t.assignedto !== username && t.state === "Complete");
    const allTasks = projectTasks;
    log("TaskLists&myType=" + assignedTranscribe.length + "&myReview=" + assignedReview.length + "&allType=" + availableTranscribe.length + "&allReview" + availableReview.length)
    return ({
        allTasks,
        assignedReview,
        assignedTranscribe,
        availableReview,
        availableTranscribe,
        inProgressTasks,
        reviewedOtherTasks,
        reviewedTasks,
        syncedOtherTasks,
        syncedTasks,
        transcribedOtherTasks,
        transcribedTasks,
    })
});

export default taskLists;
