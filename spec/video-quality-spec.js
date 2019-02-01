/* global describe, it, expect */
import VideoQuality from '../src/components/video-quality'

var expect = require('chai').expect // eslint-disable-line

describe('VideoQuality', () => {
  it('has all resolutions', () => {
    expect(VideoQuality.auto).to.equal('auto')
    expect(VideoQuality.adaptive).to.equal('adaptive')
    expect(VideoQuality.x4K).to.equal(2160)
    expect(VideoQuality.x2K).to.equal(1440)
    expect(VideoQuality.x1080).to.equal(1080)
    expect(VideoQuality.x720).to.equal(720)
    expect(VideoQuality.x540).to.equal(540)
    expect(VideoQuality.x360).to.equal(360)
  })
})
