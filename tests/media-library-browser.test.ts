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
    getMediaKindLabel("poster")
  ]

  assert.equal((filterMarkup.match(/<button/g) ?? []).length, 4)
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
