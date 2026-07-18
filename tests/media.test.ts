import assert from "node:assert/strict"
import {
  closeSync,
  existsSync,
  fstatSync,
  openSync,
  readSync,
  readdirSync,
  statSync
} from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import {
  filterMedia,
  getMediaCategories,
  getFeaturedMedia,
  getMediaKindLabel,
  getMediaNeighbors,
  getRelatedMedia,
  mediaItems
} from "../lib/media"

const publicDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../public")
const bytesPerMiB = 1024 * 1024
const minHighQualityDeliveryVideoAggregateBytes = 150 * bytesPerMiB
const maxHighQualityDeliveryVideoBytes = 80 * bytesPerMiB
const maxHighQualityDeliveryVideoAggregateBytes = 320 * bytesPerMiB

function getLocalMediaPath(mediaUrl: string): string {
  const pathname = new URL(mediaUrl, "https://local-media.invalid").pathname
  const mediaPathIndex = pathname.indexOf("/media/")

  assert.notEqual(mediaPathIndex, -1, `Expected a /media/ path: ${mediaUrl}`)
  return pathname.slice(mediaPathIndex)
}

const expectedVideoTitles = [
  ["GH010090", "蒙顶山门", "Mengding Mountain Gateway"],
  ["GH010091", "茶祖故里路标", "Tea Ancestor Hometown Signposts"],
  ["GH010092", "茶顶地标", "Tea Summit Landmark"],
  ["GH010093", "国家级旅游景区碑", "National Tourist Attraction Marker"],
  ["GH010096", "瀑布与睡莲", "Waterfall and Lily Pond"],
  ["GH010103", "山谷远眺", "Valley Overlook"],
  ["GH010105", "初夏茶园", "Early Summer Tea Garden"],
  ["GH010110", "蒙顶古茶树", "Ancient Tea Tree of Mengding"],
  ["GH010116", "云岚茶园", "Tea Garden in Mist"],
  ["GH010120", "上山由此去", "Way Up the Mountain"],
  ["GH010124", "茶祖浮雕", "Tea Ancestor Relief"],
  ["GH010130", "山林题刻", "Forest Inscription"],
  ["GH010137", "林间石阶", "Forest Stone Steps"],
  ["GH010141", "祈愿红绸", "Red Ribbons of Wishes"],
  ["GH010146", "蒙顶红门", "Red Gate of Mengding"],
  ["GH010154", "山门来客", "Visitors at the Mountain Gate"],
  ["GH010173", "龙纹石壁", "Dragon Carved Rock Wall"],
  ["GH010199", "人间养生场", "A Retreat for Wellbeing"],
  ["GH010219", "采一芽", "Picking New Tea Shoots"],
  ["GH010230", "茶芽初展", "New Tea Shoots"],
  ["GH010246", "鲜叶分拣", "Sorting Fresh Leaves"],
  ["GH010258", "鲜叶在手", "Fresh Leaves in Hand"],
  ["GH010263", "成茶观形", "Finished Tea, Examined"]
] as const

const expectedPhotoTitles = [
  ["1f42c25e", "林间古牌坊", "Ancient Archway in the Woods"],
  ["21d77d9c", "茶园远眺", "Tea Garden Overlook"],
  ["2795f4d9", "世界茶文化博物馆", "World Tea Culture Museum"],
  ["2fdbff1b", "茶席一刻", "A Moment at the Tea Table"],
  ["44f85692", "云岚茶园", "Tea Garden in Mist"],
  ["e34e0fb6", "人间养生场", "A Retreat for Wellbeing"]
] as const

const allowedCategories = new Set([
  "景区地标 / Mountain Landmarks",
  "山水茶园 / Mountain & Tea Gardens",
  "茶事劳作 / Tea Work",
  "茶文化遗存 / Tea Heritage",
  "山间人文 / Mountain Life"
])

