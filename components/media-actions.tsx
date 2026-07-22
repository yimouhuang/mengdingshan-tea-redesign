"use client"

import { useEffect, useState } from "react"
import {
  MEDIA_FAVORITES_CHANGED_EVENT,
  buildMediaShareData,
  readMediaFavorites,
  toggleMediaFavorite
} from "@/lib/media-favorites"

type MediaActionsProps = {
  slug: string
  titleZh: string
  titleEn: string
  knownSlugs: readonly string[]
}

export function MediaActions({
  slug,
  titleZh,
  titleEn,
  knownSlugs
}: MediaActionsProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [feedback, setFeedback] = useState("")

  useEffect(() => {
    setIsFavorite(readMediaFavorites(window.localStorage, knownSlugs).includes(slug))
  }, [knownSlugs, slug])

  function handleFavorite() {
    const { favorites, isFavorite: nextIsFavorite } = toggleMediaFavorite(
      window.localStorage,
      slug,
      knownSlugs
    )

    setIsFavorite(nextIsFavorite)
    setFeedback(nextIsFavorite ? "已收藏 / Saved" : "已取消收藏 / Removed")
    window.dispatchEvent(
      new CustomEvent(MEDIA_FAVORITES_CHANGED_EVENT, {
        detail: { favorites }
      })
    )
  }

  async function handleShare() {
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(buildMediaShareData(titleZh, titleEn, window.location.href))
        setFeedback("已分享 / Shared")
        return
      }

      await navigator.clipboard.writeText(window.location.href)
      setFeedback("链接已复制 / Link copied")
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return
      }

      setFeedback("分享失败，请复制地址栏链接 / Unable to share. Copy the address-bar link.")
    }
  }

  return (
    <>
      <div className="mt-6 grid grid-cols-2 gap-3">
        <button
          type="button"
          aria-pressed={isFavorite}
          onClick={handleFavorite}
          className="border border-white/25 py-3"
        >
          {isFavorite ? "★ 已收藏 / Saved" : "☆ 加入收藏"}
        </button>
        <button
          type="button"
          onClick={handleShare}
          className="border border-white/25 py-3"
        >
          ↗ 分享 Share
        </button>
      </div>
      <p aria-live="polite" className="mt-2 min-h-5 text-sm text-[#eee9de]/62">
        {feedback}
      </p>
    </>
  )
}
