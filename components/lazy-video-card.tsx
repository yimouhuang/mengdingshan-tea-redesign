"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import type { TeaMedia } from "@/lib/media"

type LazyVideoCardProps = {
  item: TeaMedia
  priority?: boolean
}

export function LazyVideoCard({ item, priority = false }: LazyVideoCardProps) {
  const rootRef = useRef<HTMLAnchorElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const shouldLoadVideo = Boolean(item.video && (isVisible || isHovered))

  useEffect(() => {
    const node = rootRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin: "180px" }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const video = videoRef.current
    if (!video || !shouldLoadVideo) return

    if (isHovered) {
      video.play().catch(() => undefined)
    } else {
      video.pause()
      video.currentTime = 0
    }
  }, [isHovered, shouldLoadVideo])

  return (
    <Link
      ref={rootRef}
      href={`/media/${item.slug}`}
      className="group relative block aspect-[0.82] overflow-hidden rounded-md border border-white/20 bg-[#10110f] transition duration-300 hover:-translate-y-1 hover:border-[#d3b35f]/70"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <Image
        src={item.poster}
        alt={item.titleZh}
        fill
        priority={priority}
        sizes="(min-width: 1100px) 28vw, (min-width: 768px) 45vw, 100vw"
        className="origin-top scale-[1.18] object-cover object-top transition duration-500 group-hover:scale-[1.24]"
      />
      {shouldLoadVideo && item.video ? (
        <video
          ref={videoRef}
          muted
          loop
          playsInline
          preload="metadata"
          poster={item.poster}
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100"
        >
          <source src={item.video} type="video/mp4" />
        </video>
      ) : null}
      <div className="card-vignette" />
      <div className="absolute bottom-0 left-0 right-0 bg-black/82 p-4 backdrop-blur-[2px] md:p-5">
        <h3 className="font-display text-2xl font-semibold leading-tight text-[#f4f1e8]">{item.titleZh}</h3>
        <p className="mt-1 text-sm text-[#f4f1e8]/78">{item.titleEn}</p>
        <span className="mt-4 inline-flex rounded bg-[#d3b35f] px-3 py-1 text-xs font-medium text-black">
          {item.categoryEn}
        </span>
      </div>
    </Link>
  )
}
