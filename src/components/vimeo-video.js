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
   * @param {object} args - An object that holds the Vimeo video properties
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

    this.config = {}
    this.data
    this.loaded
    this.videoElement
    this.texture

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

  /** Load video from Vimeo */
  load () {
    this.getVideoDataFromVimeo()
  }

  getVideoDataFromVimeo () {
    if (!this.id) {
      console.warn('[Vimeo] No video ID was specified')
      return
    }

    if (!this.data) {
      API.getVideo(this.id).then(response => {
        this.setMetadata(response)
      })
    } else {
      this.setMetadata(this.data)
    }
  }

  setMetadata (metadata) {
    this.data = metadata
    this.setupConfig()
    this.emit('metadataLoad')

    this.setupVideoElement()
  }

  setupConfig () {
    if (this.data.description) {
      var desc = 'asdfasfds' + this.data.description
      var match = desc.match(/(\{.*\})/g)
      if (match) {
        this.config = JSON.parse(match[0])
      }
    }
  }

  isLoaded () {
    return this.data && this.videoElement.getElement()
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
    if (volume == 0) {
      this.muted = true
      this.mute()
    } else if (volume > 0) {
      this.muted = false
      this.videoElement.setVolume(volume)
    }
  }

  /** Muted the video */
  mute () {
    this.muted = true
    this.videoElement.setVolume(0.0)
  }

  /** Unmute the video */
  unmute () {
    this.muted = false
    this.videoElement.setVolume(1.0)
  }

  setupVideoElement () {
    this.videoElement = new VideoElement(this)
    this.videoElement.on('videoLoad', () => {
      this.emit('videoLoad')
    })

    this.setupTexture()
  }

  setupTexture () {
    this.texture = new THREE.VideoTexture(this.videoElement.getElement())
    this.texture.minFilter = THREE.NearestFilter
    this.texture.magFilter = THREE.LinearFilter
    this.texture.format = THREE.RGBFormat
    this.texture.generateMipmaps = true
  }

  /**
   * Get the video's width in pixels
   * @returns {number}
   */
  getWidth () {
    return this.data.width
  }

  /**
   * Get the video's height in pixels
   * @returns {number}
   */
  getHeight () {
    return this.data.height
  }

  getFileURL () {
    if (this.isAdaptivePlayback()) {
      return this.getAdaptiveURL()
    } else {
      return this.getProgressiveFileURL(this.selectedQuality)
    }
  }

  getAdaptiveURL () {
    if (this.isDashPlayback()) {
      return this.data.play.dash.link
    } else {
      return this.data.play.hls.link
    }
  }

  getProgressiveFileURL (quality) {
    if (this.isLive()) {
      console.warn('[Vimeo] This is a live video! There are no progressive video files availale.')
    } else {
      this.data.play.progressive.sort(function (a, b) {
        return a.height < b.height ? 1 : -1
      })

      var preferred_qualities = []
      for (var i = 0; i < this.data.play.progressive.length; i++) {
        if (quality > this.data.play.progressive[i].height) {
          preferred_qualities.push(this.data.play.progressive[i])
        } else if (quality == this.data.play.progressive[i].height) {
          return this.data.play.progressive[i].link
        }
      }

      if (preferred_qualities.length == 0) {
        var file = this.data.play.progressive[this.data.play.progressive.length - 1]
        console.log('[Vimeo] This video does not have a ' + quality + 'p resolution. Defaulting to ' + file.height + 'p.')
        return file.link
      } else {
        console.log('[Vimeo] This video does not have a ' + quality + ' resolution. Defaulting to ' + preferred_qualities[0].height + 'p.')
        return preferred_qualities[0].link
      }
    }
  }

  isLive () {
    return this.data.live && this.data.live.status === 'streaming'
  }

  isAdaptivePlayback () {
    return this.selectedQuality === VideoQuality.auto || this.selectedQuality === VideoQuality.adaptive
  }

  isDashPlayback () {
    return this.isAdaptivePlayback() && !Util.isiOS()
  }
}
