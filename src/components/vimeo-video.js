import VideoQuality from './video-quality'
import VideoElement from './video-dom-element'
import Util from './util'
import API from './api'
import canAutoPlay from 'can-autoplay'

const EventEmitter = require('event-emitter-es6')

/** Class representing a Vimeo video resource */
export default class VimeoVideo extends EventEmitter {
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

  onClickAutoplayFix () {
    this.play()
    window.removeEventListener('click', this.onClickAutoplayFix.bind(this))
  }

  load () {
    this.getVideoFromVimeo()
  }

  getVideoFromVimeo () {
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

  play () {
    if (!this.isLoaded()) {
      this.setupVideoElement()
    }

    this.videoElement.play()

    this.emit('play')
  }

  pause () {
    if (!this.isLoaded()) {
      this.setupVideoElement()
    }

    this.videoElement.pause()

    this.emit('pause')
  }

  setVolume (volume) {
    if (volume == 0) {
      this.muted = true
      this.mute()
    } else if (volume > 0) {
      this.muted = false
      this.videoElement.setVolume(volume)
    }
  }

  mute () {
    this.muted = true
    this.videoElement.setVolume(0.0)
  }

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

  getWidth () {
    return this.data.width
  }

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
