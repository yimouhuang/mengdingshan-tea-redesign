export const AMBIENT_AUDIO_PATH = "/media/audio/mengdingshan-atmosphere.mp3"
export const DEFAULT_AMBIENT_VOLUME = 0.12
export const MAX_AMBIENT_VOLUME = 0.25
export const AMBIENT_AUDIO_ENABLED_STORAGE_KEY = "mengding-ambient-audio-enabled"
export const AMBIENT_AUDIO_VOLUME_STORAGE_KEY = "mengding-ambient-audio-volume"
export const AMBIENT_VIDEO_PLAY_EVENT = "archive:ambient-video-play"
export const AMBIENT_VIDEO_STOP_EVENT = "archive:ambient-video-stop"

export function clampAmbientVolume(value: number): number {
  if (!Number.isFinite(value)) {
    return DEFAULT_AMBIENT_VOLUME
  }

  return Math.min(MAX_AMBIENT_VOLUME, Math.max(0, value))
}

export function shouldResumeAmbientAfterVideo(
  enabled: boolean,
  pausedForVideo: boolean
): boolean {
  return enabled && pausedForVideo
}