function getMp4DurationInSeconds(filePath: string): number {
  const descriptor = openSync(filePath, "r")

  try {
    const fileSize = fstatSync(descriptor).size
    let offset = 0

    while (offset + 8 <= fileSize) {
      const header = Buffer.alloc(16)
      readSync(descriptor, header, 0, header.length, offset)

      let atomSize = header.readUInt32BE(0)
      const atomType = header.toString("ascii", 4, 8)
      let headerSize = 8

      if (atomSize === 1) {
        atomSize = Number(header.readBigUInt64BE(8))
        headerSize = 16
      }

      if (atomSize === 0) {
        atomSize = fileSize - offset
      }

      assert.ok(atomSize >= headerSize && offset + atomSize <= fileSize)

      if (atomType === "moov") {
        const moov = Buffer.alloc(atomSize)
        readSync(descriptor, moov, 0, atomSize, offset)

        const mvhdTypeOffset = moov.indexOf(Buffer.from("mvhd"))
        assert.ok(mvhdTypeOffset >= 4, `Missing mvhd atom in ${filePath}`)

        const version = moov[mvhdTypeOffset + 4]
        const timescale = moov.readUInt32BE(
          mvhdTypeOffset + (version === 1 ? 24 : 16)
        )
        const duration =
          version === 1
            ? Number(moov.readBigUInt64BE(mvhdTypeOffset + 28))
            : moov.readUInt32BE(mvhdTypeOffset + 20)

        assert.ok(timescale > 0, `Invalid MP4 timescale in ${filePath}`)
        return duration / timescale
      }

      offset += atomSize
    }

    assert.fail(`Missing moov atom in ${filePath}`)
  } finally {
    closeSync(descriptor)
  }
}

test("media index contains the complete 29-record archive with unique slugs and home order", () => {
  const slugs = mediaItems.map((item) => item.slug)
  const homeOrders = mediaItems.map((item) => item.homeOrder)

  assert.equal(mediaItems.length, 29)
  assert.equal(new Set(slugs).size, 29)
  assert.equal(new Set(homeOrders).size, 29)
  assert.ok(mediaItems.every((item) => item.titleZh.trim().length > 0))
  assert.ok(mediaItems.every((item) => item.titleEn.trim().length > 0))
})

test("media index has 23 video records and 6 photo records", () => {
  const videos = mediaItems.filter((item) => item.kind === "video")
  const photos = mediaItems.filter((item) => item.kind === "photo")

  assert.equal(videos.length, 23)
  assert.equal(photos.length, 6)
})

test("featured home media is the five-part archive story in narrative order", () => {
  const featured = getFeaturedMedia()

  assert.equal(featured.length, 5)
  assert.equal(new Set(featured.map((item) => item.homeOrder)).size, 5)
  assert.deepEqual(
    featured.map((item) => item.slug),
    [
      "mengding-mountain-gateway",
      "tea-garden-overlook",
      "picking-new-tea-shoots",
      "sorting-fresh-leaves",
      "tea-ancestor-relief"
    ]
  )
})

test("media kind labels are bilingual", () => {
  assert.equal(getMediaKindLabel("video"), "视频 / Video")
  assert.equal(getMediaKindLabel("photo"), "图片 / Photo")
})

test("media index preserves the approved source-to-title matrix", () => {
  const videos = mediaItems.filter((item) => item.kind === "video")
  const photos = mediaItems.filter((item) => item.kind === "photo")

  assert.deepEqual(
    videos.map((item) => [
      getLocalMediaPath(item.video)
        .replace("/media/videos/", "")
        .replace(".mp4", "")
        .toUpperCase(),
      item.titleZh,
      item.titleEn
    ]),
    expectedVideoTitles
  )
  assert.deepEqual(
    photos.map((item) => [
      item.archiveId.replace("MDS-PH-", "").toLowerCase(),
      item.titleZh,
      item.titleEn
    ]),
    expectedPhotoTitles
  )
})

test("media index uses only the approved bilingual categories", () => {
  assert.ok(
    mediaItems.every((item) =>
      allowedCategories.has(`${item.categoryZh} / ${item.categoryEn}`)
    )
  )
})

test("video filter only returns video records", () => {
  const videos = filterMedia(mediaItems, { kind: "video" })

  assert.equal(videos.length, 23)
  assert.ok(videos.every((item) => item.kind === "video"))
})

test("query and category filters only return matching archive records", () => {
  const queried = filterMedia(mediaItems, { query: "tea garden" })
  const teaWork = filterMedia(mediaItems, { category: "Tea Work" })

  assert.ok(queried.length > 0)
  assert.ok(queried.every((item) => `${item.titleEn} ${item.categoryEn} ${item.tags.join(" ")}`.toLowerCase().includes("tea garden")))
  assert.ok(teaWork.length > 0)
  assert.ok(teaWork.every((item) => item.categoryEn === "Tea Work"))
})

test("media categories are unique and source ordered", () => {
  const categories = getMediaCategories(mediaItems)

  assert.equal(categories.length, new Set(categories.map((category) => category.value)).size)
  assert.equal(categories[0]?.value, mediaItems[0]?.categoryEn)
  assert.ok(categories.some((category) => category.value === "Tea Work" && category.count > 0))
})

