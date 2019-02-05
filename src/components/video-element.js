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
      try {
        this.player.play()
      } catch (error) {
        this.emit('error', error)
        throw new Error('[Vimeo] Failed triggering playback, try initializing the element with a valid video before hitting play')
      }
    }
  }

  /** Pause the video */
  pause () {
    if (this.player) {
      try {
        this.player.pause()
      } catch (error) {
        this.emit('error', error)
        throw new Error('[Vimeo] Failed triggering playback, try initializing the element with a valid video before hitting pause')
      }
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
   * Gets the video volume
   * @returns {number}
   */
  getVolume () {
    if (this.player) {
      if (this._isDashPlayback) {
        return this.player.getVolume()
      } else {
        return this.player.volume
      }
    }
  }

  /**
   * Query wheter a video is playing
   * @returns {bool}
   */
  isPlaying () {
    if (this.player) {
      if (this._isDashPlayback) {
        return !this.player.isPaused()
      } else {
        return !this.player.paused
      }
    } else {
      throw new Error('[Vimeo] A video has not been loaded yet')
    }
  }

  /**
   * Query wheter a video is paused
   * @returns {bool}
   */
  isPaused () {
    if (this.player) {
      if (this._isDashPlayback) {
        return this.player.isPaused()
      } else {
        return this.player.paused
      }
    }
  }

  /**
   * Query wheter a video is stopped
   * @returns {bool}
   */
  isStopped () {
    if (this.player) {
      return this.isPaused() && this.getTime() === 0
    }
  }

  /**
   * Set the current video time
   * @param {number} time - The time to set the video
   */
  setTime (time) {
    if (this.player) {
      if (this._isDashPlayback) {
        this.player.seek(time)
      } else {
        this.player.currentTime = time
      }
    }
  }

  /**
   * Query the current video time
   * @returns {number}
   */
  getTime () {
    if (this.player) {
      if (this._isDashPlayback) {
        return this.player.time()
      } else {
        return this.player.currentTime
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
