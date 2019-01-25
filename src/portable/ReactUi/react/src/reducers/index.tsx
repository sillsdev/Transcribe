import {combineReducers} from 'redux';
import audioReducer from './audioReducer';
import avatarReducer from './avatarReducer';
import localizationReducer from './localizationReducer';
import metaReducer from './metaReducer';
import projectReducer from './paratextProjectReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';

export default combineReducers({
    audio: audioReducer,
    avatar: avatarReducer,
    meta: metaReducer,
    paratextProjects: projectReducer,
    strings: localizationReducer,
    tasks: taskReducer,
    users: userReducer,
})