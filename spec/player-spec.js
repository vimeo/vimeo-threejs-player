import Player from '../src/components/player'
import VideoQuality from '../src/components/video-quality'

describe('Player', ()=>{
  let player

  beforeEach(()=>{
      player = new Player(123)
  })

  describe('constructor', ()=>{
    it('throws error without parameter', ()=>{
      expect(()=>{
        new Player()
      }).toThrow(new Error('[Vimeo] Video ID is required'))
    })

    it('sets default quality to auto', ()=>{
      expect(player.quality).toBe(VideoQuality.auto)
    })

    it('sets default quality to auto', ()=>{
      expect(new Player(155, VideoQuality.x1080).quality).toBe(VideoQuality.x1080)
    })

    it('sets id', ()=>{
      expect(new Player(155).id).toBe(155)
    })
  }) 
})
