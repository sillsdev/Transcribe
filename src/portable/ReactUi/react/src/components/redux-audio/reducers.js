'use strict'

import { AUDIO_ENDED, AUDIO_PLAY, AUDIO_PAUSE, AUDIO_PLAYING, AUDIO_PAUSED,
         AUDIO_REGISTER, AUDIO_UNREGISTER, AUDIO_SRC, AUDIO_COMMAND } from './actions/TYPES'

const getNewMap = () => {
  return {
    command: 'none',
    src: '',
    state: 'none',
  }
}

const singleReducer = (state, action) => {
  switch (action.type) {
    case AUDIO_PLAY:
      return {
        ...state,
        command: 'play'
      }
    case AUDIO_PAUSE:
      return {
        ...state,
        command: 'pause'
      }
    case AUDIO_COMMAND:
      return {
        ...state,
        command: 'none'
      }
    case AUDIO_PLAYING:
      return {
        ...state,
        state: 'playing'
      }
    case AUDIO_PAUSED:
      return {
        ...state,
        state: 'paused'
      }
    case AUDIO_ENDED:
      return {
        ...state,
        state: 'ended'
      }
    case AUDIO_SRC:
      return {
        ...state,
        src: action.src
      }
    default:
      return state
  }
}

export default (state = {}, action) => {
  switch (action.type) {
    case AUDIO_REGISTER:
      return {
        ...state,
        [action.id]: getNewMap()
      }
    case AUDIO_UNREGISTER:
      return {
        ...state,
        [action.id]: undefined
      }
    case AUDIO_PLAY:
    case AUDIO_PLAYING:
    case AUDIO_PAUSE:
    case AUDIO_PAUSED:
    case AUDIO_ENDED:
    case AUDIO_SRC:
    case AUDIO_COMMAND:
      return {
        ...state,
        [action.id]: singleReducer(state[action.id], action)
      }
    default:
      return state
  }
}
