/* global describe, beforeEach, it, beforeEach, expect */
import VideoElement from '../src/components/video-element'
import VimeoVideo from '../src/components/vimeo-video'

describe('VideoElement', () => {
  let vimeoVideo, videoElement

  beforeEach(() => {
    vimeoVideo = new VimeoVideo(123)
    videoElement = new VideoElement(vimeoVideo)
  })

  describe('constructor', () => {
    it('to create a video DOM element with the video id in the element id', () => {
      expect(videoElement.getElement().id).toBe('vimeo-webgl-player-123')
    })

    it('to create a video DOM element with crossorigin set to anonymous', () => {
      expect(videoElement.getElement().crossOrigin).toBe('anonymous')
    })

    it('to create a video DOM element not muted by default', () => {
      expect(videoElement.getElement().muted).toBe(false)
    })

    it('to create a video DOM element that autoplays by default', () => {
      expect(videoElement.getElement().autoplay).toBe(true)
    })

    it('to create a video DOM element that loops by default', () => {
      expect(videoElement.getElement().loop).toBe(true)
    })

    it('creats adaptive DASH player on supported platform', () => {
      expect(videoElement.player.setBufferAheadToKeep.toString()).toBe(
        'function setBufferAheadToKeep(value){mediaPlayerModel.setBufferAheadToKeep(value)}'
      )
    })
  })

  describe('getElement', () => {
    it('returns the dom element', () => {
      expect(videoElement.getElement()).toBe(videoElement.domElement)
    })

    it('does not return the dom element if it does not exist', () => {
      videoElement.domElement = null
      expect(videoElement.getElement()).toBe(undefined)
    })
  })

  describe('play', () => {
    it('tries to play and logs an error when player was created but video is not initialized', () => {
      expect(() => {
        videoElement.play()
      }).toThrow(new Error('[Vimeo] Failed triggering playback, try initializing the element with a valid video before hitting play'))
    })
  })

  describe('pause', () => {
    it('tries to pause and logs an error when player was created but video is not initialized', () => {
      expect(() => {
        videoElement.pause()
      }).toThrow(new Error('[Vimeo] Failed triggering playback, try initializing the element with a valid video before hitting pause'))
    })
  })

  describe('stop', () => {
    it('tries to stop and logs an error when player was created but video is not initialized', () => {
      expect(() => {
        videoElement.stop()
      }).toThrow('You must first call initialize() and set a valid source and view before calling this method')
    })
  })

  describe('volume', () => {
    it('setVolume sets the volume', () => {
      videoElement.setVolume(0.5)
      expect(videoElement.getVolume()).toBe(0.5)
    })

    it('is set to 1 by default', () => {
      expect(videoElement.getVolume()).toBe(1.0)
    })
  })

  describe('createElement', () => {
    it('creats and returns a video dom element', () => {
      const domElement = videoElement.createElement(vimeoVideo)
      expect(domElement.tagName).toBe('VIDEO')
    })
  })

  describe('createAdaptivePlayer', () => {
    it('creats and returns a DASH.js player element on supported platforms', () => {
      const adaptivePlayer = videoElement.createAdaptivePlayer(vimeoVideo)
      expect(adaptivePlayer.setBufferAheadToKeep.toString()).toBe(
        'function setBufferAheadToKeep(value){mediaPlayerModel.setBufferAheadToKeep(value)}'
      )
    })
  })

  describe('setiOSPlayerAttributes', () => {
    it('sets webkit-playsinline iOS attributes on div for inline playback', () => {
      const domElement = document.createElement('div')
      videoElement.setiOSPlayerAttributes(domElement)
      expect(domElement.getAttribute('webkit-playsinline')).toBe('webkit-playsinline')
    })

    it('sets playsinline iOS attributes on div for inline playback', () => {
      const domElement = document.createElement('div')
      videoElement.setiOSPlayerAttributes(domElement)
      expect(domElement.getAttribute('playsinline')).toBe('playsinline')
    })
  })
})
