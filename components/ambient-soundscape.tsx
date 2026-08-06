"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type ReactNode
} from "react"
import { resolveMediaUrl } from "@/lib/media-url"
import {
  AMBIENT_AUDIO_ENABLED_STORAGE_KEY,
  AMBIENT_AUDIO_PATH,
  AMBIENT_AUDIO_VOLUME_STORAGE_KEY,
  AMBIENT_VIDEO_PLAY_EVENT,
  AMBIENT_VIDEO_STOP_EVENT,
  DEFAULT_AMBIENT_VOLUME,
  MAX_AMBIENT_VOLUME,
  clampAmbientVolume,
  shouldResumeAmbientAfterVideo
} from "@/lib/ambient-audio"

type AmbientSoundscapeContextValue = {
  enabled: boolean
  pausedForVideo: boolean
  resumeHint: boolean
  volume: number
  setSoundscapeEnabled: (enabled: boolean) => Promise<void>
  setSoundscapeVolume: (volume: number) => void
}

const AmbientSoundscapeContext = createContext<AmbientSoundscapeContextValue | null>(null)

function readStoredBoolean(key: string): boolean | null {
  try {
    const value = window.localStorage.getItem(key)
    return value === null ? null : value === "true"
  } catch {
    return null
  }
}

function readStoredVolume(): number | null {
  try {
    const value = window.localStorage.getItem(AMBIENT_AUDIO_VOLUME_STORAGE_KEY)
    return value === null ? null : clampAmbientVolume(Number(value))
  } catch {
    return null
  }
}

function saveStoredValue(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // Storage may be unavailable in private or restricted browser contexts.
  }
}

export function AmbientSoundscapeProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const enabledRef = useRef(false)
  const pausedForVideoRef = useRef(false)
  const videoIsPlayingRef = useRef(false)
  const [enabled, setEnabled] = useState(false)
  const [pausedForVideo, setPausedForVideo] = useState(false)
  const [resumeHint, setResumeHint] = useState(false)
  const [volume, setVolume] = useState(DEFAULT_AMBIENT_VOLUME)

  const playAudio = useCallback(async (): Promise<boolean> => {
    const audio = audioRef.current
    if (!audio) return false

    audio.volume = volume
    try {
      await audio.play()
      return true
    } catch {
      return false
    }
  }, [volume])

  useEffect(() => {
    const storedEnabled = readStoredBoolean(AMBIENT_AUDIO_ENABLED_STORAGE_KEY)
    const storedVolume = readStoredVolume()

    if (storedEnabled) {
      setResumeHint(storedEnabled)
    }

    if (storedVolume !== null) {
      setVolume(storedVolume)
    }
  }, [])

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const setSoundscapeEnabled = useCallback(async (nextEnabled: boolean) => {
    if (!nextEnabled) {
      enabledRef.current = false
      setEnabled(false)
      setResumeHint(false)
      saveStoredValue(AMBIENT_AUDIO_ENABLED_STORAGE_KEY, "false")
      pausedForVideoRef.current = false
      setPausedForVideo(false)
      audioRef.current?.pause()
      return
    }

    if (videoIsPlayingRef.current) {
      setResumeHint(true)
      saveStoredValue(AMBIENT_AUDIO_ENABLED_STORAGE_KEY, "true")
      return
    }

    const played = await playAudio()

    if (!played) {
      enabledRef.current = false
      setEnabled(false)
      pausedForVideoRef.current = false
      setPausedForVideo(false)
      setResumeHint(true)
      saveStoredValue(AMBIENT_AUDIO_ENABLED_STORAGE_KEY, "true")
      return
    }

    enabledRef.current = true
    setEnabled(true)
    setResumeHint(false)
    saveStoredValue(AMBIENT_AUDIO_ENABLED_STORAGE_KEY, "true")
  }, [playAudio])

  const setSoundscapeVolume = useCallback((nextVolume: number) => {
    const clampedVolume = clampAmbientVolume(nextVolume)
    setVolume(clampedVolume)
    saveStoredValue(AMBIENT_AUDIO_VOLUME_STORAGE_KEY, String(clampedVolume))
  }, [])

  useEffect(() => {
    const pauseForVideo = () => {
      videoIsPlayingRef.current = true

      if (!enabledRef.current) {
        pausedForVideoRef.current = false
        setPausedForVideo(false)
        return
      }

      audioRef.current?.pause()
      pausedForVideoRef.current = true
      setPausedForVideo(true)
    }

    const resumeAfterVideo = () => {
      videoIsPlayingRef.current = false
      const shouldResume = shouldResumeAmbientAfterVideo(
        enabledRef.current,
        pausedForVideoRef.current
      )

      pausedForVideoRef.current = false
      setPausedForVideo(false)

      if (shouldResume) {
        void playAudio().then((played) => {
          if (!played) {
            enabledRef.current = false
            setEnabled(false)
            setResumeHint(true)
          }
        })
      }
    }

    window.addEventListener(AMBIENT_VIDEO_PLAY_EVENT, pauseForVideo)
    window.addEventListener(AMBIENT_VIDEO_STOP_EVENT, resumeAfterVideo)

    return () => {
      window.removeEventListener(AMBIENT_VIDEO_PLAY_EVENT, pauseForVideo)
      window.removeEventListener(AMBIENT_VIDEO_STOP_EVENT, resumeAfterVideo)
    }
  }, [playAudio])

  const value = useMemo<AmbientSoundscapeContextValue>(() => ({
    enabled,
    pausedForVideo,
    resumeHint,
    volume,
    setSoundscapeEnabled,
    setSoundscapeVolume
  }), [enabled, pausedForVideo, resumeHint, setSoundscapeEnabled, setSoundscapeVolume, volume])

  return (
    <AmbientSoundscapeContext.Provider value={value}>
      <audio
        ref={audioRef}
        loop
        preload="none"
        src={resolveMediaUrl(AMBIENT_AUDIO_PATH)}
        aria-hidden="true"
      />
      {children}
    </AmbientSoundscapeContext.Provider>
  )
}

