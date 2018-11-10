import VideoQuality from './video-quality';
import Video from './video';
import API from './api';

const EventEmitter = require('event-emitter-es6');

export default class Player extends EventEmitter {
  constructor (videoIDs, quality = VideoQuality.auto, autoplay = true) {
    super()
    
    this.id = videoIDs
    this.quality = quality
    this.autoplay = this.autoplay
    this.muted = false
    this.video
    this.texture
  }

  static getPlayersByFolder (folder_id) {

  }

  load () {
    this.video = new Video(this.id, this.quality, this.autoplay)
    
    this.video.on('metadataLoad', function() {
      this.emit('metadataLoad')
    }.bind(this));

    this.video.on('videoLoad', function() {
      this.texture = this.video.texture;
      this.emit('videoLoad')
    }.bind(this));

    this.video.on('play', function() {      
      this.emit('play')
    }.bind(this));
    
    this.video.load();
  }

  getWidth() {
    return this.video.getWidth()
  }

  getHeight() {
    return this.video.getHeight()
  }

  play () {
    if (this.video) {
      this.video.play();
    }
  }

  pause () {
    if (this.video) {
      this.video.pause();
    }
  }
}