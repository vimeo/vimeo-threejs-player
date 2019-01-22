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
      expect(player = new Player(155, {
        quality: VideoQuality.x1080
      }).getQuality()).toBe(VideoQuality.x1080)
    })

    it('sets autoplay to true by default', () => {
      expect(player.video.autoplay).toBe(true)
    })

    it('sets autoplay to false when provided in argument object to constructor', () => {
      expect(player = new Player(155, {
        autoplay: false
      }).video.autoplay).toBe(false)
    })

    it('sets muted to false by default', () => {
      expect(player.video.muted).toBe(false)
    })

    it('sets autoplay to true when provided in argument object to constructor', () => {
      expect(player = new Player(155, {
        muted: true
      }).video.autoplay).toBe(true)
    })

    it('sets id', () => {
      expect(player = new Player(155).id).toBe(155)
    })

    it('returns video id using the getter', () => {
      expect(player = new Player(153).getVideoId()).toBe(153)
    })

    it('sets loop to true by default', () => {
      expect(player.video.loop).toBe(true)
    })

    it('sets loop to false when provided in argument object to constructor', () => {
      expect(player = new Player(155, {
        loop: false
      }).video.loop).toBe(false)
    })

    it('parses video id from string', () => {
      expect(player.parseVideoId('155')).toBe(155)
    })

    it('throws error when triggering play but video id is not valid', () => {
      expect(() => {
        player.play()
      }).toThrow(new Error('[Vimeo] Video provided is not correct, try changing the video id and running the code again'))
    })

    it('throws error when triggering stop but video id is not valid', () => {
      expect(() => {
        player.stop()
      }).toThrow(new Error('[Vimeo] Video provided is not correct, try changing the video id and running the code again'))
    })

    it('throws error when triggering pause but video id is not valid', () => {
      expect(() => {
        player.pause()
      }).toThrow(new Error('[Vimeo] Video provided is not correct, try changing the video id and running the code again'))
    })

    it('throws error when triggering stop but video id is not valid', () => {
      expect(() => {
        player.stop()
      }).toThrow(new Error('[Vimeo] Video provided is not correct, try changing the video id and running the code again'))
    })
  })
})
