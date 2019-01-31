import Player from './components/player'
import VideoQuality from './components/video-quality'
import { version } from '../package.json'

window.Vimeo = {
  'Player': Player,
  'VideoQuality': VideoQuality,
  'Version': version
}

export {
  Player,
  VideoQuality,
  version
}
