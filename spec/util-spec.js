/* global describe, it, expect */
import Util from '../src/components/util'

var expect = require('chai').expect // eslint-disable-line

describe('Util', () => {
  it('returns true for checkWebGL when window.WebGLRenderingContext is not null', () => {
    expect(Util.checkWebGL()).to.equal(true)
  })

  it('returns false for isiOS when platform is not iOS', () => {
    expect(Util.isiOS()).to.equal(false)
  })

  it('returns false for isMobile when device is not a mobile device', () => {
    expect(Util.isMobile()).to.equal(false)
  })
})
