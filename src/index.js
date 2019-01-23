import Player from './components/player'
import VideoQuality from './components/video-quality'
import { version } from '../package.json'

const Vimeo = {
  Player: Player,
  VideoQuality: VideoQuality,
  Version: version
}

window.Vimeo = Vimeo
export default Vimeo
