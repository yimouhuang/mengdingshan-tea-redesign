import Image from "next/image"
import Link from "next/link"
import { ArchiveNav } from "@/components/archive-nav"
import { ExploreMapShell } from "@/components/explore-map-shell"
import { getMediaItem, getMediaKindLabel } from "@/lib/media"

const exploreMediaSlugs = [
  "tea-garden-in-mist",
  "new-tea-shoots",
  "tea-ancestor-relief"
] as const

const exploreMedia = exploreMediaSlugs.map((slug) => {
  const item = getMediaItem(slug)

  if (!item) {
    throw new Error(`Explore media record is missing: ${slug}`)
  }

  return item
})

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-[#060806] pb-16 text-[#f3f0e5]">
      <ArchiveNav />
      <section className="archive-container py-8 md:py-12">
        <div className="grid gap-6 border-b border-white/15 pb-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="text-xs tracking-[.24em] text-[#d6b45a]">REGIONAL CONTEXT</p>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-6xl">
              探索蒙顶山 / Explore Mengding Mountain
            </h1>
            <p className="mt-4 max-w-3xl leading-7 text-[#eee9de]/78">
              交互地图提供蒙顶山周边的整体地域语境；它不是游览路线，也不标示影像的精确拍摄地点。
              <span className="mt-1 block">
                The interactive map provides general regional context for Mengding Mountain; it is not a
                route and does not claim exact locations for archive media.
              </span>
            </p>
          </div>
          <Link
            href="/library"
            className="inline-flex min-h-11 items-center justify-center border border-[#d6b45a]/55 bg-transparent px-5 py-2 text-sm text-[#f3d77d] transition hover:bg-[#d6b45a]/10 active:translate-y-px"
          >
            浏览影像 / Browse media
          </Link>
        </div>

        <div className="mt-8">
          <ExploreMapShell />
        </div>

        <section className="mt-12">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs tracking-[.24em] text-[#d6b45a]">ARCHIVE SELECTION</p>
              <h2 className="mt-3 font-display text-3xl md:text-4xl">
                从影像认识蒙顶山 / Discover through the archive
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-[#eee9de]/65">
              Three views from the visual archive, selected to accompany the regional map.
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] lg:grid-rows-2">
            {exploreMedia.map((item, index) => (
              <Link
                key={item.slug}
                href={`/media/${item.slug}`}
                className={`group relative overflow-hidden rounded-xl border border-white/15 bg-black ${
                  index === 0 ? "min-h-[360px] lg:row-span-2 lg:min-h-[560px]" : "min-h-[260px]"
                }`}
              >
                <Image
                  src={item.poster}
                  alt=""
                  fill
                  sizes={
                    index === 0
                      ? "(min-width: 1024px) 62vw, 100vw"
                      : index === 1
                        ? "(min-width: 1024px) 31vw, 100vw"
                        : "(min-width: 1024px) 29vw, 100vw"
                  }
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,.95),rgba(0,0,0,.18)_65%,rgba(0,0,0,.42))]" />
                <span className="absolute right-3 top-3 border border-white/15 bg-black/60 px-2 py-1 text-xs text-[#f3f0e5]/86">
                  {getMediaKindLabel(item.kind)}
                </span>
                <div className="absolute bottom-0 p-5 md:p-6">
                  <h3 className="font-display text-2xl leading-tight md:text-3xl">{item.titleZh}</h3>
                  <p className="mt-1 font-display text-base text-[#f3f0e5]/82">{item.titleEn}</p>
                  <p className="mt-3 text-xs tracking-[.08em] text-[#b6dc9e]">
                    {item.archiveId} · {item.categoryEn}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </main>
  )
}
