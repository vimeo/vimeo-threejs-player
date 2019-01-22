/**
 * An enum that represents the video quality coming from Vimeo,
 * auto will default to adaptive an fallback to highest progressive file
 */
const VideoQuality = {
  auto: 'auto',
  adaptive: 'adaptive',
  x4K: 2160,
  x2K: 1440,
  x1080: 1080,
  x720: 720,
  x540: 540,
  x360: 360
}

export default VideoQuality
