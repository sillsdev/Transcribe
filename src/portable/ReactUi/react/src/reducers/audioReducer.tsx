import {
  ASSIGN_TASK_PENDING,
  COMPLETE_REVIEW_PENDING,
  COMPLETE_TRANSCRIPTION_PENDING,
  FETCH_TASKS,
  FETCH_TRANSCRIPTION,
  INITIAL_TRANSCRIPTION,
  JUMP_CHANGE,
  PLAY_STATUS,
  PLAYSPEEDRATE_CHANGE,
  REPORT_POSITION,
  REQUEST_POSITION,
  SAVE_STATUS,
  SAVE_TOTAL_SECONDS,
  SELECT_TASK,
  SET_PLAYED_SECONDS,
  SUBMIT_STATUS,
  UNASSIGN_TASK_PENDING,
  WRITE_FULFILLED
} from "../actions/types";

const initialState = {
  initialPosition: 0,
  initialTranscription: true,
  jump: 0,
  playSpeedRate: 1,
  playedSeconds: 0,
  playing: false,
  reportedPosition: 0,
  requestReport: false,
  saved: false,
  submit: false,
  totalSeconds: 0,
  transcription: ""
};

export default function(state = initialState, action: any) {
  switch (action.type) {
    case ASSIGN_TASK_PENDING:
      return {
          ...state,
          playing: false
      }
    case PLAY_STATUS:
      return {
        ...state,
        playing: action.payload
      };
    case FETCH_TASKS:
      return {
        ...state,
        playing: false
      };
    case PLAYSPEEDRATE_CHANGE:
      return {
        ...state,
        playSpeedRate: action.payload
      };
    case JUMP_CHANGE:
      return {
        ...state,
        jump: action.payload
      };
    case REPORT_POSITION:
      return {
        ...state,
        reportedPosition: action.payload,
        requestReport: false
      };
    case REQUEST_POSITION:
      return {
        ...state,
        requestReport: true
      };
    case SAVE_TOTAL_SECONDS:
      return {
        ...state,
        totalSeconds: action.payload
      };
    case FETCH_TRANSCRIPTION:
      return {
        ...state,
        initialPosition: action.payload.data.position,
        saved: true,
        transcription: action.payload.data.transcription
      };
    case INITIAL_TRANSCRIPTION:
      return {
        ...state,
        initialTranscription: action.payload
      };
    case SELECT_TASK:
      return {
        ...state,
        initialTranscription: true,
        playing: false,
        transcription: ""
      };
    case SET_PLAYED_SECONDS:
      return {
        ...state,
        playedSeconds: action.payload
      };
    case SUBMIT_STATUS:
      return {
        ...state,
        submit: action.payload
      };
    case UNASSIGN_TASK_PENDING:
      return {
          ...state,
          playing: false,
      }
    case WRITE_FULFILLED:
      return {
        ...state,
        saved: true
      };
    case COMPLETE_TRANSCRIPTION_PENDING:
      return {
        ...state,
        transcription: ""
      };
    case COMPLETE_REVIEW_PENDING:
      return {
        ...state,
        transcription: ""
      };
    case SAVE_STATUS:
      return {
        ...state,
        saved: action.payload
      };

    default:
      return state;
  }
}
