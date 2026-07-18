"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import {
  EXPLORE_MAP_STYLE_URL,
  MENGDING_MAP_CENTER,
  MENGDING_MAP_ZOOM
} from "@/lib/explore-map"

export function ExploreMap() {
  const mapElementRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<{ remove: () => void; resize: () => void } | null>(null)
  const [hasMapError, setHasMapError] = useState(false)

  useEffect(() => {
    const mapElement = mapElementRef.current
    if (!mapElement) return

    if (typeof IntersectionObserver === "undefined") {
      setHasMapError(true)
      return
    }

    let isDisposed = false
    let hasEnteredViewport = false
    let observer: IntersectionObserver | null = null
    let resizeObserver: ResizeObserver | null = null
    let resizeFrame: number | null = null

    const activateMap = () => {
      if (hasEnteredViewport) return
      hasEnteredViewport = true
      observer?.disconnect()

      void (async () => {
        try {
          const maplibregl = await import("maplibre-gl")
          if (isDisposed) return

          const map = new maplibregl.Map({
            container: mapElement,
            style: EXPLORE_MAP_STYLE_URL,
            center: MENGDING_MAP_CENTER,
            zoom: MENGDING_MAP_ZOOM
          })

          mapRef.current = map
          map.addControl(new maplibregl.NavigationControl(), "top-right")
          map.on("error", () => {
            if (!isDisposed) setHasMapError(true)
          })

          const syncMapSize = () => {
            if (!isDisposed) map.resize()
          }

          map.once("load", syncMapSize)
          resizeObserver = new ResizeObserver(syncMapSize)
          resizeObserver.observe(mapElement)
          resizeFrame = window.requestAnimationFrame(syncMapSize)
        } catch {
          if (!isDisposed) setHasMapError(true)
        }
      })()
    }

    observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) activateMap()
    })

    observer.observe(mapElement)

    const { bottom, top } = mapElement.getBoundingClientRect()
    if (top < window.innerHeight && bottom > 0) activateMap()

    return () => {
      isDisposed = true
      observer.disconnect()
      resizeObserver?.disconnect()
      if (resizeFrame !== null) window.cancelAnimationFrame(resizeFrame)
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [])

  return (
    <section className="explore-map-surface relative min-h-[360px] overflow-hidden rounded-[18px] border border-white/15 bg-[var(--panel)] md:min-h-[520px]">
      <div
        ref={mapElementRef}
        aria-describedby="explore-map-interaction-hint"
        aria-label="Interactive map of the Mengding Mountain area"
        className="absolute inset-0 explore-map-canvas"
        role="region"
      />
      <p
        className="pointer-events-none absolute left-3 top-3 z-10 max-w-[calc(100%-5rem)] rounded-full border border-[var(--line)] bg-[var(--panel)] px-3 py-2 text-[11px] leading-4 text-[var(--foreground)] shadow-sm md:bottom-3 md:top-auto md:max-w-[calc(100%-1.5rem)] md:text-xs md:leading-5"
        id="explore-map-interaction-hint"
      >
        <span lang="zh-CN">拖动或缩放以浏览蒙顶山区域。</span>{" "}
        <span>Drag or zoom to explore the Mengding Mountain area.</span>
      </p>
      {hasMapError ? (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 bg-[var(--background)] px-6 text-center text-[var(--foreground)]" role="alert">
          <p>Map service is temporarily unavailable.</p>
          <Link className="border border-[#d6b45a]/55 bg-transparent px-4 py-2 text-sm text-[#f3d77d] transition hover:bg-[#d6b45a]/10 active:translate-y-px" href="/library">
            Browse the library
          </Link>
        </div>
      ) : null}
      <style jsx global>{`
        .explore-map-surface > .explore-map-canvas.maplibregl-map {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
        }

        .explore-map-surface .maplibregl-canvas {
          filter: sepia(0.24) saturate(0.72) brightness(0.48) contrast(1.12);
        }

        .explore-map-surface .maplibregl-ctrl-top-right,
        .explore-map-surface .maplibregl-ctrl-bottom-right {
          z-index: 20;
        }

        .explore-map-surface .maplibregl-ctrl-group {
          background: var(--background);
          border: 1px solid var(--accent);
          border-radius: 0.75rem;
          box-shadow: 0 0 0 1px var(--line);
        }

        .explore-map-surface .maplibregl-ctrl-group button + button {
          border-top-color: var(--line);
        }

        .explore-map-surface .maplibregl-ctrl-group button:hover,
        .explore-map-surface .maplibregl-ctrl-group button:active {
          background: var(--tea-green);
        }

        .explore-map-surface .maplibregl-ctrl-group button:focus-visible {
          box-shadow: 0 0 0 2px var(--accent-strong);
        }

        .explore-map-surface .maplibregl-ctrl-icon {
          filter: sepia(1) saturate(0.8) brightness(1.8);
        }

        .explore-map-surface .maplibregl-ctrl-attrib,
        .explore-map-surface .maplibregl-ctrl-attrib-button {
          background-color: var(--background);
          color: var(--accent-strong);
        }

        .explore-map-surface .maplibregl-ctrl-attrib a {
          color: var(--accent-strong);
        }
      `}</style>
    </section>
  )
}
