import VideoQuality from './video-quality'
import Video from './video'
import API from './api'

const EventEmitter = require('event-emitter-es6')

export default class Player extends EventEmitter {
  static loadPlayersByAlbum (albumId, args = {}) {
    var players = []

    return new Promise((resolve, reject) => {
      API.getAlbumVideos(albumId).then(resp => {
        for (var i = 0; i < resp.data.length; i++) {
          var player = new Player(resp.data[i].uri, args)
          player.video.data = resp.data[i]
          players.push(player)
        }

        resolve(players)
      })
    })
  }

  constructor (videoId, args = {}) {
    super()

    if (!videoId) {
      throw new Error('[Vimeo] Video ID is required')
    }

    this.id = this.parseVideoId(videoId)
    this.texture

    this.video = new Video(this.id, args)

    this.bindEvents()

    if (args.autoload) {
      this.load()
    }
  }

  bindEvents () {
    this.video.on('metadataLoad', function () {
      this.emit('metadataLoad')
    }.bind(this))

    this.video.on('videoLoad', function () {
      this.texture = this.video.texture
      this.emit('videoLoad')
    }.bind(this))

    this.video.on('play', function () {
      this.emit('play')
    }.bind(this))
  }

  parseVideoId (id) {
    return parseInt(id.toString().match(/([0-9]+)/)[1])
  }

  mute () {
    this.video.mute()
  }

  unmute () {
    this.video.unmute()
  }

  load () {
    this.video.load()
  }

  setQuality (quality) {
    this.video.selectedQuality = quality
  }

  getWidth () {
    return this.video.getWidth()
  }

  getHeight () {
    return this.video.getHeight()
  }

  play () {
    if (this.video) {
      this.video.play()
    }
  }

  pause () {
    if (this.video) {
      this.video.pause()
    }
  }
}
