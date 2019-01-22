import Player from './components/player'
import VideoQuality from './components/video-quality'
import { version } from '../package.json'

/*
 * Everything lives in the Vimeo namespace and is only
 * Attached to the window if THREE (three.js) exists
 */
const Vimeo = {
  Player: Player,
  VideoQuality: VideoQuality,
  Version: version
}

window.Vimeo = Vimeo
