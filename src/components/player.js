import VimeoVideo from './vimeo-video'
import API from './api'
import EventEmitter from 'event-emitter-es6'

/** A class that represents a Vimeo video player */
export default class Player extends EventEmitter {
  /**
   * @constructor Create a new Vimeo video player
   * @param {number} videoId - A Vimeo video ID (e.g 296928206)
   * @param {Object} args - An object that holds the Vimeo video properties
   * @param {number} [args.quality = VideoQuality.auto] - args.quality - The video quality represented by the VideoQuality enum
   * @param {bool} [args.muted = false] - A boolean for loading a video and playing it back muted
   * @param {bool} [args.autoplay = true] - A boolean for loading the video and automatically playing it once it has loaded
   * @param {bool} [args.loop = true] - A boolean for looping the video playback when it reaches the end
   */
  constructor (videoId, args = {}) {
    super()

    if (!videoId) {
      throw new Error('[Vimeo] Video ID is required')
    }

    this.id = this.parseVideoId(videoId)
    this.video = new VimeoVideo(this.id, args)
    this.bindEvents()

    if (args.autoload) {
      this.load()
    }
  }

  /**
   * Load a Vimeo album and create multipule Vimeo Players
   * @param {number} albumId - A Vimeo album ID (e.g 5528679)
   * @param {Object} args - An object that holds the Vimeo video properties
   * @param {number} [args.quality = VideoQuality.auto] - args.quality - The video quality represented by the VideoQuality enum
   * @param {bool} [args.muted = false] - A boolean for loading a video and playing it back muted
   * @param {bool} [args.autoplay = true] - A boolean for loading the video and automatically playing it once it has loaded
   * @param {bool} [args.loop = true] - A boolean for looping the video playback when it reaches the end
   */
  static loadPlayersByAlbum (albumId, args = {}) {
    let players = []

    return new Promise((resolve, reject) => {
      API.getAlbumVideos(albumId).then(resp => {
        for (let i = 0; i < resp.data.length; i++) {
          let player = new Player(resp.data[i].uri, args)
          player.video.data = resp.data[i]
          players.push(player)
        }

        resolve(players)
      })
    })
  }

  /** Bind all player event emitters, used internally */
  bindEvents () {
    this.video.on('metadataLoad', function () {
      this.emit('metadataLoad')
    }.bind(this))

    this.video.on('videoLoad', function (videoTexture) {
      this.texture = this.video.texture
      this.emit('videoLoad', videoTexture)
    }.bind(this))

    this.video.on('play', function () {
      this.emit('play')
    }.bind(this))
  }

  /**
   * Parse and clean a valid Vimeo video ID from string or integer
   * @param {number} id - The Vimeo video ID
   * @returns {number}
   */
  parseVideoId (id) {
    return parseInt(id.toString().match(/([0-9]+)/)[1])
  }

  /**
   * Get the current player's Vimeo video ID
   * @returns {number}
   */
  getVideoId () {
    return this.id
  }

  /**
   * Get the JSON metadata object stored in the Vimeo video description
   * @returns {object} - The metadata JSON object parsed from the Vimeo video description
   */
  getMetadata () {
    if (this.video) {
      return this.video.getJSONFromVideoDescription()
    } else {
      console.warn('[Vimeo] No video is loaded but you are trying to get the metadata')
    }
  }

  /**
   * Get the Vimeo video description
   * @returns {string} - The video description
   */
  getDescription () {
    if (this.video) {
      return this.video.data.description
    } else {
      console.warn('[Vimeo] No video is loaded but you are trying to get the description')
    }
  }

  /** Mute the video */
  mute () {
    this.video.mute()
  }

  /** Unmute the video */
  unmute () {
    this.video.unmute()
  }

  /** Load the current video */
  load () {
    this.video.load()
  }

  /**
   * Set the video quality based on one of the options in the VideoQuality enum
   * @param {VideoQuality} quality - The desired quality setting
   */
  setQuality (quality) {
    this.video.selectedQuality = quality
  }

  /**
   * Get the current selected video quality
   * @returns {number}
   */
  getQuality () {
    return this.video.selectedQuality
  }

  /**
   * Get the current video's width in pixels
   * @returns {number}
   */
  getWidth () {
    return this.video.getWidth()
  }

  /**
   * Get the current video's height in pixels
   * @returns {number}
   */
  getHeight () {
    return this.video.getHeight()
  }

  /**
   * Query wheter the current video is playing
   * @returns {bool}
   */
  isPlaying () {
    return this.video.isPlaying()
  }

  /**
   * Query wheter a video is paused
   * @returns {bool}
   */
  isPaused () {
    return this.video.isPaused()
  }

  /**
   * Query wheter a video is stopped
   * @returns {bool}
   */
  isStopped () {
    return this.video.isStopped()
  }

  /**
   * Query the video current time
   * @returns {number}
   */
  getTime () {
    return this.video.getTime()
  }

  /**
   * Set the video current time
   * @param {number} time - the time to set the current video to
   */
  setTime (time) {
    this.video.setTime(time)
  }

  /** Play the video */
  play () {
    if (this.video) {
      try {
        this.video.play()
      } catch (error) {
        throw new Error('[Vimeo] Video provided is not correct, try changing the video id and running the code again')
      }
    } else {
      console.warn('[Vimeo] Video has not been loaded yet, try calling player.load()')
    }
  }

  /** Pause the video */
  pause () {
    if (this.video) {
      try {
        this.video.pause()
      } catch (error) {
        throw new Error('[Vimeo] Video provided is not correct, try changing the video id and running the code again')
      }
    }
  }

  /** Stop the video */
  stop () {
    if (this.video) {
      try {
        this.video.stop()
      } catch (error) {
        throw new Error('[Vimeo] Video provided is not correct, try changing the video id and running the code again')
      }
    }
  }

  /**
   * Set the video volume
   * @param {number} volume - A number for the new volume you would like to set between 0.0 and 1.0
   */
  setVolume (volume) {
    if (this.video) {
      this.video.setVolume(volume)
    }
  }
}
