import Player from '../src/components/player'
import VideoQuality from '../src/components/video-quality'

describe('Player', function () {
  var player

  beforeEach(function () {
    player = new Player(123)
  })

  describe('constructor', function () {
    it('throws error without parameter', function () {
      expect(function () {
        new Player()
      }).toThrow(new Error('[Vimeo] Video ID is required'))
    })

    it('sets default quality to auto', function () {
      expect(player.quality).toBe(VideoQuality.auto)
    })

    it('sets default quality to auto', function () {
      expect(new Player(155, VideoQuality.x1080).quality).toBe(VideoQuality.x1080)
    })

    it('sets id', function () {
      expect(new Player(155).id).toBe(155)
    })
  })
})
