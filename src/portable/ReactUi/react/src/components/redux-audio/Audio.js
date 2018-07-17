'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

class Audio extends React.Component {
  play () {
    ReactDOM.findDOMNode(this).play()
  }

  pause () {
    ReactDOM.findDOMNode(this).pause()
  }

  getDefaultProps () {
    return {
      autoPlay: false,
      controls: false,
      loop: false,
      preload: 'metadata'
    }
  }

  componentWillMount () {
    this.props.onMount()
  }

  componentDidMount () {
    const audio = ReactDOM.findDOMNode(this)
    const { onEnded, onPause, onPlaying, onLoadedMetadata, onLoadedData } = this.props
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('playing', onPlaying)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('loadeddata', onLoadedData)
  }

  componentWillUnmount () {
    const audio = ReactDOM.findDOMNode(this)
    const { onEnded, onPause, onPlaying, onLoadedMetadata, onLoadedData, onUnmount } = this.props
    audio.removeEventListener('ended', onEnded)
    audio.removeEventListener('pause', onPause)
    audio.removeEventListener('playing', onPlaying)
    audio.removeEventListener('loadedmetadata', onLoadedMetadata)
    audio.removeEventListener('loadeddata', onLoadedData)
    onUnmount()
  }

  componentDidUpdate (prevProps) {
    if (this.props.command !== 'none' && this.props.command !== prevProps.command) {
      this[this.props.command]()
      this.props.onCommand(this.props.command);
    }
  }

  render () {
    const { autoPlay, controls, loop, preload, src } = this.props

    return (
      <audio
        autoPlay={autoPlay}
        controls={controls}
        loop={loop}
        preload={preload}
        src={src}
      />
    )
  }
}

Audio.propTypes = {
  autoPlay: PropTypes.bool,
  command: PropTypes.oneOf(['play', 'pause', 'none']).isRequired,
  controls: PropTypes.bool,
  loop: PropTypes.bool,
  onCommand: PropTypes.func.isRequired,
  onEnded: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired,
  onPause: PropTypes.func.isRequired,
  onPlaying: PropTypes.func.isRequired,
  onUnmount: PropTypes.func.isRequired,
  preload: PropTypes.oneOf(['none', 'metadata', 'auto']),
  src: PropTypes.string.isRequired,
  uniqueId: PropTypes.string.isRequired
}

export default Audio
