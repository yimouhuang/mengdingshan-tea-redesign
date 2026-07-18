"use client"

import { useEffect, useRef } from "react"

const MAX_PARTICLES = 28
const MIN_DISTANCE = 18
const MIN_INTERVAL = 24
const STAR_SIZES = [4, 5, 6]
const STAR_OPACITIES = [0.62, 0.78, 0.9]

export function StarTrail() {
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)")
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")
    let stopTrail = () => {}

    const syncTrail = () => {
      stopTrail()

      if (!finePointer.matches || reducedMotion.matches) {
        return
      }

      const layer = layerRef.current
      if (!layer) {
        return
      }

      const particles = new Set<HTMLSpanElement>()
      let lastX = -MIN_DISTANCE
      let lastY = -MIN_DISTANCE
      let lastTimestamp = 0

      const removeParticle = (particle: HTMLSpanElement) => {
        particles.delete(particle)
        particle.remove()
      }

      const createParticle = (event: MouseEvent) => {
        const distance = Math.hypot(event.clientX - lastX, event.clientY - lastY)

        if (distance < MIN_DISTANCE && event.timeStamp - lastTimestamp < MIN_INTERVAL) {
          return
        }

        lastX = event.clientX
        lastY = event.clientY
        lastTimestamp = event.timeStamp

        const particle = document.createElement("span")
        const intensity = distance > 42 ? 2 : distance > 28 ? 1 : 0
        const size = STAR_SIZES[intensity]
        const opacity = STAR_OPACITIES[intensity]

        particle.className = "archive-star-trail-particle"
        particle.style.left = `${event.clientX}px`
        particle.style.top = `${event.clientY}px`
        particle.style.setProperty("--star-size", `${size}px`)
        particle.style.setProperty("--star-opacity", opacity.toString())
        particle.style.setProperty("--star-mid-opacity", (opacity * 0.48).toString())
        particle.addEventListener("animationend", () => removeParticle(particle), {
          once: true
        })

        if (particles.size >= MAX_PARTICLES) {
          const oldest = particles.values().next().value as HTMLSpanElement | undefined
          if (oldest) {
            removeParticle(oldest)
          }
        }

        particles.add(particle)
        layer.appendChild(particle)
      }

      window.addEventListener("pointermove", createParticle, { passive: true })
      window.addEventListener("mousemove", createParticle, { passive: true })
      stopTrail = () => {
        window.removeEventListener("pointermove", createParticle)
        window.removeEventListener("mousemove", createParticle)
        particles.forEach((particle) => particle.remove())
        particles.clear()
      }
    }

    syncTrail()
    finePointer.addEventListener("change", syncTrail)
    reducedMotion.addEventListener("change", syncTrail)

    return () => {
      finePointer.removeEventListener("change", syncTrail)
      reducedMotion.removeEventListener("change", syncTrail)
      stopTrail()
    }
  }, [])

  return <div ref={layerRef} className="archive-star-trail pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden="true" />
}
