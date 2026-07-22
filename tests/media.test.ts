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
  getFeaturedMedia,
  getMediaCategories,
  getMediaKindLabel,
  getMediaNeighbors,
  getRelatedMedia,
  mediaItems
} from "../lib/media"

const publicDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "../public")
const bytesPerMiB = 1024 * 1024
const minVideoAggregateBytes = 400 * bytesPerMiB
const maxVideoAggregateBytes = 1.1 * 1024 * bytesPerMiB
const maxShortVideoBytes = 80 * bytesPerMiB
const maxVlogVideoBytes = 750 * bytesPerMiB

const expectedVideoAssets = [
  "gh010090",
  "gh010091",
  "gh010092",
  "gh010093",
  "gh010096",
  "gh010103",
  "gh010105",
  "gh010110",
  "gh010116",
  "gh010124",
  "gh010130",
  "gh010137",
  "gh010141",
  "gh010146",
  "gh010154",
  "gh010173",
  "gh010230",
  "gh010246",
  "gh010263",
  "one-leaf-two-millennia"
] as const

const expectedPhotoAssets = [
  "a-moment-at-the-tea-table.jpg",
  "a-retreat-for-wellbeing.jpg",
  "ancient-archway-in-the-woods.jpg",
  "tea-garden-in-mist.jpg",
  "world-tea-culture-museum.jpg"
] as const

const expectedPosterPages = {
  "origin-of-tea": ["/media/posters/origin-of-tea.png"],
  "tea-and-nature-in-harmony": [
    "/media/posters/tea-and-nature-01.png",
    "/media/posters/tea-and-nature-02.png"
  ],
  "tea-picking-through-the-solar-terms": [
    "/media/posters/solar-terms-picking-01.png",
    "/media/posters/solar-terms-picking-02.png"
  ],
  "chinese-tea-hospitality": [
    "/media/posters/tea-hospitality-01.png",
    "/media/posters/tea-hospitality-02.png"
  ]
} as const

const expectedPosterThumbnails = {
  "origin-of-tea": "/media/posters/origin-of-tea-thumb.webp",
  "tea-and-nature-in-harmony": "/media/posters/tea-and-nature-thumb.webp",
  "tea-picking-through-the-solar-terms": "/media/posters/solar-terms-picking-thumb.webp",
  "chinese-tea-hospitality": "/media/posters/tea-hospitality-thumb.webp"
} as const

const expectedSlugs = [
  "one-leaf-two-millennia",
  "mengding-mountain-gateway",
  "tea-ancestor-hometown-signposts",
  "tea-summit-landmark",
  "national-tourist-attraction-marker",
  "waterfall-and-lily-pond",
  "valley-overlook",
  "early-summer-tea-garden",
  "ancient-tea-tree-of-mengding",
  "tea-garden-in-mist",
  "tea-ancestor-relief",
  "forest-inscription",
  "forest-stone-steps",
  "red-ribbons-of-wishes",
  "red-gate-of-mengding",
  "visitors-at-the-mountain-gate",
  "dragon-carved-rock-wall",
  "new-tea-shoots",
  "sorting-fresh-leaves",
  "finished-tea-examined",
  "ancient-archway-in-the-woods",
  "world-tea-culture-museum",
  "a-moment-at-the-tea-table",
  "tea-garden-in-mist-photo",
  "a-retreat-for-wellbeing-photo",
  "origin-of-tea",
  "tea-and-nature-in-harmony",
  "tea-picking-through-the-solar-terms",
  "chinese-tea-hospitality"
] as const

const allowedCategories = new Set([
  "景区地标 / Mountain Landmarks",
  "山水茶园 / Mountain & Tea Gardens",
  "茶事劳作 / Tea Work",
  "茶文化遗产 / Tea Heritage",
  "山间人文 / Mountain Life"
])

function getLocalMediaPath(mediaUrl: string): string {
  const pathname = new URL(mediaUrl, "https://local-media.invalid").pathname
  const mediaPathIndex = pathname.indexOf("/media/")

  assert.notEqual(mediaPathIndex, -1, `Expected a /media/ path: ${mediaUrl}`)
  return pathname.slice(mediaPathIndex)
}

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

test("media index contains the exact refreshed 29-record archive", () => {
  const slugs = mediaItems.map((item) => item.slug)
  const homeOrders = mediaItems.map((item) => item.homeOrder)

  assert.equal(mediaItems.length, 29)
  assert.deepEqual(slugs, expectedSlugs)
  assert.equal(new Set(homeOrders).size, 29)
  assert.ok(mediaItems.every((item) => item.titleZh.trim().length > 0))
  assert.ok(mediaItems.every((item) => item.titleEn.trim().length > 0))
})

