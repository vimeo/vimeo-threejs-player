const ApiPath = '/vimeo/api'

export default class API {
  static path(endpoint) {
    return `${ApiPath}?path=${endpoint}?fields=uri,play,width,height,live,description,title`
  }

  static getVideo (videoId) {
    return new Promise((resolve, reject) => {
      fetch(API.path(`/videos/${videoId}`)).then(res => {
        API.sendResponse(res, resolve, reject)
      })
    })
  }

  static getAlbumVideos (albumId) {
    return new Promise((resolve, reject) => {
      fetch(API.path(`/albums/${albumId}/videos`)).then(res => {
        API.sendResponse(res, resolve, reject)
      })
    })
  }

  static sendResponse (res, resolve, reject) {
    res.json().then(json => {
      if (res.status === 200) {
        resolve(json)
      } else {
        reject(json)
      }
    })
  }
}
