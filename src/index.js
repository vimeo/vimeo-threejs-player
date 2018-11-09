import Video from './components/video'
import Player from './components/player'
import API from './components/api'

/*
 * Everything lives in the Vimeo namespace and is only
 * Attached to the window if THREE (three.js) exists
 */
const Vimeo = {
  Video: Video,
  Player: Player,
  API: API
}

if (window.THREE) {
  window.Vimeo = Vimeo
} else {
  console.warn('[Depth Player] three.js was not found, did you forget to include it?')
}
