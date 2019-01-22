/* global describe, beforeEach, it, beforeEach, expect */
import Player from '../src/components/player'
import VideoQuality from '../src/components/video-quality'

describe('Player', () => {
  let player

  beforeEach(() => {
    player = new Player(123)
  })

  describe('constructor', () => {
    it('throws error without video id parameter', () => {
      expect(() => {
        player = new Player()
      }).toThrow(new Error('[Vimeo] Video ID is required'))
    })

    it('sets default quality to auto', () => {
      expect(player.getQuality()).toBe(VideoQuality.auto)
    })

    it('sets quality to 1080p', () => {
      expect(player = new Player(155, VideoQuality.x1080).getQuality()).toBe(VideoQuality.x1080)
    })

    it('sets id', () => {
      expect(player = new Player(155).id).toBe(155)
    })

    it('parses video id from string', () => {
      expect(player.parseVideoId('155')).toBe(155)
    })
  })
})
