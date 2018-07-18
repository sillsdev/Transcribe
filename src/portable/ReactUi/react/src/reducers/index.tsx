import {combineReducers} from 'redux';
import audioReducer from './audioReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';

export default combineReducers({
    audio: audioReducer,
    tasks: taskReducer,
    users: userReducer,
})