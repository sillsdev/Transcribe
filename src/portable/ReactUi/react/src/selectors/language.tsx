import { createSelector } from 'reselect';
import { log } from '../actions/logAction';
import { IState } from '../model/state';

const selectedProject = (state: IState) => state.tasks.selectedProject;
const selectAllProjects = (state: IState) => state.tasks.projects;

const language = createSelector( selectAllProjects, selectedProject, (allProjects, projectId) => {
    const currentProject = allProjects.filter(p => p.id === projectId);
    const lang = currentProject.length > 0? currentProject[0].lang: "en";
    const direction = currentProject.length > 0? currentProject[0].direction: "ltr";
    log("Language?code=" + lang + "&dir=" + direction)
    return ({lang, direction});
});

export default language;
