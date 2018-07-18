import * as PropTypes from 'prop-types'

// tslint:disable-next-line:variable-name
const { string, bool, number, array, oneOfType, shape, object, func } = PropTypes

export const propTypes = {
  url: oneOfType([ string, array, object ]),
  // tslint:disable-next-line:object-literal-sort-keys
  playing: bool,
  loop: bool,
  controls: bool,
  volume: number,
  muted: bool,
  playbackRate: number,
  width: oneOfType([ string, number ]),
  height: oneOfType([ string, number ]),
  style: object,
  progressInterval: number,
  playsinline: bool,
  wrapper: oneOfType([ string, func ]),
  config: shape({
     file: shape({
      attributes: object,
      tracks: array,
      // tslint:disable-next-line:object-literal-sort-keys
      forceVideo: bool,
      forceAudio: bool,
      forceHLS: bool,
      forceDASH: bool,
      hlsOptions: object
    })
  }),
  onReady: func,
  onStart: func,
  onPlay: func,
  onPause: func,
  onBuffer: func,
  onEnded: func,
  onError: func,
  onDuration: func,
  onSeek: func,
  onProgress: func
}

export const defaultProps = {
  playing: false,
  // tslint:disable-next-line:object-literal-sort-keys
  loop: false,
  controls: false,
  volume: null,
  muted: false,
  playbackRate: 1,
  width: '640px',
  style: {},
  progressInterval: 1000,
  playsinline: false,
  wrapper: 'div',
  config: {
    file: {
      attributes: {},
      tracks: [],
      // tslint:disable-next-line:object-literal-sort-keys
      forceVideo: false,
      forceAudio: false,
      forceHLS: false,
      forceDASH: false,
      hlsOptions: {}
    }
  },
  // tslint:disable-next-line:no-empty
  onReady () {},
  // tslint:disable-next-line:no-empty
  onStart () {},
  // tslint:disable-next-line:no-empty
  onPlay () {},
  // tslint:disable-next-line:no-empty
  onPause () {},
  // tslint:disable-next-line:no-empty
  onBuffer () {},
  // tslint:disable-next-line:no-empty
  onEnded () {},
  // tslint:disable-next-line:no-empty
  onError () {},
  // tslint:disable-next-line:no-empty
  onDuration () {},
  // tslint:disable-next-line:no-empty
  onSeek () {},
  // tslint:disable-next-line:no-empty
  onProgress () {}
}

export const DEPRECATED_CONFIG_PROPS = [
  'fileConfig',
]
