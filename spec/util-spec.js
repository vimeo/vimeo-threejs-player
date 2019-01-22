/* global describe, it, expect */
import Util from '../src/components/util'

describe('Util', () => {
  it('returns true for checkWebGL when window.WebGLRenderingContext is not null', () => {
    expect(Util.checkWebGL()).toBe(true)
  })

  it('returns false for isiOS when platform is not iOS', () => {
    expect(Util.isiOS()).toBe(false)
  })

  it('returns false for isMobile when device is not a mobile device', () => {
    expect(Util.isMobile()).toBe(false)
  })
})
