import {combineReducers} from 'redux';
import { audioReducer as audio } from '../components/redux-audio';
import audioReducer from './audioReducer';
import taskReducer from './taskReducer';
import userReducer from './userReducer';

export default combineReducers({
    audio,
    auidoStatus: audioReducer,
    tasks: taskReducer,
    users: userReducer,
})