import Image from "next/image"
import Link from "next/link"
import { ArchiveNav } from "@/components/archive-nav"
import {
  getFeaturedMedia,
  getMediaItem,
  getMediaKindLabel
} from "@/lib/media"

export default function Home() {
  const featured = getFeaturedMedia()
  const hero = getMediaItem("tea-garden-in-mist")

  if (!hero) {
    throw new Error("Home hero media record is missing")
  }

  return (
    <main className="min-h-screen bg-[#060806] text-[#f3f0e5]">
      <ArchiveNav />
      <section className="archive-container grid gap-4 pb-7 lg:grid-cols-[minmax(0,1.65fr)_minmax(420px,1fr)]">
        <div className="relative min-h-[650px] overflow-hidden rounded-[18px] border border-white/15 bg-black">
          <Image
            src={hero.poster}
            alt={`${hero.titleZh} / ${hero.titleEn}`}
            fill
            priority
            sizes="(min-width: 1024px) 65vw, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(1,5,3,.88),rgba(1,5,3,.2)),linear-gradient(0deg,rgba(1,4,3,.94),transparent_65%)]" />
          <div
            className="relative z-10 flex min-h-[650px] flex-col"
            data-testid="home-hero-foreground"
          >
          <div
            className="mt-auto ml-8 mr-8 max-w-[650px] pb-8 pt-12 md:ml-12 md:pb-10"
            data-testid="home-hero-copy"
          >
            <p className="text-xs tracking-[.24em] text-[#d6b45a]">{hero.archiveId}</p>
            <h1 className="mt-5 font-display text-5xl leading-[1.12] md:text-7xl">
              蒙顶山茶文化<br />数字影像馆
            </h1>
            <p className="mt-4 font-display text-2xl text-[#b6dc9e] md:text-3xl">
              {hero.titleZh} / {hero.titleEn}
            </p>
            <p className="mt-7 max-w-xl leading-7 text-[#eee9de]/82">{hero.descriptionEn}</p>
            <Link
              href="/library"
              className="mt-8 inline-flex border border-[#f3f0e5]/75 px-6 py-3 transition hover:bg-[#f3f0e5] hover:text-black"
            >
              浏览影像馆 / Browse media
            </Link>
          </div>
          <dl
            className="grid grid-cols-2 border-t border-white/15 bg-black/45 p-5 text-sm backdrop-blur md:grid-cols-4"
            data-testid="home-hero-metadata"
          >
            <div>
              <dt className="text-[#d6b45a]">档案编号</dt>
              <dd className="mt-1">{hero.archiveId}</dd>
            </div>
            <div>
              <dt className="text-[#d6b45a]">地理位置</dt>
              <dd className="mt-1">{hero.locationZh}</dd>
            </div>
            <div>
              <dt className="text-[#d6b45a]">拍摄日期</dt>
              <dd className="mt-1">{hero.captureDate}</dd>
            </div>
            <div>
              <dt className="text-[#d6b45a]">媒介</dt>
              <dd className="mt-1">{getMediaKindLabel(hero.kind)}</dd>
            </div>
          </dl>
          </div>
        </div>
        <div className="grid auto-rows-[150px] grid-cols-2 gap-3 md:auto-rows-[170px]">
          {featured.map((item, index) => (
            <Link
              key={item.slug}
              href={`/media/${item.slug}`}
              className={`group relative overflow-hidden rounded-xl border border-white/18 bg-black ${index === 0 ? "col-span-2 row-span-2" : ""}`}
            >
              <Image
                src={item.poster}
                alt={`${item.titleZh} / ${item.titleEn}`}
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <span className="absolute right-3 top-3 rounded bg-black/60 px-2 py-1 text-xs">
                {getMediaKindLabel(item.kind)}
              </span>
              <div className="absolute bottom-0 p-4">
                <h2 className="font-display text-xl">{item.titleZh}</h2>
                <p className="mt-1 text-sm text-[#f3f0e5]/78">{item.titleEn}</p>
                <p className="mt-2 text-xs text-[#b6dc9e]">{item.categoryEn}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  )
}
