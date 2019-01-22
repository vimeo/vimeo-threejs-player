import VimeoVideo from './vimeo-video'
import Util from './util'
import dashjs from 'dashjs'
import EventEmitter from 'event-emitter-es6'

/** Class representing a DOM video element */
export default class VideoElement extends EventEmitter {
  /**
   * Create a DOM video element instace
   * @param {VimeoVideo} vimeoVideo - A VimeoVideo object representing the video resource
   */
  constructor (vimeoVideo) {
    super()

    this.domElement = this.createElement(vimeoVideo)
    this.domElement.addEventListener('loadeddata', () => {
      if (this.domElement.readyState >= 2) {
        if (vimeoVideo.autoplay) {
          vimeoVideo.play()
        }
        this.emit('videoLoad')
      }
    })
    this._isDashPlayback = vimeoVideo.isDashPlayback()
    this.player = this.createAdaptivePlayer(vimeoVideo)
  }

  /**
   * Get the <video> element
   * @returns {HTMLElement}
   */
  getElement () {
    if (this.domElement) {
      return this.domElement
    }
  }

  /** Play the video */
  play () {
    if (this.player) {
      this.player.play()
    }
  }

  /** Pause the video */
  pause () {
    if (this.player) {
      this.player.pause()
    }
  }

  /** Stop the video */
  stop () {
    if (this.player) {
      this.player.pause()
      if (this._isDashPlayback) {
        this.player.seek(0.0)
      } else {
        this.player.currentTime = 0.0
      }
    }
  }

  /**
   * Set the video volume
   * @param {number} volume - A number for the new volume you would like to set between 0.0 and 1.0
   */
  setVolume (volume) {
    if (this.player) {
      if (volume >= 0.0 && volume <= 1.0) {
        if (this._isDashPlayback) {
          this.player.setVolume(volume)
        } else {
          this.player.volume = volume
        }
      }
    }
  }

  /**
   * Create the <video> element based on the properties provided in the VimeoVideo
   * @param {VimeoVideo} vimeoVideo - A VimeoVideo object representing the video resource
   * @returns {HTMLElement}
   */
  createElement (vimeoVideo) {
    let domElement = document.createElement('video')
    domElement.id = 'vimeo-webgl-player-' + vimeoVideo.id
    domElement.crossOrigin = 'anonymous'
    domElement.setAttribute('crossorigin', 'anonymous')
    domElement.muted = vimeoVideo.muted
    domElement.autoplay = vimeoVideo.autoplay
    domElement.loop = vimeoVideo.loop

    return domElement
  }

  /**
   * Creates a new DOM element with either Dash, HLS or progressive video playback based on the platform support
   * @param {VimeoVideo} vimeoVideo - A VimeoVideo object representing the video resource
   * @returns {HTMLElement}
   */
  createAdaptivePlayer (vimeoVideo) {
    let player

    if (vimeoVideo.isDashPlayback()) {
      player = dashjs.MediaPlayer().create()
      player.initialize(this.domElement, vimeoVideo.getAdaptiveURL(), vimeoVideo.autoplay)
    } else {
      player = this.domElement

      if (Util.isiOS()) {
        this.setiOSPlayerAttributes(player)
      }

      player.src = vimeoVideo.getFileURL()
      player.load()
    }

    return player
  }

  /**
   * Adds iOS attributes to be able to play <video> tag inline
   * @param {HTMLElement} vimeoVideo - A <video> element that needs to be configured to play on iOS
   */
  setiOSPlayerAttributes (videoElement) {
    videoElement.setAttribute('webkit-playsinline', 'webkit-playsinline')
    videoElement.setAttribute('playsinline', 'playsinline')
  }
}
