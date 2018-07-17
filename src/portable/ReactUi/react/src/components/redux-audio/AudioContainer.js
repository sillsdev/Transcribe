'use strict'

import { connect } from 'react-redux'
import Audio from './Audio'
import { audioEnded, audioRegister, audioPaused, audioPlaying, audioUnregister, audioCommand } from './actions'

const mapStateToProps = (state, ownProps) => {
  const stateObj = state.audio[ownProps.uniqueId]
  if (ownProps.src && stateObj && !stateObj.src) {
    return {
      command: stateObj ? stateObj.command : 'none'
    }
  } else {
    return {
      command: stateObj ? stateObj.command : 'none',
      src: stateObj ? stateObj.src : ''
    }
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onCommand: () => {
      dispatch(audioCommand(ownProps.uniqueId))
    },
    onEnded: () => {
      dispatch(audioEnded(ownProps.uniqueId))
    },
    onMount: () => {
      dispatch(audioRegister(ownProps.uniqueId))
    },
    onPause: () => {
      dispatch(audioPaused(ownProps.uniqueId))
    },
    onPlaying: () => {
      dispatch(audioPlaying(ownProps.uniqueId))
    },
    onUnmount: () => {
      dispatch(audioUnregister(ownProps.uniqueId))
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Audio)
