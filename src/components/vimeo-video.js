/* global THREE */
import VideoQuality from './video-quality'
import VideoElement from './video-element'
import Util from './util'
import API from './api'
import canAutoPlay from 'can-autoplay'
import EventEmitter from 'event-emitter-es6'

/** Class representing a Vimeo video resource */
export default class VimeoVideo extends EventEmitter {
  /**
   * @constructor Create a Vimeo video resource
   * @param {number} videoId - A Vimeo video ID (e.g 296928206)
   * @param {Object} args - An object that holds the Vimeo video properties
   * @param {number} [args.quality = VideoQuality.auto] - args.quality - The video quality represented by the VideoQuality enum
   * @param {bool} [args.muted = false] - A boolean for loading a video and playing it back muted
   * @param {bool} [args.autoplay = true] - A boolean for loading the video and automatically playing it once it has loaded
   * @param {bool} [args.loop = true] - A boolean for looping the video playback when it reaches the end
   */
  constructor (videoId, args = {}) {
    super()

    this.id = videoId
    this.selectedQuality = args.quality || VideoQuality.auto
    this.muted = typeof args.muted !== 'undefined' ? args.muted : false
    this.autoplay = typeof args.autoplay !== 'undefined' ? args.autoplay : true
    this.loop = typeof args.loop !== 'undefined' ? args.loop : true

    if (this.autoplay) {
      canAutoPlay.video({ muted: this.muted, timeout: 1000 }).then(({ result, error }) => {
        if (result === false) {
          console.warn('[Vimeo] Autoplay not available on this browser', error)
          this.autoplay = false

          window.addEventListener('click', this.onClickAutoplayFix.bind(this))
        }
      })
    }
  }

  /**
   * An internal method that removes that hits play for autoplay fix event listener, should not be used from outside the class
   */
  onClickAutoplayFix () {
    this.play()
    window.removeEventListener('click', this.onClickAutoplayFix.bind(this))
  }

  /**
   * Load a specific video by providing a Vimeo video ID
   * @param {number} videoId - A Vimeo video ID (e.g 296928206)
   */
  loadFromVideoId (videoId) {
    if (!videoId) {
      throw new Error('[Vimeo] No video ID was specified')
    }

    if (!this.data) {
      API.getVideo(videoId).then(response => {
        this.data = response
        this.setupVideoElement()
      }).catch(error => {
        throw new Error(error)
      })
    } else {
      this.emit('metadataLoad')
    }
  }

  /**
   * Load a specific video based on the Vimeo video ID provided to the constructor, for internal class use
   */
  load () {
    this.loadFromVideoId(this.id)
  }

  /**
   * Parses the Vimeo video description and returns a JSON object if it exists
   * Useful for when storing metadata in video description (e.g volumetric video)
   * @returns {Object}
   */
  getJSONFromVideoDescription () {
    if (this.data.description) {
      let desc = this.data.description
      let match = desc.match(/(\{.*\})/gms)
      if (match) {
        return JSON.parse(match[0])
      }
    } else {
      console.warn('[Vimeo] No video is loaded')
    }
    return null
  }

  /**
   * Query wheter the current video is loaded
   * @returns {bool}
   */
  isLoaded () {
    if (this.data && this.videoElement) {
      if (this.videoElement.getElement()) {
        return true
      }
    }
    return false
  }

  /**
   * Query wheter the current video is playing
   * @returns {bool}
   */
  isPlaying () {
    if (this.videoElement) {
      return this.videoElement.isPlaying()
    } else {
      throw new Error('[Vimeo] A video has not been created, yet you are trying to check if it is playing')
    }
  }

  /**
   * Query wheter a video is paused
   * @returns {bool}
   */
  isPaused () {
    if (this.videoElement) {
      return this.videoElement.isPaused()
    } else {
      throw new Error('[Vimeo] A video has not been created, yet you are trying to check if it is paused')
    }
  }

  /**
   * Query wheter a video is stopped
   * @returns {bool}
   */
  isStopped () {
    if (this.videoElement) {
      return this.videoElement.isStopped()
    } else {
      throw new Error('[Vimeo] A video has not been created, yet you are trying to check if it is stopped')
    }
  }

  /**
   * Query the video current time
   * @returns {number}
   */
  getTime () {
    if (this.videoElement) {
      return this.videoElement.getTime()
    } else {
      throw new Error('[Vimeo] A video has not been created, yet you are trying to get the time for it')
    }
  }

  /**
   * Set the video current time
   * @param {number} time - the time to set the current video to
   */
  setTime (time) {
    if (this.videoElement) {
      this.videoElement.setTime(time)
    } else {
      throw new Error('[Vimeo] A video has not been created, yet you are trying to set the time for it')
    }
  }

  /** Play the video */
  play () {
    if (!this.isLoaded()) {
      this.setupVideoElement()
    }

    this.videoElement.play()

    this.emit('play')
  }