export function AmbientSoundscapeControl() {
  const soundscape = useContext(AmbientSoundscapeContext)
  const [expanded, setExpanded] = useState(false)

  if (!soundscape) return null

  const status = soundscape.pausedForVideo
    ? "音景暂歇"
    : soundscape.resumeHint ? "继续音景" : `音景 ${soundscape.enabled ? "ON" : "OFF"}`

  const updateVolume = (event: ChangeEvent<HTMLInputElement>) => {
    soundscape.setSoundscapeVolume(Number(event.target.value))
  }

  return (
    <div className={`ambient-soundscape ${expanded ? "is-expanded" : ""}`}>
      <button
        className="ambient-soundscape-toggle"
        type="button"
        aria-label={soundscape.enabled ? "关闭环境音景" : soundscape.resumeHint ? "继续环境音景" : "开启环境音景"}
        aria-pressed={soundscape.enabled}
        aria-expanded={expanded}
        aria-controls="ambient-soundscape-volume"
        onClick={() => {
          void soundscape.setSoundscapeEnabled(!soundscape.enabled)
          setExpanded(true)
        }}
      >
        <span className="ambient-soundscape-note" aria-hidden="true">♪</span>
        <span className="ambient-soundscape-status">{status}</span>
      </button>
      <div className="ambient-soundscape-volume" id="ambient-soundscape-volume">
        <label htmlFor="ambient-soundscape-volume-range">音量 Volume</label>
        <input
          id="ambient-soundscape-volume-range"
          type="range"
          min="0"
          max={MAX_AMBIENT_VOLUME}
          step="0.01"
          value={soundscape.volume}
          onChange={updateVolume}
          aria-label="环境音景音量"
        />
        <output>{Math.round(soundscape.volume * 100)}%</output>
      </div>
    </div>
  )
}
