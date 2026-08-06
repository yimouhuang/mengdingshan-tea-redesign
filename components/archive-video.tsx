"use client"

import { useEffect } from "react"
import {
  AMBIENT_VIDEO_PLAY_EVENT,
  AMBIENT_VIDEO_STOP_EVENT
} from "@/lib/ambient-audio"

type ArchiveVideoProps = {
  source: string
  poster: string
  className: string
}

function dispatchAmbientVideoEvent(eventName: string) {
  window.dispatchEvent(new Event(eventName))
}

export function ArchiveVideo({ source, poster, className }: ArchiveVideoProps) {
  useEffect(() => {
    return () => dispatchAmbientVideoEvent(AMBIENT_VIDEO_STOP_EVENT)
  }, [])

  return (
    <video
      controls
      playsInline
      preload="metadata"
      poster={poster}
      className={className}
      onPlay={() => dispatchAmbientVideoEvent(AMBIENT_VIDEO_PLAY_EVENT)}
      onPause={() => dispatchAmbientVideoEvent(AMBIENT_VIDEO_STOP_EVENT)}
      onEnded={() => dispatchAmbientVideoEvent(AMBIENT_VIDEO_STOP_EVENT)}
    >
      <source src={source} type="video/mp4" />
      你的浏览器不支持视频播放。
    </video>
  )
}
