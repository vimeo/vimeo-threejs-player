/* global describe, it, expect */
import API from '../src/components/api'

describe('API', () => {
  it('returns correct path for video request', () => {
    expect(API.path('/videos/284443663')).toEqual(
      '/vimeo/api?path=/videos/284443663?fields=uri,play,width,height,live,description,title'
    )
  })

  it('rejects promise when server is not running', () => {
    API.getVideo('284443663').then(result => {
    }).catch(error => {
      expect(error.code).toEqual('404')
    })
  })
})
