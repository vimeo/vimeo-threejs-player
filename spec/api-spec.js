/* global describe, it, expect */
import API from '../src/components/api'

var expect = require('chai').expect // eslint-disable-line

describe('API', () => {
  it('returns correct path for video request', () => {
    expect(API.path('/videos/284443663')).to.equal(
      '/vimeo/api?path=/videos/284443663?fields=uri,play,width,height,live,description,title'
    )
  })

  it('rejects promise when server is not running', () => {
    API.getVideo('284443663').then(result => {
    }).catch(error => {
      expect(error.code).to.equal('404')
    })
  })
})