test("media index has 20 video, 5 photo, and 4 poster records", () => {
  assert.equal(mediaItems.filter((item) => item.kind === "video").length, 20)
  assert.equal(mediaItems.filter((item) => item.kind === "photo").length, 5)
  assert.equal(mediaItems.filter((item) => item.kind === "poster").length, 4)
})

test("one leaf two millennia has the approved bilingual Vlog metadata", () => {
  const vlog = mediaItems.find((item) => item.slug === "one-leaf-two-millennia")

  assert.ok(vlog)
  assert.equal(vlog.kind, "video")
  assert.equal(vlog.titleZh, "一叶千年")
  assert.equal(vlog.titleEn, "One Leaf, Two Millennia")
  assert.equal(vlog.categoryZh, "茶文化遗产")
  assert.equal(vlog.categoryEn, "Tea Heritage")
  assert.equal(
    vlog.descriptionZh,
    "从公元前53年的起源叙事、云雾茶园与皇茶园，到手工采制和当代博物馆，串起蒙顶茶跨越两千年的传承。"
  )
  assert.equal(
    vlog.descriptionEn,
    "From its origin story in 53 BCE through misty tea gardens, imperial cultivation, handcraft, and the modern museum, the film traces two millennia of Mengding tea heritage."
  )
  assert.equal(vlog.duration, "485.0s")
  assert.equal(getLocalMediaPath(vlog.video), "/media/videos/one-leaf-two-millennia.mp4")
  assert.equal(getLocalMediaPath(vlog.poster), "/media/posters/one-leaf-two-millennia.jpg")
})

test("featured home media is the approved five-part heritage story", () => {
  assert.deepEqual(
    getFeaturedMedia().map((item) => item.slug),
    [
      "one-leaf-two-millennia",
      "ancient-tea-tree-of-mengding",
      "red-gate-of-mengding",
      "sorting-fresh-leaves",
      "tea-ancestor-relief"
    ]
  )
})

test("media kind labels are bilingual", () => {
  assert.equal(getMediaKindLabel("video"), "视频 / Video")
  assert.equal(getMediaKindLabel("photo"), "图片 / Photo")
  assert.equal(getMediaKindLabel("poster"), "海报 / Poster")
})

test("every record uses an approved bilingual category and reviewed rights", () => {
  assert.ok(
    mediaItems.every((item) =>
      allowedCategories.has(`${item.categoryZh} / ${item.categoryEn}`)
    )
  )
  assert.ok(
    mediaItems.every(
      (item) => item.rights === "权利状态已审核 / Rights status reviewed"
    )
  )
})

test("the refreshed catalog uses the exact approved local assets", () => {
  const videos = mediaItems.filter((item) => item.kind === "video")
  const photos = mediaItems.filter((item) => item.kind === "photo")

  assert.deepEqual(
    new Set(
      videos.map((item) =>
        getLocalMediaPath(item.video)
          .replace("/media/videos/", "")
          .replace(".mp4", "")
      )
    ),
    new Set(expectedVideoAssets)
  )
  assert.deepEqual(
    new Set(
      photos.map((item) => getLocalMediaPath(item.poster).replace("/media/photos/", ""))
    ),
    new Set(expectedPhotoAssets)
  )
})

test("poster records expose their exact full-resolution page sets", () => {
  const posters = mediaItems.filter((item) => item.kind === "poster")

  for (const item of posters) {
    const slug = item.slug as keyof typeof expectedPosterPages
    assert.equal(item.categoryZh, "茶文化遗产")
    assert.equal(item.categoryEn, "Tea Heritage")
    assert.equal(getLocalMediaPath(item.poster), expectedPosterThumbnails[slug])
    assert.deepEqual(item.pages.map(getLocalMediaPath), expectedPosterPages[slug])
    assert.equal(item.assetCount, item.pages.length)
  }
})

test("kind filters only return matching archive records", () => {
  for (const kind of ["video", "photo", "poster"] as const) {
    const items = filterMedia(mediaItems, { kind })
    assert.ok(items.length > 0)
    assert.ok(items.every((item) => item.kind === kind))
  }
})

test("query and category filters only return matching archive records", () => {
  const queried = filterMedia(mediaItems, { query: "tea garden" })
  const teaWork = filterMedia(mediaItems, { category: "Tea Work" })

  assert.ok(queried.length > 0)
  assert.ok(
    queried.every((item) =>
      `${item.titleEn} ${item.categoryEn} ${item.tags.join(" ")}`
        .toLowerCase()
        .includes("tea garden")
    )
  )
  assert.ok(teaWork.length > 0)
  assert.ok(teaWork.every((item) => item.categoryEn === "Tea Work"))
})

