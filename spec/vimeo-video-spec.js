/* global describe, beforeEach, it, beforeEach, expect */
import VimeoVideo from '../src/components/vimeo-video'
import VideoElement from '../src/components/video-element'
import VideoQuality from '../src/components/video-quality'

describe('VimeoVideo', () => {
  let vimeoVideo
  let sampleVideoDescriptionWithJSONObject = 'This is an awesome video of Moose. Moose is the first volumetric space dog to ever land in the Vimeo HQ. We are really excited about that! { "_versionMajor": 0, "_versionMinor": 2, "boundsCenter": { "x": 0, "y": 0, "z": 1.23337292671204 }, "boundsSize": { "x": 2.9721360206604, "y": 1.66969299316406, "z": 0.505130290985107 }, "crop": { "w": 0.282333821058273, "x": 0.210362240672112, "y": 0.328365355730057, "z": 0.231896802783012 }, "depthFocalLength": { "x": 1919.83203125, "y": 1922.28527832031 }, "depthImageSize": { "x": 3840.0, "y": 2160.0 }, "depthPrincipalPoint": { "x": 1875.52282714844, "y": 1030.56298828125 }, "extrinsics": { "e00": 1, "e01": 0, "e02": 0, "e03": 0, "e10": 0, "e11": 1, "e12": 0, "e13": 0, "e20": 0, "e21": 0, "e22": 1, "e23": 0, "e30": 0, "e31": 0, "e32": 0, "e33": 1 }, "farClip": 1.48593807220459, "format": "perpixel", "nearClip": 0.980807781219482, "numAngles": 1, "textureHeight": 4096, "textureWidth": 2048 } Let us know what you think, Vimeo Creator Labs Team'

  beforeEach(() => {
    vimeoVideo = new VimeoVideo(123)
  })

  describe('constructor', () => {
    it('sets the id', () => {
      expect(vimeoVideo.id).toBe(123)
    })

    it('sets the selected quality to auto by default', () => {
      expect(vimeoVideo.selectedQuality).toBe(VideoQuality.auto)
    })

    it('sets muted to false by default', () => {
      expect(vimeoVideo.muted).toBe(false)
    })

    it('sets muted to true when provided as an arugment', () => {
      vimeoVideo = new VimeoVideo(123, { muted: true })
      expect(vimeoVideo.muted).toBe(true)
    })

    it('sets autoplay to false by default', () => {
      expect(vimeoVideo.autoplay).toBe(true)
    })

    it('sets autoplay to false when provided as an arugment', () => {
      vimeoVideo = new VimeoVideo(123, { autoplay: false })
      expect(vimeoVideo.autoplay).toBe(false)
    })

    it('sets loop to true by default', () => {
      expect(vimeoVideo.loop).toBe(true)
    })

    it('sets loop to false when provided as an arugment', () => {
      vimeoVideo = new VimeoVideo(123, { loop: false })
      expect(vimeoVideo.loop).toBe(false)
    })
  })

  describe('resolutions', () => {
    for (let i = 0; i < Object.keys(VideoQuality).length; i++) {
      it('sets the resolution to ' + Object.keys(VideoQuality)[i] + ' when provided as an argument', () => {
        vimeoVideo = new VimeoVideo(123, { quality: Object.keys(VideoQuality)[i] })
        expect(vimeoVideo.selectedQuality).toBe(Object.keys(VideoQuality)[i])
      })
    }
  })

  describe('loadFromVideoId', () => {
    it('throws an error when no video id is provided', () => {
      expect(() => {
        vimeoVideo.loadFromVideoId()
      }).toThrow(new Error('[Vimeo] No video ID was specified'))
    })
  })

  describe('getJSONFromVideoDescription', () => {
    it('parses and returns a JSON from valid object inside video description', () => {
      // Stub the video description as if the API would respond us
      vimeoVideo.data = {
        description: sampleVideoDescriptionWithJSONObject
      }
      const jsonObject = vimeoVideo.getJSONFromVideoDescription()
      expect(jsonObject.nearClip).toBe(0.980807781219482)
    })

    it('returns null if a valid JSON object was not found in the description', () => {
      // Stub the video description as if the API would respond us
      vimeoVideo.data = {
        description: 'Hello, we love the web, we also love 3D, we love the 3D web { test: { sample: 5'
      }
      const jsonObject = vimeoVideo.getJSONFromVideoDescription()
      expect(jsonObject).toBe(null)
    })
  })

  describe('isLoaded', () => {
    it('returns false when vimeoVideo is instaced but there is no Vimeo API response in vimeoVideo.data', () => {
      expect(vimeoVideo.isLoaded()).toBe(false)
    })

    it('returns false when vimeoVideo is instanced and there is a Vimeo API response in vimeoVideo.data but the VideoElement is not setup', () => {
      vimeoVideo.data = {
        description: 'Hello, we love the web, we also love 3D, we love the 3D web { test: { sample: 5'
      }
      expect(vimeoVideo.isLoaded()).toBe(false)
    })

    it('returns true when vimeoVideo is instanced and there is a Vimeo API response in vimeoVideo.data but the VideoElement is setup', () => {
      vimeoVideo.data = {
        description: 'Hello, we love the web, we also love 3D, we love the 3D web { test: { sample: 5'
      }
      vimeoVideo.videoElement = document.createElement('video')
      vimeoVideo.videoElement.getElement = () => {
        return vimeoVideo.videoElement
      }
      expect(vimeoVideo.isLoaded()).toBe(true)
    })
  })

  describe('play', () => {
    it('throws an error if play it triggered but no video source is present in the video element', () => {
      expect(() => {
        vimeoVideo.play()
      }).toThrow(new Error('[Vimeo] No video has been loaded yet'))
    })
  })

  describe('pause', () => {
    it('throws an error if pause it triggered but no video source is present in the video element', () => {
      expect(() => {
        vimeoVideo.pause()
      }).toThrow(new Error('[Vimeo] No video has been loaded yet'))
    })
  })

  describe('stop', () => {
    it('throws an error if stop it triggered but no video source is present in the video element', () => {
      expect(() => {
        vimeoVideo.pause()
      }).toThrow(new Error('[Vimeo] No video has been loaded yet'))
    })
  })

  describe('setVolume', () => {
    it('sets muted state true when called with volume 0', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.setVolume(0)
      expect(vimeoVideo.muted).toBe(true)
    })

    it('sets muted state false when called with non-zero volume', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.setVolume(0.2)
      expect(vimeoVideo.muted).toBe(false)
    })
  })

  describe('mute', () => {
    it('sets muted state true when called', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.mute()
      expect(vimeoVideo.muted).toBe(true)
    })
  })

  describe('unmute', () => {
    it('sets muted state false when called', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.unmute()
      expect(vimeoVideo.muted).toBe(false)
    })
  })

  describe('setupVideoElement', () => {
    it('creates a VideoElement', () => {
      expect(() => {
        vimeoVideo.setupVideoElement()
        expect(vimeoVideo.videoElement).toBe(new VideoElement(vimeoVideo))
      }).toThrow(new Error('[Vimeo] No video has been loaded yet'))
    })
  })

  describe('setupTexture', () => {
    it('throws an error when trying to call it without <video> src set in the VideoElement', () => {
      expect(() => {
        vimeoVideo = new VimeoVideo(123)
        vimeoVideo.videoElement = new VideoElement(vimeoVideo)
        vimeoVideo.setupTexture()
      }).toThrow(new Error('[Vimeo] No video has been loaded yet'))
    })
  })

  describe('getWidth', () => {
    it('returns null when no Vimeo API response is present', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      expect(vimeoVideo.getWidth()).toEqual(null)
    })
  })

  describe('getHeight', () => {
    it('returns null when no Vimeo API response is present', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      expect(vimeoVideo.getHeight()).toEqual(null)
    })
  })

  describe('getFileURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getFileURL()).toEqual(undefined)
    })
  })

  describe('getFileURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getFileURL()).toEqual(undefined)
    })
  })

  describe('getAdaptiveURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getAdaptiveURL()).toEqual(undefined)
    })
  })

  describe('getProgressiveURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getProgressiveFileURL(VideoQuality.x1080)).toEqual(undefined)
    })
  })

  describe('isLive', () => {
    it('returns false when no video has been loaded', () => {
      expect(vimeoVideo.isLive()).toEqual(false)
    })

    it('returns true when API response suggests that the video is live', () => {
      vimeoVideo.data = {
        live: {
          status: 'streaming'
        }
      }
      expect(vimeoVideo.isLive()).toEqual(true)
    })
  })

  describe('isAdaptivePlayback', () => {
    it('returns true when selected adaptive quality', () => {
      expect(vimeoVideo.isAdaptivePlayback()).toEqual(true)
    })

    it('returns false when not selected adaptive quality', () => {
      vimeoVideo.selectedQuality = VideoQuality.x1080
      expect(vimeoVideo.isAdaptivePlayback()).toEqual(false)
    })
  })

  describe('isDashPlayback', () => {
    it('returns true when selected adaptive quality and device is not iOS', () => {
      expect(vimeoVideo.isDashPlayback()).toEqual(true)
    })

    it('returns false when not selected adaptive quality', () => {
      vimeoVideo.selectedQuality = VideoQuality.x1080
      expect(vimeoVideo.isDashPlayback()).toEqual(false)
    })
  })
})
