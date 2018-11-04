import VimeoVideo from './components/vimeo-video'

/*
 * Everything lives in the Vimeo namespace and is only
 * Attached to the window if THREE (three.js) exists
 */
const Vimeo = {
  Video: VimeoVideo
}

if (window.THREE) {
  window.Vimeo = Vimeo
} else {
  console.warn('[Depth Player] three.js was not found, did you forget to include it?')
}