test("media categories are unique and source ordered", () => {
  const categories = getMediaCategories(mediaItems)

  assert.equal(categories.length, new Set(categories.map((category) => category.value)).size)
  assert.equal(categories[0]?.value, mediaItems[0]?.categoryEn)
  assert.ok(
    categories.some((category) => category.value === "Tea Work" && category.count > 0)
  )
})

test("every catalog path resolves to a local public file", () => {
  for (const item of mediaItems) {
    const posterPath = getLocalMediaPath(item.poster)

    assert.ok(
      existsSync(resolve(publicDirectory, posterPath.slice(1))),
      `Missing poster for ${item.slug}: ${item.poster}`
    )

    if (item.kind === "video") {
      const videoPath = getLocalMediaPath(item.video)
      assert.ok(videoPath.startsWith("/media/videos/"))
      assert.ok(videoPath.endsWith(".mp4"))
      assert.ok(
        existsSync(resolve(publicDirectory, videoPath.slice(1))),
        `Missing video for ${item.slug}: ${item.video}`
      )
    } else if (item.kind === "photo") {
      assert.ok(posterPath.startsWith("/media/photos/"))
      assert.ok(posterPath.endsWith(".jpg"))
    } else {
      assert.ok(posterPath.startsWith("/media/posters/"))
      assert.ok(posterPath.endsWith(".webp"))
      for (const page of item.pages) {
        const pagePath = getLocalMediaPath(page)
        assert.ok(pagePath.endsWith(".png"))
        assert.ok(existsSync(resolve(publicDirectory, pagePath.slice(1))))
      }
    }
  }
})

test("public media contains exactly the approved refreshed assets", () => {
  const photos = readdirSync(resolve(publicDirectory, "media/photos"), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort()
  const videos = readdirSync(resolve(publicDirectory, "media/videos"), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort()
  const posters = readdirSync(resolve(publicDirectory, "media/posters"), { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort()

  const expectedPosters = [
    ...expectedVideoAssets.map((asset) => `${asset}.jpg`),
    ...Object.values(expectedPosterThumbnails).map((path) => path.split("/").at(-1)!),
    ...Object.values(expectedPosterPages).flat().map((path) => path.split("/").at(-1)!)
  ].sort()

  assert.deepEqual(photos, [...expectedPhotoAssets].sort())
  assert.deepEqual(videos, expectedVideoAssets.map((asset) => `${asset}.mp4`).sort())
  assert.deepEqual(posters, expectedPosters)
})

test("delivery videos stay within the refreshed high-quality size envelope", () => {
  const videosDirectory = resolve(publicDirectory, "media/videos")
  const videoSizes = readdirSync(videosDirectory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".mp4"))
    .map((entry) => ({
      name: entry.name,
      bytes: statSync(resolve(videosDirectory, entry.name)).size
    }))
  const aggregateBytes = videoSizes.reduce((total, video) => total + video.bytes, 0)

  assert.equal(videoSizes.length, 20)
  assert.ok(
    aggregateBytes >= minVideoAggregateBytes,
    `Video aggregate is ${(aggregateBytes / bytesPerMiB).toFixed(1)} MiB, below 400 MiB`
  )
  assert.ok(
    aggregateBytes <= maxVideoAggregateBytes,
    `Video aggregate is ${(aggregateBytes / bytesPerMiB).toFixed(1)} MiB, above 1.1 GiB`
  )

  for (const video of videoSizes) {
    const ceiling =
      video.name === "one-leaf-two-millennia.mp4"
        ? maxVlogVideoBytes
        : maxShortVideoBytes
    assert.ok(
      video.bytes <= ceiling,
      `${video.name} exceeds its ${(ceiling / bytesPerMiB).toFixed(0)} MiB ceiling`
    )
  }
})

test("media records match their runtime kind contract", () => {
  const photos = mediaItems.filter((item) => item.kind === "photo")
  const videos = mediaItems.filter((item) => item.kind === "video")
  const posters = mediaItems.filter((item) => item.kind === "poster")

  assert.ok(photos.every((item) => item.video === undefined && item.duration === undefined))
  assert.ok(
    posters.every(
      (item) =>
        item.video === undefined &&
        item.duration === undefined &&
        item.pages.length > 0
    )
  )
  assert.ok(
    videos.every(
      (item) =>
        item.video &&
        item.duration &&
        /^\d+(?:\.\d+)?s$/.test(item.duration) &&
        Number.parseFloat(item.duration) > 0
    )
  )

  for (const item of videos) {
    const sourceDuration = getMp4DurationInSeconds(
      resolve(publicDirectory, getLocalMediaPath(item.video).slice(1))
    )

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
