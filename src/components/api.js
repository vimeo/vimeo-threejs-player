const ApiPath = '/vimeo/api'

export default class API {
  static getVideo (videoId) {
    return new Promise((resolve, reject) => {
      fetch(`${ApiPath}?path=/videos/${videoId}?fields=uri,play,width,height,live,description,title`).then(res => {
        API.sendResponse(res, resolve, reject)
      })
    })
  }

  static getAlbumVideos (albumId) {
    return new Promise((resolve, reject) => {
      fetch(`${ApiPath}?path=/albums/${albumId}/videos?fields=uri,play,width,height,live,description,title`).then(res => {
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