test("media poster and video paths resolve to local public files", () => {
  for (const item of mediaItems) {
    const posterPath = getLocalMediaPath(item.poster)

    assert.ok(posterPath.startsWith(item.kind === "video" ? "/media/posters/" : "/media/photos/"))
    assert.ok(posterPath.endsWith(".jpg"))
    assert.ok(
      existsSync(resolve(publicDirectory, posterPath.slice(1))),
      `Missing poster for ${item.slug}: ${item.poster}`
    )

    if (item.kind === "video") {
      const videoPath = getLocalMediaPath(item.video)

      assert.ok(videoPath.startsWith("/media/videos/"))
      assert.ok(
        existsSync(resolve(publicDirectory, videoPath.slice(1))),
        `Missing video for ${item.slug}: ${item.video}`
      )
    }
  }
})

test("public media contains exactly the approved photo, video, and poster assets", () => {
  const photos = readdirSync(resolve(publicDirectory, "media/photos"), { withFileTypes: true })
    .filter((entry) => entry.isFile())
  const videos = readdirSync(resolve(publicDirectory, "media/videos"), { withFileTypes: true })
    .filter((entry) => entry.isFile())
  const posters = readdirSync(resolve(publicDirectory, "media/posters"), { withFileTypes: true })
    .filter((entry) => entry.isFile())

  assert.equal(photos.length, 6)
  assert.equal(videos.length, 23)
  assert.equal(posters.length, 23)
  assert.ok(photos.every((entry) => entry.name.endsWith(".jpg")))
  assert.ok(videos.every((entry) => entry.name.endsWith(".mp4")))
  assert.ok(posters.every((entry) => entry.name.endsWith(".jpg")))
  assert.equal(new Set(posters.map((entry) => entry.name)).size, 23)
})

test("delivery videos stay within the high-quality web delivery envelope", () => {
  const videosDirectory = resolve(publicDirectory, "media/videos")
  const videos = readdirSync(videosDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mp4"))

  assert.equal(videos.length, 23)

  const videoSizes = videos.map((entry) => ({
    name: entry.name,
    bytes: statSync(resolve(videosDirectory, entry.name)).size
  }))
  const aggregateBytes = videoSizes.reduce(
    (totalBytes, video) => totalBytes + video.bytes,
    0
  )

  assert.ok(
    aggregateBytes >= minHighQualityDeliveryVideoAggregateBytes,
    `Video aggregate is ${(aggregateBytes / bytesPerMiB).toFixed(1)} MiB, below the 150 MiB high-quality delivery floor`
  )
  assert.ok(
    aggregateBytes <= maxHighQualityDeliveryVideoAggregateBytes,
    `Video aggregate is ${(aggregateBytes / bytesPerMiB).toFixed(1)} MiB, above the 320 MiB high-quality delivery ceiling`
  )

  for (const video of videoSizes) {
    assert.ok(
      video.bytes <= maxHighQualityDeliveryVideoBytes,
      `${video.name} exceeds the 80 MiB high-quality delivery ceiling`
    )
  }
})

test("media records match their runtime kind contract", () => {
  const photos = mediaItems.filter((item) => item.kind === "photo")
  const videos = mediaItems.filter((item) => item.kind === "video")

  assert.ok(photos.every((item) => item.video === undefined))
  assert.ok(
    videos.every(
      (item) =>
        item.video &&
        item.duration &&
        item.duration !== "00:00" &&
        /^\d+(?:\.\d+)?s$/.test(item.duration) &&
        Number.parseFloat(item.duration) > 0
    )
  )

  for (const item of videos) {
    const sourceDuration = getMp4DurationInSeconds(
      resolve(publicDirectory, getLocalMediaPath(item.video).slice(1))
    )

    assert.ok(sourceDuration > 0, `Video has no duration: ${item.slug}`)
    assert.equal(
      Math.round(sourceDuration * 10) / 10,
      Number.parseFloat(item.duration),
      `Displayed duration is not derived from ${item.slug}`
    )
  }
})

test("negative related-media counts return no records", () => {
  assert.deepEqual(getRelatedMedia(mediaItems[0]!.slug, -1), [])
})

test("media neighbors wrap around the first and last records", () => {
  const first = mediaItems[0]
  const last = mediaItems.at(-1)

  assert.ok(first)
  assert.ok(last)
  assert.equal(getMediaNeighbors(first.slug)?.previous, last)
  assert.equal(getMediaNeighbors(last.slug)?.next, first)
})
