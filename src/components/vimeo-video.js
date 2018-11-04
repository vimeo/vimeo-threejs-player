class VimeoVideo {
  constructor (quality = 'auto') {
    this.selectedQuality = quality

    // Props to be parsed from the API response
    this.type
    this.fps
    this.props = {}
    this.url
    this.files
  }

  load (videoID) {
    if (!vimeoVideoID) {
      console.warn('[Vimeo] No video ID was specified')
      return
    }
  }

  requestVideo (vimeoVideoID) {
    // Safeguard the request
    if (!vimeoVideoID) {
      console.warn('[Client] Can not request a video without providing a video ID')
      return
    }

    // The function returns a promise based on the request made inside
    return new Promise((resolve, reject) => {
      // Use the fetch API (returns a promise) and assemble the complete request path - e.g http://myawesomeapp.com/video/vimeo_video_id
      fetch(`/video/${vimeoVideoID}`).then(response => {
        // Unpack the response and get the object back using .json() method from the fetch API
        response.json().then(obj => {
          if (response.status === 200) {
            // Save the file list of each request to a member object of the instance
            if (obj.play == null) {
              reject('[Vimeo] No video file found')
            }

            this.files = obj.play

            // If a JSON was provided in the description then it's a DepthKit take (saved into this.props)
            if (Util.isJSON(obj)) {
              this.props = JSON.parse(obj.description)
              this.type = DepthType.DepthKit
            } else {
              this.props = null
              this.type = DepthType.RealSense
            }
            if (this.selectedQuality === 'auto') {
              if (Util.isiOS()) {
                if (obj.live.status === 'streaming') {
                  this.selectedQuality = 'hls' // Unfortunetly this will still result in an unsecure opreation on iOS so we can only play progressive files for now
                } else {
                  this.selectedQuality = 'progressive'
                  // Iterate over the files and look for a 720p version in progressive format
                  for (let file in this.files.progressive) {
                    if (this.files.progressive[file].width > 600 && this.files.progressive[file].width < 1000) {
                      this.selectedQuality = this.files.progressive[file].width
                    }
                  }
                }
              } else {
                this.selectedQuality = 'dash'
              }
              // TODO: if mobile safari, play hls
              // TODO: detect if stream even has dash/hls and fall back to highest progressive
              console.log('[Vimeo] Selected quality: ' + this.selectedQuality)
            }

            if (this.selectedQuality === 'hls') {
              if (this.files.hls.link) {
                this.url = this.files.hls.link
              } else {
                console.warn('[Vimeo] Requested an HLS stream but none was found')
              }
            } else if (this.selectedQuality === 'dash') {
              if (this.files.dash && this.files.dash.link) {
                this.url = this.files.dash.link
              } else {
                console.warn('[Vimeo] Requested a DASH stream but none was found')
              }
            } else {
              /*
               * Progressive currently only supports DepthKit
               * Future developments will support more native depth playback formats
               * It is recomended to use adaptive format
               */
              if (this.type === DepthType.DepthKit) {
                // Iterate over the file list and find the one that matchs our quality setting (e.g 'hd')
                for (let file of this.files.progressive) {
                  if (file.width === this.selectedQuality) {
                    // Save the link
                    this.url = file.link

                    // Save the framerate
                    this.fps = file.fps

                    // If DepthKit in different resolutions then the ones specified in the JSON file
                    this.props.textureWidth = file.width
                    this.props.textureHeight = file.height
                  }
                }
              }
            }

            // Resolve the promise and return the url for the video and the props object
            resolve({
              url: this.url,
              selectedQuality: this.selectedQuality,
              props: this.props,
              type: this.type,
              fps: this.fps
            })
          } else {
            reject(response.status)
          }
        })
      })
    })
  }
}

export default API
