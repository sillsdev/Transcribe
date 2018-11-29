import {combineReducers} from 'redux';
import audioReducer from './audioReducer';
import avatarReducer from './avatarReducer';
import localizationReducer from './localizationReducer';
import projectReducer from './paratextProjectReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';

export default combineReducers({
    audio: audioReducer,
    avatar: avatarReducer,
    paratextProjects: projectReducer,
    strings: localizationReducer,
    tasks: taskReducer,
    users: userReducer,
})