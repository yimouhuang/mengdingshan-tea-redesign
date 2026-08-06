import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArchiveNav } from "@/components/archive-nav"
import { ArchiveVideo } from "@/components/archive-video"
import { MediaLibraryBackLink } from "@/components/media-library-back-link"
import { MediaActions } from "@/components/media-actions"
import { getMediaItem, getMediaNeighbors, getRelatedMedia, mediaItems } from "@/lib/media"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return mediaItems.map(item => ({ slug: item.slug }))
}

export default async function MediaPage({ params }: Props) {
  const item = getMediaItem((await params).slug)
  if (!item) notFound()

  const neighbors = getMediaNeighbors(item.slug)!
  const related = getRelatedMedia(item.slug)

  return (
    <main className="min-h-screen bg-[#060806] pb-12 text-[#f3f0e5]">
      <ArchiveNav />
      <section className="archive-container">
        <div className="flex flex-wrap justify-between gap-4 py-5 text-sm text-[#eee9de]/72">
          <MediaLibraryBackLink />
          <span>{item.archiveId}</span>
          <span>
            <Link href={`/media/${neighbors.previous.slug}`}>上一条</Link>　
            <Link href={`/media/${neighbors.next.slug}`}>下一条 →</Link>
          </span>
        </div>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1.75fr)_430px]">
          <div className="overflow-hidden rounded-2xl border border-white/15 bg-black">
            {item.kind === "video" ? (
              <ArchiveVideo
                source={item.video}
                poster={item.poster}
                className="aspect-video w-full object-contain"
              />
            ) : item.kind === "poster" ? (
              <div className={`grid gap-3 p-3 ${item.pages.length === 1 ? "mx-auto max-w-2xl" : "md:grid-cols-2"}`}>
                {item.pages.map((page, index) => (
                  <div key={page} className="relative aspect-[210/297] overflow-hidden bg-black">
                    <Image
                      src={page}
                      alt={`${item.titleZh} / ${item.titleEn}，第 ${index + 1} 页 / page ${index + 1}`}
                      fill
                      sizes="(min-width: 1280px) 35vw, 100vw"
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="relative aspect-video">
                <Image
                  src={item.poster}
                  alt={item.titleZh}
                  fill
                  priority
                  sizes="(min-width:1280px) 70vw,100vw"
                  className="object-contain"
                />
              </div>
            )}
            <div className="flex items-center justify-between border-t border-white/15 p-4 text-sm">
              <span>
                {item.kind === "video"
                  ? `视频 Video · ${item.duration}`
                  : item.kind === "poster"
                    ? `海报 Poster · ${item.pages.length === 1 ? "1 页 / page" : `${item.assetCount ?? item.pages.length} 页 / pages`}`
                    : "图片 Photo"}
              </span>
              <span className="text-[#b6dc9e]">环境导览需接入音轨</span>
            </div>
          </div>
          <aside className="rounded-2xl border border-white/15 bg-white/[.035] p-6">
            <p className="text-sm text-[#b6dc9e]">{item.kind === "video" ? "视频 Video" : item.kind === "poster" ? "海报 Poster" : "图片 Photos"}</p>
            <h1 className="mt-3 font-display text-4xl">{item.titleZh}</h1>
            <p className="mt-2 font-display text-2xl text-[#eee9de]/85">{item.titleEn}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 border-y border-white/12 py-5 text-sm">
              <div>
                <dt className="text-[#d6b45a]">地点 Location</dt>
                <dd className="mt-1">{item.locationZh}<br />{item.locationEn}</dd>
              </div>
              <div>
                <dt className="text-[#d6b45a]">拍摄时间</dt>
                <dd className="mt-1">{item.captureDate}</dd>
              </div>
              <div>
                <dt className="text-[#d6b45a]">编号 ID</dt>
                <dd className="mt-1">{item.archiveId}</dd>
              </div>
              <div>
                <dt className="text-[#d6b45a]">权利 Rights</dt>
                <dd className="mt-1">{item.rights}</dd>
              </div>
            </dl>
            <h2 className="mt-6 text-sm text-[#d6b45a]">馆长寄语 Curator&apos;s Note</h2>
            <p className="mt-2 leading-7 text-[#eee9de]/82">{item.descriptionZh}</p>
            <p className="mt-2 text-sm leading-6 text-[#eee9de]/60">{item.descriptionEn}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {item.tags.map(tag => <span key={tag} className="rounded-full border border-white/15 px-3 py-1 text-xs">{tag}</span>)}
            </div>
            <MediaActions
              slug={item.slug}
              titleZh={item.titleZh}
              titleEn={item.titleEn}
              knownSlugs={mediaItems.map((record) => record.slug)}
            />
          </aside>
        </div>
        <div className="mt-9">
          <h2 className="font-display text-2xl">相关影像 <span className="text-base text-[#eee9de]/64">Related Media</span></h2>
          <div className="mt-4 flex gap-3 overflow-x-auto pb-3">
            {related.map(record => (
              <Link
                key={record.slug}
                href={`/media/${record.slug}`}
                className="relative h-40 min-w-56 overflow-hidden rounded-xl border border-white/15"
              >
                <Image
                  src={record.poster}
                  alt={record.titleZh}
                  fill
                  sizes="224px"
                  className={record.kind === "poster" ? "object-contain bg-[#080b08]" : "object-cover"}
                />
                <span className="absolute inset-x-0 bottom-0 bg-black/75 p-3 text-sm">
                  {record.titleZh}
                  <small className="block text-[#eee9de]/65">{record.titleEn}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
