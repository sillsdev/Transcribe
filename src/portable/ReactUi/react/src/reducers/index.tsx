import {combineReducers} from 'redux';
import audioReducer from './audioReducer';
import localizationReducer from './localizationReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';

export default combineReducers({
    audio: audioReducer,
    strings: localizationReducer,
    tasks: taskReducer,
    users: userReducer,
})