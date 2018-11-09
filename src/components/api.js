export default class API {
  constructor () { }

  static getVideo (video_id) {
    return new Promise((resolve, reject) => {
      fetch(`/vimeo/api?path=/videos/${video_id}`).then(res => {
        API.sendResponse(res, resolve, reject);
      })
    })
  }

  static getChannelVideos (channel_id) {
    return new Promise((resolve, reject) => {
      fetch(`/vimeo/api?path=/videos/${id}`).then(res => {
        API.sendResponse(res, resolve, reject);
      })
    })
  }

  static getAlbumVideos (album_id) {
    return new Promise((resolve, reject) => {
      fetch(`/vimeo/api?path=/videos/${id}`).then(res => {
        API.sendResponse(res, resolve, reject);
      })
    })
  }

  static getFolderVideos (folder_id) {
    return new Promise((resolve, reject) => {
      fetch(`/vimeo/api?path=/videos/${id}`).then(res => {
        API.sendResponse(res, resolve, reject);
      })
    })
  }

  static sendResponse(res, resolve, reject) {
    res.json().then(json => {
      if (res.status === 200) {
        resolve(json);
      }
      else {
        reject(json);
      }
    })
  }
}