  /** Pause the video */
  pause () {
    if (!this.isLoaded()) {
      this.setupVideoElement()
    }

    this.videoElement.pause()

    this.emit('pause')
  }

  /** Stop the video */
  stop () {
    if (!this.isLoaded()) {
      this.setupVideoElement()
    }

    this.videoElement.stop()

    this.emit('stop')
  }

  /**
   * Set the video volume
   * @param {number} volume - A number for the new volume you would like to set between 0.0 and 1.0
   */
  setVolume (volume) {
    if (volume === 0) {
      this.muted = true
      this.videoElement.setVolume(volume)
    } else if (volume > 0) {
      this.muted = false
      this.videoElement.setVolume(volume)
    }
  }

  /** Muted the video */
  mute () {
    this.setVolume(0.0)
  }

  /** Unmute the video */
  unmute () {
    this.setVolume(1.0)
  }

  setupVideoElement () {
    this.videoElement = new VideoElement(this)
    this.videoElement.on('videoLoad', () => {
      this.setupTexture()
      this.emit('videoLoad', this.texture)
    })
  }

  /**
   * Create a three.js video texture
   */
  setupTexture () {
    if (this.videoElement.getElement().src === '') {
      throw new Error('[Vimeo] No video has been loaded yet')
    } else {
      this.texture = new THREE.VideoTexture(this.videoElement.getElement())
      this.texture.minFilter = THREE.NearestFilter
      this.texture.magFilter = THREE.LinearFilter
      this.texture.format = THREE.RGBFormat
      this.texture.generateMipmaps = true
    }
  }

  /**
   * Get the video's width in pixels
   * @returns {number}
   */
  getWidth () {
    if (this.data) {
      return this.data.width
    }
    return null
  }

  /**
   * Get the video's height in pixels
   * @returns {number}
   */
  getHeight () {
    if (this.data) {
      return this.data.height
    }
    return null
  }

  /**
   * Get the current Vimeo video file URL
   * @returns {string}
   */
  getFileURL () {
    if (this.isAdaptivePlayback()) {
      return this.getAdaptiveURL()
    } else {
      return this.getProgressiveFileURL(this.selectedQuality)
    }
  }

  /**
   * Get the current Vimeo video adaptive stream manifrest file URL
   * @returns {string}
   */
  getAdaptiveURL () {
    if (this.isDashPlayback()) {
      if (this.data) {
        return this.data.play.dash.link
      } else {
        console.warn('[Vimeo] There was a problem loading your video, did you provide a valid Vimeo video ID?')
      }
    } else {
      if (this.data) {
        return this.data.play.hls.link
      } else {
        console.warn('[Vimeo] There was a problem loading your video, did you provide a valid Vimeo video ID?')
      }
    }
  }

  /**
   * Get the current Vimeo video progressive file URL by specific video quality
   * @param {VideoQuality} quality - Specific quality to query the possible video resolutions
   * @returns {string}
   */
  getProgressiveFileURL (quality) {
    if (this.isLive()) {
      console.warn('[Vimeo] This is a live video! There are no progressive video files availale.')
    } else {
      if (this.data) {
        if (this.data.play.progressive) {
          this.data.play.progressive.sort(function (a, b) {
            return a.height < b.height ? 1 : -1
          })

          var preferredQualities = []
          for (var i = 0; i < this.data.play.progressive.length; i++) {
            if (quality > this.data.play.progressive[i].height) {
              preferredQualities.push(this.data.play.progressive[i])
            } else if (quality === this.data.play.progressive[i].height) {
              return this.data.play.progressive[i].link
            }
          }

          if (preferredQualities.length === 0) {
            var file = this.data.play.progressive[this.data.play.progressive.length - 1]
            console.log('[Vimeo] This video does not have a ' + quality + 'p resolution. Defaulting to ' + file.height + 'p.')
            return file.link
          } else {
            console.log('[Vimeo] This video does not have a ' + quality + ' resolution. Defaulting to ' + preferredQualities[0].height + 'p.')
            return preferredQualities[0].link
          }
        }
      } else {
        console.error('[Vimeo] No video available')
      }
    }
  }

  /**
   * Query wheter the current video is a livestream
   * @returns {bool}
   */
  isLive () {
    if (this.data) {
      return this.data.live && this.data.live.status === 'streaming'
    }
    return false
  }

  /**
   * Query wheter the current video is playing back an adaptive stream
   * @returns {bool}
   */
  isAdaptivePlayback () {
    return this.selectedQuality === VideoQuality.auto || this.selectedQuality === VideoQuality.adaptive
  }

  /**
   * Query wheter the current video is playing back an adaptive DASH stream
   * @returns {bool}
   */
  isDashPlayback () {
    return this.isAdaptivePlayback() && !Util.isiOS()
  }
}
