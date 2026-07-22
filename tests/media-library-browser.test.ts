import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { MediaLibraryBrowser } from "../components/media-library-browser"
import { getMediaKindLabel, mediaItems } from "../lib/media"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const librarySource = readFileSync(
  resolve(projectRoot, "components/media-library-browser.tsx"),
  "utf8"
)

function getLibraryFilterSource(): string {
  const start = librarySource.indexOf("const libraryKindFilters")
  const end = librarySource.indexOf("export function MediaLibraryBrowser", start)

  assert.notEqual(start, -1, "Missing library kind filters")
  assert.notEqual(end, -1, "Missing media library browser export")

  return librarySource.slice(start, end)
}

function getKindFilterMarkup(html: string): string {
  const start = html.indexOf('role="group"')
  const end = html.indexOf("</div>", start)

  assert.notEqual(start, -1, "Missing rendered media type filter")
  assert.notEqual(end, -1, "Unclosed rendered media type filter")

  return html.slice(start, end)
}

test("initial media library render contains every card with poster-only kind labels", () => {
  const html = renderToStaticMarkup(createElement(MediaLibraryBrowser))
  const filterMarkup = getKindFilterMarkup(html)
  const filterLabels = [
    "全部 / All",
    getMediaKindLabel("photo"),
    getMediaKindLabel("video"),
    getMediaKindLabel("poster"),
    "收藏 / Favorites"
  ]

  assert.equal((filterMarkup.match(/<button/g) ?? []).length, 5)
  let previousLabelIndex = -1
  for (const label of filterLabels) {
    const labelIndex = filterMarkup.indexOf(label)
    assert.ok(labelIndex > previousLabelIndex, `Missing or out-of-order filter: ${label}`)
    previousLabelIndex = labelIndex
  }

  for (const item of mediaItems) {
    assert.ok(html.includes(`/media/${item.slug}`), `Missing card for ${item.slug}`)
    assert.ok(html.includes(item.archiveId), `Missing archive metadata for ${item.slug}`)
  }

  assert.doesNotMatch(html, /<video/i)
  assert.doesNotMatch(html, /<source/i)
  assert.doesNotMatch(html, /\.mp4/i)
})

test("library exposes all, photo, video, and poster filters in order", () => {
  const filterSource = getLibraryFilterSource()
  const filterValues = [...filterSource.matchAll(/value:\s*"([^"]+)"/g)].map(
    ([, value]) => value
  )

  assert.deepEqual(filterValues, ["all", "photo", "video", "poster"])
  assert.match(
    filterSource,
    /\{ value: "poster", label: getMediaKindLabel\("poster"\) \}/
  )
})

test("library fits poster cards without changing photo and video crop behavior", () => {
  assert.match(
    librarySource,
    /className=\{item\.kind === "poster"\s*\?\s*"object-contain bg-\[#080b08\] transition duration-500 group-hover:scale-\[1\.02\]"\s*:\s*"object-cover transition duration-500 group-hover:scale-105"\s*\}/
  )
})

test("library introduction includes photo, video, and poster records", () => {
  assert.match(
    librarySource,
    /浏览蒙顶山茶的图片、视频与海报档案 \/ Browse the photo, video, and poster archive\./
  )
})

test("favorite library filter intersects the existing archive filters without changing kind", () => {
  assert.match(librarySource, /const \[favoritesOnly, setFavoritesOnly\] = useState\(false\)/)
  assert.match(librarySource, /filterMedia\(mediaItems,[\s\S]*?favoritesOnly[\s\S]*?filtered\.filter\([\s\S]*?favoriteSlugs\.has\(item\.slug\)/)

  const favoritePressed = librarySource.indexOf("aria-pressed={favoritesOnly}")
  const favoriteButtonStart = librarySource.lastIndexOf("<button", favoritePressed)
  const favoriteButtonEnd = librarySource.indexOf("</button>", favoritePressed)

  assert.notEqual(favoritePressed, -1, "Missing favorites filter button")
  assert.notEqual(favoriteButtonStart, -1, "Missing favorites filter button start")
  assert.notEqual(favoriteButtonEnd, -1, "Missing favorites filter button end")

  const favoriteButton = librarySource.slice(
    favoriteButtonStart,
    favoriteButtonEnd + "</button>".length
  )

  assert.match(favoriteButton, /收藏 \/ Favorites/)
  assert.match(favoriteButton, /replaceLibraryState\(\{ favoritesOnly: !favoritesOnly \}\)/)
  assert.doesNotMatch(favoriteButton, /setKind/)
})

test("favorite library state synchronizes from storage and same-tab changes with cleanup", () => {
  assert.ok(librarySource.includes("MEDIA_FAVORITES_STORAGE_KEY"))
  assert.ok(librarySource.includes("MEDIA_FAVORITES_CHANGED_EVENT"))
  assert.match(librarySource, /const storage = getMediaFavoritesStorage\(window\)/)
  assert.match(librarySource, /storage \? readMediaFavorites\(storage, knownSlugs\) : \[\]/)
  assert.doesNotMatch(librarySource, /window\.localStorage/)
  assert.match(librarySource, /addEventListener\("storage", handleStorage\)/)
  assert.match(librarySource, /event\.storageArea && event\.storageArea !== storage/)
  assert.match(librarySource, /event\.key === null[\s\S]*?syncFavorites\(\)[\s\S]*?return/)
  assert.match(librarySource, /event\.key !== MEDIA_FAVORITES_STORAGE_KEY/)
  assert.match(librarySource, /addEventListener\(MEDIA_FAVORITES_CHANGED_EVENT, handleFavoritesChanged\)/)
  assert.match(librarySource, /removeEventListener\("storage", handleStorage\)/)
  assert.match(librarySource, /removeEventListener\(MEDIA_FAVORITES_CHANGED_EVENT, handleFavoritesChanged\)/)
})

test("favorite library filter participates in default state, reset, and empty copy", () => {
  assert.match(librarySource, /const isDefault =[\s\S]*?!favoritesOnly/)
  assert.match(librarySource, /function resetFilters\(\)[\s\S]*?favoritesOnly: false/)
  assert.match(librarySource, /shouldShowNoSavedMedia\(favoritesOnly, favoriteSlugs\)/)
  assert.match(librarySource, /showNoSavedMedia \? "尚未收藏影像 \/ No saved records" : "未找到匹配档案 \/ No matching records"/)
  assert.match(librarySource, /尚未收藏影像 \/ No saved records/)
  assert.match(librarySource, /收藏仅保存在当前浏览器 \/ Favorites stay in this browser\./)
  assert.match(librarySource, /No matching records/)
})

test("library cards carry the current URL view state into media details", () => {
  assert.match(librarySource, /readLibraryState\(new URLSearchParams\(window\.location\.search\)\)/)
  assert.match(librarySource, /window\.history\.replaceState\(null, "", getLibraryHref\(nextState\)\)/)
  assert.match(librarySource, /href=\{getMediaDetailHref\(item\.slug, libraryState\)\}/)
})

test("library restores URL view state before its first browser paint", () => {
  assert.match(librarySource, /useLayoutEffect/)
  assert.match(librarySource, /useLayoutEffect\(\(\) => \{[\s\S]*?syncLibraryState\(\)/)
})
