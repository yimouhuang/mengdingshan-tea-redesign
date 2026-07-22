import Image from "next/image"
import Link from "next/link"
import { ArchiveNav } from "@/components/archive-nav"
import { getMediaItem, getRelatedMedia } from "@/lib/media"

const guideStopSlugs = [
  "mengding-mountain-gateway",
  "tea-summit-landmark",
  "tea-garden-in-mist",
  "ancient-tea-tree-of-mengding",
  "new-tea-shoots",
  "tea-ancestor-relief"
] as const

const selectedSlug = "tea-garden-in-mist"

const guideStops = guideStopSlugs.map((slug) => {
  const item = getMediaItem(slug)

  if (!item) {
    throw new Error(`Missing archive record for guide stop: ${slug}`)
  }

  return item
})

export default function GuidePrototypePage() {
  const selectedIndex = guideStops.findIndex((stop) => stop.slug === selectedSlug)
  const selectedStop = guideStops[selectedIndex]
  const previousStop = guideStops[(selectedIndex - 1 + guideStops.length) % guideStops.length]
  const nextStop = guideStops[(selectedIndex + 1) % guideStops.length]
  const linkedMedia = getRelatedMedia(selectedStop.slug, 4)

  return (
    <main className="min-h-[100dvh] overflow-x-hidden bg-[#060806] pb-12 text-[#f3f0e5]">
      <ArchiveNav />

      <section className="archive-container pt-4 sm:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/12 pb-5">
          <div>
            <p className="text-sm text-[#d6b45a]">静态导览原型 / Static guide concept</p>
            <h1 className="mt-2 font-display text-3xl tracking-tight sm:text-4xl">
              蒙顶山茶路
            </h1>
          </div>
          <Link
            href="/library"
            className="border border-[#d6b45a]/55 px-4 py-2 text-sm text-[#f3dfab] transition-colors hover:border-[#f2d37a] hover:text-[#fff1c8]"
          >
            返回影像库 / Back to library
          </Link>
        </div>

        <div className="grid min-w-0 gap-8 py-8 xl:grid-cols-[minmax(180px,0.58fr)_minmax(0,1.55fr)_minmax(300px,0.82fr)] xl:gap-0">
          <aside className="min-w-0 xl:border-r xl:border-white/12 xl:pr-7">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d6b45a]">
              Route index
            </p>
            <ol
              aria-label="Static route index, six archival stops"
              className="mt-5 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3 xl:grid-cols-1 xl:gap-0"
            >
              {guideStops.map((stop, index) => {
                const selected = stop.slug === selectedSlug

                return (
                  <li
                    key={stop.slug}
                    className={`border-l pl-3 xl:border-l-0 xl:border-t xl:px-0 xl:py-4 ${
                      selected
                        ? "border-[#d6b45a] text-[#fff0bc]"
                        : "border-white/12 text-[#f3f0e5]/64"
                    }`}
                  >
                    <span className="font-mono text-xs text-[#d6b45a]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block text-sm leading-5">{stop.titleZh}</span>
                    <span className="mt-1 block text-xs leading-4 text-[#f3f0e5]/55">
                      {stop.titleEn}
                    </span>
                  </li>
                )
              })}
            </ol>
          </aside>

          <section className="min-w-0 xl:px-8" aria-labelledby="route-field-heading">
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d6b45a]">
                  Six archive stops
                </p>
                <h2 id="route-field-heading" className="mt-2 font-display text-2xl">
                  山间路线 / Route field
                </h2>
              </div>
              <p className="max-w-40 text-right text-xs leading-5 text-[#f3f0e5]/50">
                A visual sequence drawn from the archive.
              </p>
            </div>

            <div className="relative min-h-[540px] overflow-hidden border border-[#d6b45a]/30 bg-[radial-gradient(circle_at_18%_18%,rgb(127_155_104_/_0.22),transparent_27%),radial-gradient(circle_at_78%_75%,rgb(211_179_95_/_0.12),transparent_30%),linear-gradient(145deg,#11180f,#070a07_62%,#0b0e09)] p-4 sm:min-h-[630px] sm:p-7">
              <p className="relative mb-6 pl-10 text-xs leading-5 text-[#f3f0e5]/62 sm:pl-0">
                Follow the route from 01 to 06
              </p>
              <div
                aria-hidden="true"
                className="absolute bottom-[8%] left-8 top-[14%] w-px bg-[#d6b45a]/65 sm:bottom-[10%] sm:left-1/2 sm:top-[10%] sm:-translate-x-1/2"
              />
              <div className="relative grid grid-cols-1 gap-y-8 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-12">
                {guideStops.map((stop, index) => {
                  const selected = stop.slug === selectedSlug
                  const nodePosition =
                    index % 2 === 0
                      ? "left-0 sm:left-auto sm:-right-10"
                      : "left-0 sm:-left-10 sm:top-12"

                  return (
                    <figure
                      key={stop.slug}
                      className={`relative min-w-0 pl-10 sm:pl-0 ${
                        index % 2 === 0 ? "sm:pr-8" : "sm:pt-12 sm:pl-8"
                      }`}
                    >
                      <span
                        aria-label={`Route node ${String(index + 1).padStart(2, "0")}`}
                        className={`absolute top-0 z-10 grid size-8 place-items-center rounded-full border border-[#f2d37a] bg-[#0b0f09] font-mono text-[10px] text-[#fff0bc] ${nodePosition}`}
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <div
                        className={`relative aspect-[4/3] overflow-hidden border bg-[#10150f] ${
                          selected ? "border-[#f2d37a]" : "border-white/20"
                        }`}
                      >
                        <Image
                          src={stop.poster}
                          alt={stop.titleZh}
                          fill
                          sizes="(min-width: 1280px) 19vw, 42vw"
                          className="object-cover"
                        />
                      </div>
                      <figcaption className="mt-2 text-xs leading-4 text-[#f3f0e5]/72">
                        {stop.titleEn}
                      </figcaption>
                    </figure>
                  )
                })}
              </div>
            </div>
          </section>

          <aside className="min-w-0 border-t border-white/12 pt-7 xl:border-t-0 xl:border-l xl:pl-8 xl:pt-0">
            <p className="font-mono text-xs uppercase tracking-[0.16em] text-[#d6b45a]">
              Selected dossier
            </p>
            <div className="relative mt-4 aspect-[4/3] overflow-hidden border border-[#d6b45a]/50 bg-[#10150f]">
              <Image
                src={selectedStop.poster}
                alt={selectedStop.titleZh}
                fill
                sizes="(min-width: 1280px) 28vw, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>

            <h2 className="mt-5 font-display text-3xl leading-tight">{selectedStop.titleZh}</h2>
            <p className="mt-2 font-display text-xl text-[#f3f0e5]/78">
              {selectedStop.titleEn}
            </p>
            <p className="mt-4 leading-7 text-[#f3f0e5]/76">{selectedStop.descriptionZh}</p>
            <p className="mt-2 text-sm leading-6 text-[#f3f0e5]/52">
              {selectedStop.descriptionEn}
            </p>

            <dl className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 border-t border-white/12 pt-5 text-sm">
              <div>
                <dt className="text-xs text-[#d6b45a]">地点 / Location</dt>
                <dd className="mt-1 leading-5 text-[#f3f0e5]/78">
                  {selectedStop.locationZh}
                  <br />
                  {selectedStop.locationEn}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#d6b45a]">编号 / Archive ID</dt>
                <dd className="mt-1 leading-5 text-[#f3f0e5]/78">{selectedStop.archiveId}</dd>
              </div>
              <div>
                <dt className="text-xs text-[#d6b45a]">类别 / Category</dt>
                <dd className="mt-1 leading-5 text-[#f3f0e5]/78">
                  {selectedStop.categoryZh}
                  <br />
                  {selectedStop.categoryEn}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-[#d6b45a]">关联 / Linked</dt>
                <dd className="mt-1 leading-5 text-[#f3f0e5]/78">
                  {linkedMedia.length} linked media
                </dd>
              </div>
            </dl>

            <p className="mt-6 border-y border-[#d6b45a]/25 py-3 text-sm text-[#f3dfab]">
              Audio guide — coming later
            </p>

            <div
              className="mt-6 grid grid-cols-2 gap-3"
              aria-label="Prototype references, not interactive navigation"
            >
              <div className="border border-white/15 p-3 text-left">
                <span className="block text-xs text-[#d6b45a]">Prototype reference: prior stop</span>
                <span className="mt-2 block text-sm leading-5 text-[#f3f0e5]/76">
                  {previousStop.titleEn}
                </span>
              </div>
              <div className="border border-white/15 p-3 text-right">
                <span className="block text-xs text-[#d6b45a]">Prototype reference: next stop</span>
                <span className="mt-2 block text-sm leading-5 text-[#f3f0e5]/76">
                  {nextStop.titleEn}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  )
}
