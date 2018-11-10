import VideoQuality from './video-quality'
import Util from './util'
import API from './api'
import canAutoPlay from 'can-autoplay'

const dashjs = require('dashjs')

const EventEmitter = require('event-emitter-es6')

export default class Video extends EventEmitter {
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
    this.dashVideoElement
    this.videoPlayer
    this.texture

    if (this.autoplay === true) {
      canAutoPlay.video({ muted: this.muted }).then(({ result, error }) => {
        if (result === false) {
          console.warn('Autoplay not available on this browser')
          this.autoplay = false
        }
      })
    }
  }

  load () {
    this.loadMetadata()
  }

  loadMetadata () {
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
      var desc = "asdfasfds" + this.data.description
      var match = desc.match(/(\{.*\})/g)
      if (match) {
        this.config = JSON.parse(match[0])
      }
    }
  }

  isLoaded () {
    return this.data && this.videoPlayer
  }

  play () {
    if (!this.isLoaded()) {
      this.setupVideoElement()
    }

    this.videoPlayer.play()

    this.emit('play')
  }

  pause () {
    if (!this.isLoaded()) {
      this.setupVideoElement()
    }

    this.videoPlayer.pause()

    this.emit('pause')
  }

  mute () {
    this.muted = true

    if (this.videoElement) {
      this.videoElement.muted = true
    }
  }

  unmute () {
    this.muted = false

    if (this.videoElement) {
      this.videoElement.muted = false
    }
  }

  setupVideoElement () {
    this.videoElement = document.createElement('video')
    this.videoElement.id = 'vimeo-webgl-player-' + this.id
    this.videoElement.crossOrigin = 'anonymous'
    this.videoElement.setAttribute('crossorigin', 'anonymous')
    this.videoElement.muted = this.muted
    this.videoElement.autoplay = this.autoplay
    this.videoElement.loop = this.loop

    // When the video is done loading, trigger the load event
    this.videoElement.addEventListener('loadeddata', function () {
      if (this.videoElement.readyState >= 2) {
        this.emit('videoLoad')
      }
    }.bind(this))

    if (this.isDashPlayback()) {
      this.videoPlayer = dashjs.MediaPlayer().create()
      this.videoPlayer.initialize(this.videoElement, this.getAdaptiveURL(), this.autoplay)
    } else {
      this.videoPlayer = this.videoElement

      if (Util.isiOS()) {
        this.videoPlayer.setAttribute('webkit-playsinline', 'webkit-playsinline')
        this.videoPlayer.setAttribute('playsinline', 'playsinline')
      }

      this.videoPlayer.src = this.getFileURL()
      this.videoPlayer.load()
    }

    this.setupTexture()
  }

  setupTexture () {
    this.texture = new THREE.VideoTexture(this.videoElement)
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
