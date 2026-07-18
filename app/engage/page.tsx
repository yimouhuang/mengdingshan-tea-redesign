import Image from "next/image"
import Link from "next/link"
import { ArchiveNav } from "@/components/archive-nav"
import { getMediaItem } from "@/lib/media"
import { resolveMediaUrl } from "@/lib/media-url"

const archiveInvitationSlugs = [
  "mengding-mountain-gateway",
  "way-up-the-mountain",
  "tea-garden-overlook"
]

export default function EngagePage() {
  const archiveInvitations = archiveInvitationSlugs.map((slug) => getMediaItem(slug))

  if (archiveInvitations.some((item) => !item)) {
    throw new Error("Engage archive media is missing")
  }

  return (
    <main className="min-h-screen bg-[#060806] pb-16 text-[#f3f0e5]">
      <ArchiveNav />

      <section className="archive-container py-8 md:py-12" aria-labelledby="engage-heading">
        <div className="max-w-3xl">
          <p className="text-xs tracking-[.24em] text-[#d6b45a]">
            参与 / <span lang="en">ENGAGE</span>
          </p>
          <h1 id="engage-heading" className="mt-3 font-display text-4xl leading-tight md:text-6xl">
            从影像，走近蒙顶茶
          </h1>
          <p className="mt-4 max-w-2xl leading-7 text-[#eee9de]/72">
            以偏好为起点，进入可回查的蒙顶茶文化记录。
            <span lang="en" className="mt-1 block text-[#eee9de]/58">
              Seven preferences lead to traceable Mengding tea records.
            </span>
          </p>
        </div>

        <div className="mt-9 grid gap-[22px] max-[900px]:grid-cols-1 min-[901px]:grid-cols-[minmax(0,1.8fr)_minmax(300px,.78fr)]">
          <Link
            href="/engage/tea-profile"
            aria-label="开始寻找蒙顶茶 / Start finding your Mengding tea"
            className="group relative isolate flex min-h-[490px] overflow-hidden rounded-2xl border border-[#d6b45a]/70 bg-[#0b100b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806] max-sm:min-h-[430px]"
          >
            <Image
              src={resolveMediaUrl("/media/photos/tea-garden-in-mist.jpg")}
              alt=""
              fill
              priority
              sizes="(min-width: 1640px) 1100px, (min-width: 901px) 64vw, 100vw"
              className="z-0 object-cover saturate-[.7] brightness-[.73] contrast-[.92] transition-transform duration-700 group-hover:scale-[1.03] motion-reduce:transform-none"
            />
            <div className="absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(4,8,5,.94)_0%,rgba(4,8,5,.58)_47%,rgba(4,8,5,.1)_100%)]" />
            <div className="absolute inset-0 z-[2] bg-[linear-gradient(0deg,rgba(4,8,5,.80)_0%,transparent_50%)]" />

            <div className="relative z-[3] flex min-h-[490px] max-w-[620px] flex-col justify-end p-7 sm:p-11 max-sm:min-h-[430px] max-sm:p-[26px]">
              <h2 className="font-display text-4xl leading-[1.04] text-[#f8f4e8] sm:text-5xl md:text-6xl">
                寻一盏蒙顶茶
                <span lang="en" className="mt-2 block text-[.62em] font-medium text-[#eee9de]">
                  Find your Mengding tea
                </span>
              </h2>
              <p className="mt-4 max-w-[30rem] leading-[1.58] text-[#f3f0e5]/80">
                七个偏好提示，生成主推荐与备选茶记录。
                <span lang="en" className="mt-1 block text-sm text-[#f3f0e5]/62">
                  Seven prompts. One primary record, one alternate.
                </span>
              </p>
              <div className="mt-6">
                <span className="inline-flex min-h-11 w-fit items-center justify-center rounded-[2px] border border-[#d6b45a] bg-[#060806]/30 px-[18px] text-sm text-[#fff0b4] transition hover:bg-[#d6b45a]/13">
                  开始寻找 / <span lang="en" className="ml-1">Start finding</span>
                </span>
              </div>
            </div>
          </Link>

          <article className="flex min-h-[490px] flex-col justify-between border-y border-[#d6b45a]/55 bg-white/[.012] p-[30px] max-sm:min-h-[300px] max-sm:p-6">
            <div>
              <h2 className="font-display text-[32px] leading-[1.08] text-[#f3f0e5]">
                茶知识问答
                <span lang="en" className="mt-2 block text-[.62em] font-medium text-[#eee9de]">
                  Tea knowledge quiz
                </span>
              </h2>
              <p className="mt-5 leading-[1.65] text-[#eee9de]/64">
                随机十题，逐题回查公开资料与影像档案。
                <span lang="en" className="mt-1 block text-sm text-[#f3f0e5]/62">
                  Ten random prompts with traceable public sources and archive records.
                </span>
              </p>
            </div>

            <div className="mt-8">
              <p className="border-t border-white/15 py-[18px] text-[13px] text-[#d6b45a]">
                10 questions
                <span lang="en" className="mt-1 block text-[#eee9de]/58">Traceable sources</span>
              </p>
              <Link
                href="/engage/quiz"
                className="inline-flex min-h-11 w-fit items-center justify-center rounded-[2px] border border-[#d6b45a] bg-[#060806]/30 px-[18px] text-sm text-[#fff0b4] transition hover:bg-[#d6b45a]/13 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
              >
                开始问答 / <span lang="en" className="ml-1">Start quiz</span>
              </Link>
            </div>
          </article>
        </div>

        <section
          className="mt-[46px] grid gap-[30px] border-t border-white/15 pt-7 max-[900px]:grid-cols-1 min-[901px]:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]"
          aria-labelledby="archive-invitations-heading"
        >
          <div>
            <h2 id="archive-invitations-heading" className="font-display text-[28px] leading-tight text-[#f3f0e5]">
              从影像开始，不止停在结果
            </h2>
            <p className="mt-3 max-w-[380px] leading-[1.6] text-[#eee9de]/64">
              找茶结果与问答依据都可以回到本馆的真实影像条目继续浏览。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 max-sm:gap-2">
            {archiveInvitations.map((item) => {
              if (!item) {
                return null
              }

              return (
                <Link
                  key={item.slug}
                  href={`/media/${item.slug}`}
                  className="group min-w-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
                >
                  <div className="relative aspect-[1.35/1] overflow-hidden border border-white/15 bg-[#101610]">
                    <Image
                      src={item.poster}
                      alt=""
                      fill
                      sizes="(min-width: 1640px) 272px, (min-width: 901px) calc(17.8vw - 21px), 30vw"
                      className="object-cover saturate-[.74] brightness-[.82] transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transform-none"
                    />
                  </div>
                  <span className="mt-2 block text-xs text-[#dfdacd] max-sm:text-[11px]">{item.titleZh}</span>
                </Link>
              )
            })}
          </div>
        </section>
      </section>
    </main>
  )
}
