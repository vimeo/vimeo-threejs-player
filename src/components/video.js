import VideoQuality from './video-quality';
import Util from './util';
import API from './api';

const EventEmitter = require('event-emitter-es6');

export default class Video extends EventEmitter {
  constructor (videoID, quality = VideoQuality.auto, autoplay = true) {
    super()

    this.id = videoID
    this.selectedQuality = quality
    
    this.data
    this.loaded
    this.videoElement
    this.dashVideoElement
    this.videoPlayer
    this.texture

    this.autoplay = autoplay
    this.muted = false
    this.loop = false
  }

  load () {
    this.loadMetadata()
  }

  loadMetadata () {
    if (!this.id) {
      console.warn('[Vimeo] No video ID was specified')
      return
    }

    API.getVideo(this.id).then(response => {
      this.setMetadata(response);
    })
  }

  setMetadata (metadata) {
    this.data = metadata
    this.emit('metadataLoad')
    
    if (this.autoplay) {
      this.setupVideoElement();
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

  setupVideoElement () {
    this.videoElement = document.createElement('video');
    this.videoElement.id = 'vimeo-webgl-player-' + this.id; 
    this.videoElement.crossOrigin = 'anonymous';
    this.videoElement.setAttribute('crossorigin', 'anonymous');
    this.videoElement.muted = this.muted;
    this.videoElement.autoplay = this.autoplay;
    this.videoElement.loop = this.loop;
    
    // When the video is done loading, trigger the load event
    this.videoElement.addEventListener('loadeddata', function() {
      if (this.videoElement.readyState >= 2) {
        this.setupTexture()
        this.emit('videoLoad');
      }
    }.bind(this));

    if (this.isDashPlayback()) {
      this.videoPlayer = dashjs.MediaPlayer().create()
      this.videoPlayer.initialize(this.videoElement, this.getAdaptiveURL(), false) 
      
    } else {
      this.videoPlayer = this.videoElement

      if (Util.isiOS()) {
        this.videoPlayer.setAttribute('webkit-playsinline', 'webkit-playsinline');
        this.videoPlayer.setAttribute('playsinline', 'playsinline');
      }

      this.videoPlayer.src = this.getFileURL();
      this.videoPlayer.load();
    }
  }

  setupTexture() {
    this.texture = new THREE.VideoTexture(this.videoElement)
    this.texture.minFilter = THREE.NearestFilter
    this.texture.magFilter = THREE.LinearFilter
    this.texture.format = THREE.RGBFormat
    this.texture.generateMipmaps = false
  }

  getFileURL ()
  {
    if (this.isAdaptivePlayback()) {
      return this.getAdaptiveURL()
    }
    else {
      return this.getProgressiveFileURL(this.selectedQuality)
    }
  }

  getAdaptiveURL ()
  {
    if (this.isDashPlayback()) {
      return this.data.play.dash.link;
    }
    else {
      return this.data.play.hls.link;
    }
  }

  getProgressiveFileURL ()
  {
    if (this.isLive()) {
      console.warn("[Vimeo] This is a live video! There are no progressive video files availale.")
    }
  }

  isLive () {
    return this.data.live.status === 'streaming'
  }

  isAdaptivePlayback() {
    return this.selectedQuality == VideoQuality.auto || this.selectedQuality == VideoQuality.adaptive
  }

  isDashPlayback () {
    return this.isAdaptivePlayback() && !Util.isiOS()
  }
}