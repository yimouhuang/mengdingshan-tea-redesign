"use client"

import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import {
  filterMedia,
  getMediaCategories,
  getMediaKindLabel,
  mediaItems,
  type ArchiveFilter,
  type MediaKind
} from "@/lib/media"

type LibraryKind = MediaKind | "all"
type LibraryView = "grid" | "list"

const libraryKindFilters: ReadonlyArray<{ value: LibraryKind; label: string }> = [
  { value: "all", label: "全部 / All" },
  { value: "photo", label: getMediaKindLabel("photo") },
  { value: "video", label: getMediaKindLabel("video") },
  { value: "poster", label: getMediaKindLabel("poster") }
]

export function MediaLibraryBrowser() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("")
  const [kind, setKind] = useState<LibraryKind>("all")
  const [sort, setSort] = useState<NonNullable<ArchiveFilter["sort"]>>("latest")
  const [view, setView] = useState<LibraryView>("grid")

  const categories = useMemo(() => getMediaCategories(mediaItems), [])
  const results = useMemo(
    () =>
      filterMedia(mediaItems, {
        query,
        category: category || undefined,
        kind: kind === "all" ? undefined : kind,
        sort
      }),
    [category, kind, query, sort]
  )
  const isDefault = !query && !category && kind === "all" && sort === "latest" && view === "grid"

  function resetFilters() {
    setQuery("")
    setCategory("")
    setKind("all")
    setSort("latest")
    setView("grid")
  }

  return (
    <section className="archive-container grid gap-7 lg:grid-cols-[220px_minmax(0,1fr)]">
      <div className="order-1 min-w-0 lg:order-2">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs tracking-[.2em] text-[#d6b45a]">MEDIA LIBRARY</p>
            <h1 className="mt-2 font-display text-4xl">影像库 <span className="text-2xl text-[#eee9de]/75">/ Media Library</span></h1>
            <p className="mt-3 text-sm text-[#eee9de]/62">浏览蒙顶山茶的图片与视频档案 / Browse the image and video archive.</p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center border border-white/20 px-4 py-2 text-sm transition hover:border-[#d6b45a]/70 hover:text-[#f3d77d] active:translate-y-px"
          >
            返回首页 / Home
          </Link>
        </div>

        <div className="mt-7 grid gap-3 rounded-xl border border-white/12 bg-white/[.035] p-4 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="min-w-0">
            <label htmlFor="library-search" className="sr-only">搜索档案 / Search archive</label>
            <input
              id="library-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索照片、视频、茶园或工艺 / Search archive"
              className="min-h-11 w-full border-b border-white/25 bg-transparent px-2 text-sm text-[#f3f0e5] placeholder:text-[#eee9de]/48 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f2d37a]"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="媒体类型筛选 / Media type filter">
            {libraryKindFilters.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                aria-pressed={kind === value}
                onClick={() => setKind(value)}
                className={`min-h-11 border px-3 py-2 text-sm transition active:translate-y-px ${kind === value ? "border-[#d6b45a]/70 bg-[#d6b45a]/10 text-[#f3d77d]" : "border-white/15 text-[#eee9de]/76 hover:border-white/35 hover:text-[#f3f0e5]"}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-y border-white/10 py-3">
          <p aria-live="polite" className="text-sm text-[#eee9de]/68">
            共 {results.length} 条档案 / {results.length} records
          </p>
          <div className="grid min-w-0 w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:flex-wrap sm:items-center">
            <label htmlFor="library-sort" className="sr-only">排序 / Sort results</label>
            <select
              id="library-sort"
              value={sort}
              onChange={(event) => setSort(event.target.value as NonNullable<ArchiveFilter["sort"]>)}
              className="min-h-11 w-full border border-white/20 bg-[#0c0f0c] px-3 text-sm text-[#f3f0e5] sm:w-auto"
            >
              <option value="latest">最新 / Latest</option>
              <option value="oldest">最早 / Oldest</option>
              <option value="title">标题 / Title</option>
            </select>
            <div className="flex w-full border border-white/20 sm:w-auto" role="group" aria-label="浏览布局 / Browse layout">
              <button
                type="button"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
                className={`min-h-11 px-3 text-sm transition active:translate-y-px ${view === "grid" ? "bg-[#d6b45a]/15 text-[#f3d77d]" : "text-[#eee9de]/72 hover:text-[#f3f0e5]"}`}
              >
                网格 Grid
              </button>
              <button
                type="button"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
                className={`min-h-11 border-l border-white/20 px-3 text-sm transition active:translate-y-px ${view === "list" ? "bg-[#d6b45a]/15 text-[#f3d77d]" : "text-[#eee9de]/72 hover:text-[#f3f0e5]"}`}
              >
                列表 List
              </button>
            </div>
            <button
              type="button"
              onClick={resetFilters}
              disabled={isDefault}
              className="min-h-11 w-full border border-white/20 px-3 text-sm text-[#eee9de]/80 transition hover:border-[#d6b45a]/70 hover:text-[#f3d77d] disabled:cursor-not-allowed disabled:opacity-45 active:translate-y-px sm:w-auto"
            >
              重置 Reset
            </button>
          </div>
        </div>

        {results.length > 0 ? (
          <div className={view === "grid" ? "mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3" : "mt-4 grid gap-3"}>
            {results.map((item) => (
              <Link
                key={item.slug}
                href={`/media/${item.slug}`}
                className={view === "grid" ? "group relative min-h-[260px] overflow-hidden rounded-xl border border-white/15 bg-black transition hover:-translate-y-1 hover:border-[#d6b45a]/70 active:translate-y-px" : "group grid overflow-hidden rounded-xl border border-white/15 bg-black transition hover:border-[#d6b45a]/70 active:translate-y-px sm:grid-cols-[220px_1fr]"}
              >
                <div className={view === "grid" ? "absolute inset-0" : "relative aspect-[4/3] sm:aspect-auto"}>
                  <Image
                    src={item.poster}
                    alt={`${item.titleZh} / ${item.titleEn}`}
                    fill
                    unoptimized
                    sizes={view === "grid" ? "(min-width: 1280px) 25vw, (min-width: 640px) 45vw, 100vw" : "(min-width: 640px) 220px, 100vw"}
                    className={item.kind === "poster" ? "object-contain bg-[#080b08] transition duration-500 group-hover:scale-[1.02]" : "object-cover transition duration-500 group-hover:scale-105"}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <span className="absolute right-3 top-3 rounded border border-white/15 bg-black/70 px-2 py-1 text-xs text-[#f3f0e5]">
                    {getMediaKindLabel(item.kind)}
                  </span>
                </div>
                <div className={view === "grid" ? "absolute inset-x-0 bottom-0 p-4" : "flex min-w-0 flex-col justify-end p-4 sm:p-5"}>
                  <h3 className="font-display text-2xl leading-tight text-[#f4f1e8]">{item.titleZh}</h3>
                  <p className="mt-1 text-sm text-[#f4f1e8]/80">{item.titleEn}</p>
                  <p className="mt-3 border-t border-white/15 pt-2 text-xs text-[#b6dc9e]">{item.archiveId} · {item.categoryEn}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 border border-dashed border-white/20 px-6 py-14 text-center">
            <p className="font-display text-2xl text-[#f3f0e5]">未找到匹配档案 / No matching records</p>
            <p className="mt-2 text-sm text-[#eee9de]/62">尝试其他关键词或重置筛选条件。</p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 min-h-11 border border-[#d6b45a]/55 px-4 py-2 text-sm text-[#f3d77d] transition hover:bg-[#d6b45a]/10 active:translate-y-px"
            >
              重置筛选 / Reset filters
            </button>
          </div>
        )}
      </div>

      <aside className="order-2 border-b border-white/12 pb-6 lg:order-1 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-5">
        <p className="text-xs tracking-[.2em] text-[#d6b45a]">ARCHIVE INDEX</p>
        <h2 className="mt-2 font-display text-3xl">影像库 <span className="mt-1 block text-lg text-[#eee9de]/72">Archive index</span></h2>
        <div className="mt-7 grid gap-1 sm:grid-cols-2 lg:block">
          <button
            type="button"
            aria-pressed={category === ""}
            onClick={() => setCategory("")}
            className={`flex min-h-11 w-full items-center justify-between border-b border-white/10 px-2 py-3 text-left text-sm transition active:translate-y-px ${category === "" ? "text-[#d6b45a]" : "text-[#eee9de]/72 hover:text-[#f3f0e5]"}`}
          >
            <span className="min-w-0 flex-1">全部影像 / All media</span>
            <span className="shrink-0" aria-label={`${mediaItems.length} items`}>{mediaItems.length}</span>
          </button>
          {categories.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={category === item.value}
              onClick={() => setCategory(item.value)}
              className={`flex min-h-11 w-full items-center justify-between gap-3 border-b border-white/10 px-2 py-3 text-left text-sm transition active:translate-y-px ${category === item.value ? "text-[#d6b45a]" : "text-[#eee9de]/72 hover:text-[#f3f0e5]"}`}
            >
              <span className="min-w-0 flex-1">{item.labelZh} <span className="text-xs text-current/70">/ {item.labelEn}</span></span>
              <span className="shrink-0" aria-label={`${item.count} items`}>{item.count}</span>
            </button>
          ))}
        </div>
      </aside>
    </section>
  )
}
