import Image from "next/image"
import type { TeaMedia } from "@/lib/media"

type MediaPlayerProps = {
  item: TeaMedia
}

export function MediaPlayer({ item }: MediaPlayerProps) {
  if (item.kind === "video" && item.video) {
    return (
      <video
        controls
        playsInline
        preload="metadata"
        poster={item.poster}
        className="aspect-video w-full rounded-md border border-black/10 bg-black object-cover"
      >
        <source src={item.video} type="video/mp4" />
      </video>
    )
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-md border border-black/10 bg-black">
      <Image
        src={item.poster}
        alt={item.titleZh}
        fill
        priority
        sizes="(min-width: 1024px) 52vw, 100vw"
        className="origin-top scale-[1.16] object-cover object-top"
      />
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-[#f4f1e8] text-2xl text-black shadow-xl shadow-black/20">
          ▶
        </span>
      </div>
      {item.kind === "video" ? (
        <div className="absolute inset-x-4 bottom-4 rounded-md bg-black/62 p-3 text-xs leading-5 text-white backdrop-blur">
          本地视频文件尚未接入。将 mp4 放入 public/media/videos 后，在 lib/media.ts 为该条目添加 video 字段即可启用播放。
        </div>
      ) : null}
    </div>
  )
}
