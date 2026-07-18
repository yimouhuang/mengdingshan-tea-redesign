import assert from "node:assert/strict"
import test from "node:test"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

import { MediaLibraryBrowser } from "../components/media-library-browser"
import { mediaItems } from "../lib/media"

test("initial media library render contains every card with poster-only kind labels", () => {
  const html = renderToStaticMarkup(createElement(MediaLibraryBrowser))

  assert.match(html, /全部 \/ All/)
  assert.match(html, /图片 \/ Photo/)
  assert.match(html, /视频 \/ Video/)

  for (const item of mediaItems) {
    assert.ok(html.includes(`/media/${item.slug}`), `Missing card for ${item.slug}`)
    assert.ok(html.includes(item.archiveId), `Missing archive metadata for ${item.slug}`)
  }

  assert.doesNotMatch(html, /<video/i)
  assert.doesNotMatch(html, /<source/i)
  assert.doesNotMatch(html, /\.mp4/i)
})
