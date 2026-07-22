"use client"

import { useEffect, useState } from "react"
import {
  MEDIA_FAVORITES_CHANGED_EVENT,
  buildMediaShareData,
  getMediaFavoritesStorage,
  readMediaFavorites,
  toggleMediaFavorite
} from "@/lib/media-favorites"
import { shareMediaRecord } from "@/lib/media-share"

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
    const storage = getMediaFavoritesStorage(window)
    setIsFavorite(storage ? readMediaFavorites(storage, knownSlugs).includes(slug) : false)
  }, [knownSlugs, slug])

  function handleFavorite() {
    const storage = getMediaFavoritesStorage(window)

    if (!storage) {
      setFeedback("收藏失败，请检查浏览器存储 / Unable to save favorite.")
      return
    }

    const result = toggleMediaFavorite(
      storage,
      slug,
      knownSlugs
    )

    if (!result.persisted) {
      setFeedback("收藏失败，请检查浏览器存储 / Unable to save favorite.")
      return
    }

    setIsFavorite(result.isFavorite)
    setFeedback(result.isFavorite ? "已收藏 / Saved" : "已取消收藏 / Removed")
    window.dispatchEvent(
      new CustomEvent(MEDIA_FAVORITES_CHANGED_EVENT, {
        detail: { favorites: result.favorites }
      })
    )
  }

  async function handleShare() {
    setFeedback("")
    const result = await shareMediaRecord(navigator, buildMediaShareData(titleZh, titleEn, window.location.href))

    if (result === "shared") {
      setFeedback("已分享 / Shared")
      return
    }

    if (result === "copied") {
      setFeedback("链接已复制 / Link copied")
      return
    }

    if (result === "aborted") {
      return
    }

    setFeedback("分享失败，请复制地址栏链接 / Unable to share. Copy the address-bar link.")
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
