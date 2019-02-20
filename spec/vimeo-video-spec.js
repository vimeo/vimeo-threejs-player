/* global describe, beforeEach, it, beforeEach, expect */
import VimeoVideo from '../src/components/vimeo-video'
import VideoElement from '../src/components/video-element'
import VideoQuality from '../src/components/video-quality'

var expect = require('chai').expect // eslint-disable-line

describe('VimeoVideo', () => {
  let vimeoVideo

  let sampleRegularText = 'Hello from Vimeo Creator Labs. Moose is the first ever volumetric dog and we are really excited about it'
  let sampleDepthKitDescriptionWithJSONObjectSingleline = '{ "_versionMajor": 0, "_versionMinor": 2, "boundsCenter": { "x": 0, "y": 0, "z": 1.23337292671204 }, "boundsSize": { "x": 2.9721360206604, "y": 1.66969299316406, "z": 0.505130290985107 }, "crop": { "w": 0.282333821058273, "x": 0.210362240672112, "y": 0.328365355730057, "z": 0.231896802783012 }, "depthFocalLength": { "x": 1919.83203125, "y": 1922.28527832031 }, "depthImageSize": { "x": 3840.0, "y": 2160.0 }, "depthPrincipalPoint": { "x": 1875.52282714844, "y": 1030.56298828125 }, "extrinsics": { "e00": 1, "e01": 0, "e02": 0, "e03": 0, "e10": 0, "e11": 1, "e12": 0, "e13": 0, "e20": 0, "e21": 0, "e22": 1, "e23": 0, "e30": 0, "e31": 0, "e32": 0, "e33": 1 }, "farClip": 1.48593807220459, "format": "perpixel", "nearClip": 0.980807781219482, "numAngles": 1, "textureHeight": 4096, "textureWidth": 2048 }'
  let sampleDepthKitDescriptionWithJSONObjectMultiline = `
    {
      "_versionMajor": 0,
      "_versionMinor": 2,
      "boundsCenter": {
          "x": 0,
          "y": 0,
          "z": 1.11511695384979
      },
      "boundsSize": {
          "x": 2.99391436576843,
          "y": 1.68192756175995,
          "z": 0.76341849565506
      },
      "crop": {
          "w": 0.776298642158508,
          "x": 0.147486850619316,
          "y": 0.187442049384117,
          "z": 0.537553906440735
      },
      "depthFocalLength": {
          "x": 1919.83203125,
          "y": 1922.28527832031
      },
      "depthImageSize": {
          "x": 3840.0,
          "y": 2160.0
      },
      "depthPrincipalPoint": {
          "x": 1875.52282714844,
          "y": 1030.56298828125
      },
      "extrinsics": {
          "e00": 1,
          "e01": 0,
          "e02": 0,
          "e03": 0,
          "e10": 0,
          "e11": 1,
          "e12": 0,
          "e13": 0,
          "e20": 0,
          "e21": 0,
          "e22": 1,
          "e23": 0,
          "e30": 0,
          "e31": 0,
          "e32": 0,
          "e33": 1
      },
      "farClip": 1.496826171875,
      "format": "perpixel",
      "nearClip": 0.73340767621994,
      "numAngles": 1,
      "textureHeight": 4096,
      "textureWidth": 2048
  }
  `

  beforeEach(() => {
    vimeoVideo = new VimeoVideo(123)
  })

  describe('constructor', () => {
    it('sets the id', () => {
      expect(vimeoVideo.id).to.equal(123)
    })

    it('sets the selected quality to auto by default', () => {
      expect(vimeoVideo.selectedQuality).to.equal(VideoQuality.auto)
    })

    it('sets muted to false by default', () => {
      expect(vimeoVideo.muted).to.equal(false)
    })

    it('sets muted to true when provided as an arugment', () => {
      vimeoVideo = new VimeoVideo(123, { muted: true })
      expect(vimeoVideo.muted).to.equal(true)
    })

    it('sets autoplay to false by default', () => {
      expect(vimeoVideo.autoplay).to.equal(true)
    })

    it('sets autoplay to false when provided as an arugment', () => {
      vimeoVideo = new VimeoVideo(123, { autoplay: false })
      expect(vimeoVideo.autoplay).to.equal(false)
    })

    it('sets loop to true by default', () => {
      expect(vimeoVideo.loop).to.equal(true)
    })

    it('sets loop to false when provided as an arugment', () => {
      vimeoVideo = new VimeoVideo(123, { loop: false })
      expect(vimeoVideo.loop).to.equal(false)
    })
  })

  describe('resolutions', () => {
    for (let i = 0; i < Object.keys(VideoQuality).length; i++) {
      it('sets the resolution to ' + Object.keys(VideoQuality)[i] + ' when provided as an argument', () => {
        vimeoVideo = new VimeoVideo(123, { quality: Object.keys(VideoQuality)[i] })
        expect(vimeoVideo.selectedQuality).to.equal(Object.keys(VideoQuality)[i])
      })
    }
  })

  describe('loadFromVideoId', () => {
    it('throws an error when no video id is provided', () => {
      expect(() => {
        vimeoVideo.loadFromVideoId()
      }).to.throw('[Vimeo] No video ID was specified')
    })
  })

  describe('getJSONFromVideoDescription', () => {
    it('parses and returns a metadata JSON from valid single line object inside video description', () => {
      // Stub the video description as if the API would respond us
      vimeoVideo.data = {
        description: sampleDepthKitDescriptionWithJSONObjectSingleline
      }
      const jsonObject = vimeoVideo.getJSONFromVideoDescription()
      expect(jsonObject.nearClip).to.equal(0.980807781219482)
    })

    it('parses and returns a metadata JSON from valid multi line object inside video description', () => {
      vimeoVideo.data = {
        description: sampleDepthKitDescriptionWithJSONObjectMultiline
      }
      const jsonObject = vimeoVideo.getJSONFromVideoDescription()
      console.log(jsonObject)
      expect(jsonObject.nearClip).to.equal(0.73340767621994)
    })

    it('parses and returns a metadata JSON from valid single line object inside video description that has regular text too', () => {
      // Stub the video description as if the API would respond us
      vimeoVideo.data = {
        description: sampleRegularText + sampleDepthKitDescriptionWithJSONObjectSingleline + sampleRegularText
      }
      const jsonObject = vimeoVideo.getJSONFromVideoDescription()
      expect(jsonObject.nearClip).to.equal(0.980807781219482)
    })

    it('parses and returns a metadata JSON from valid multi line object inside video description that has regular text too', () => {
      vimeoVideo.data = {
        description: sampleRegularText + sampleDepthKitDescriptionWithJSONObjectMultiline + sampleRegularText
      }
      const jsonObject = vimeoVideo.getJSONFromVideoDescription()
      console.log(jsonObject)
      expect(jsonObject.nearClip).to.equal(0.73340767621994)
    })

    it('returns null if a valid JSON object was not found in the description', () => {
      // Stub the video description as if the API would respond us
      vimeoVideo.data = {
        description: 'Hello, we love the web, we also love 3D, we love the 3D web { test: { sample: 5'
      }
      const jsonObject = vimeoVideo.getJSONFromVideoDescription()
      expect(jsonObject).to.equal(null)
    })
  })

  describe('isLoaded', () => {
    it('returns false when vimeoVideo is instaced but there is no Vimeo API response in vimeoVideo.data', () => {
      expect(vimeoVideo.isLoaded()).to.equal(false)
    })

    it('returns false when vimeoVideo is instanced and there is a Vimeo API response in vimeoVideo.data but the VideoElement is not setup', () => {
      vimeoVideo.data = {
        description: 'Hello, we love the web, we also love 3D, we love the 3D web { test: { sample: 5'
      }
      expect(vimeoVideo.isLoaded()).to.equal(false)
    })

    it('returns true when vimeoVideo is instanced and there is a Vimeo API response in vimeoVideo.data but the VideoElement is setup', () => {
      vimeoVideo.data = {
        description: 'Hello, we love the web, we also love 3D, we love the 3D web { test: { sample: 5'
      }
      vimeoVideo.videoElement = document.createElement('video')
      vimeoVideo.videoElement.getElement = () => {
        return vimeoVideo.videoElement
      }
      expect(vimeoVideo.isLoaded()).to.equal(true)
    })
  })

  describe('play', () => {
    it('throws an error if play it triggered but no video source is present in the video element', () => {
      expect(() => {
        vimeoVideo.play()
      }).to.throw('[Vimeo] Failed triggering playback, try initializing the element with a valid video before hitting play')
    })
  })

  describe('pause', () => {
    it('throws an error if pause it triggered but no video source is present in the video element', () => {
      expect(() => {
        vimeoVideo.pause()
      }).to.throw('[Vimeo] Failed triggering playback, try initializing the element with a valid video before hitting pause')
    })
  })

  describe('stop', () => {
    it('throws an error if stop it triggered but no video source is present in the video element', () => {
      expect(() => {
        vimeoVideo.pause()
      }).to.throw('[Vimeo] Failed triggering playback, try initializing the element with a valid video before hitting pause')
    })
  })

  describe('setVolume', () => {
    it('sets muted state true when called with volume 0', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.setVolume(0)
      expect(vimeoVideo.muted).to.equal(true)
    })

    it('sets muted state false when called with non-zero volume', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.setVolume(0.2)
      expect(vimeoVideo.muted).to.equal(false)
    })
  })

  describe('mute', () => {
    it('sets muted state true when called', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.mute()
      expect(vimeoVideo.muted).to.equal(true)
    })
  })

  describe('unmute', () => {
    it('sets muted state false when called', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      vimeoVideo.unmute()
      expect(vimeoVideo.muted).to.equal(false)
    })
  })

  describe('setupVideoElement', () => {
    it('creates a VideoElement', () => {
      vimeoVideo.setupVideoElement()
      expect(vimeoVideo.videoElement).to.not.be.undefined
    })
  })

  describe('setupTexture', () => {
    it('throws an error when trying to call it without <video> src set in the VideoElement', () => {
      expect(() => {
        vimeoVideo = new VimeoVideo(123)
        vimeoVideo.videoElement = new VideoElement(vimeoVideo)
        vimeoVideo.setupTexture()
      }).to.throw('[Vimeo] No video has been loaded yet')
    })
  })

  describe('getWidth', () => {
    it('returns null when no Vimeo API response is present', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      expect(vimeoVideo.getWidth()).to.equal(null)
    })
  })

  describe('getHeight', () => {
    it('returns null when no Vimeo API response is present', () => {
      vimeoVideo = new VimeoVideo(123)
      vimeoVideo.videoElement = new VideoElement(vimeoVideo)
      expect(vimeoVideo.getHeight()).to.equal(null)
    })
  })

  describe('getFileURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getFileURL()).to.equal(undefined)
    })
  })

  describe('getFileURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getFileURL()).to.equal(undefined)
    })
  })

  describe('getAdaptiveURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getAdaptiveURL()).to.equal(undefined)
    })
  })

  describe('getProgressiveURL', () => {
    it('returns undefined when no video URL has been set', () => {
      expect(vimeoVideo.getProgressiveFileURL(VideoQuality.x1080)).to.equal(undefined)
    })
  })

  describe('isLive', () => {
    it('returns false when no video has been loaded', () => {
      expect(vimeoVideo.isLive()).to.equal(false)
    })

    it('returns true when API response suggests that the video is live', () => {
      vimeoVideo.data = {
        live: {
          status: 'streaming'
        }
      }
      expect(vimeoVideo.isLive()).to.equal(true)
    })
  })

  describe('isAdaptivePlayback', () => {
    it('returns true when selected adaptive quality', () => {
      expect(vimeoVideo.isAdaptivePlayback()).to.equal(true)
    })

    it('returns false when not selected adaptive quality', () => {
      vimeoVideo.selectedQuality = VideoQuality.x1080
      expect(vimeoVideo.isAdaptivePlayback()).to.equal(false)
    })
  })

  describe('isDashPlayback', () => {
    it('returns true when selected adaptive quality and device is not iOS', () => {
      expect(vimeoVideo.isDashPlayback()).to.equal(true)
    })

    it('returns false when not selected adaptive quality', () => {
      vimeoVideo.selectedQuality = VideoQuality.x1080
      expect(vimeoVideo.isDashPlayback()).to.equal(false)
    })
  })
})
