/* global describe, it, expect */
import VideoQuality from '../src/components/video-quality'

describe('VideoQuality', () => {
  it('has all resolutions', () => {
    expect(VideoQuality.auto).toEqual('auto')
    expect(VideoQuality.adaptive).toEqual('adaptive')
    expect(VideoQuality.x4K).toEqual(2160)
    expect(VideoQuality.x2K).toEqual(1440)
    expect(VideoQuality.x1080).toEqual(1080)
    expect(VideoQuality.x720).toEqual(720)
    expect(VideoQuality.x540).toEqual(540)
    expect(VideoQuality.x360).toEqual(360)
  })
})
