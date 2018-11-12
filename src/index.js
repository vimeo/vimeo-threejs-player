import Player from './components/player'
import VideoQuality from './components/video-quality'

/*
 * Everything lives in the Vimeo namespace and is only
 * Attached to the window if THREE (three.js) exists
 */
const Vimeo = {
  Player: Player,
  VideoQuality: VideoQuality
}

if (window.THREE) {
  window.Vimeo = Vimeo
} else {
  console.warn('[Vimeo] three.js was not found, did you forget to include it?')
}
