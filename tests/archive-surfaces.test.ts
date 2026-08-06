import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const homeSource = readFileSync(resolve(projectRoot, "app/page.tsx"), "utf8")
const librarySource = readFileSync(
  resolve(projectRoot, "components/media-library-browser.tsx"),
  "utf8"
)
const archiveNavSource = readFileSync(resolve(projectRoot, "components/archive-nav.tsx"), "utf8")
const rootLayoutSource = readFileSync(resolve(projectRoot, "app/layout.tsx"), "utf8")
const mediaPageSource = readFileSync(
  resolve(projectRoot, "app/media/[slug]/page.tsx"),
  "utf8"
)
const archiveVideoSource = readFileSync(
  resolve(projectRoot, "components/archive-video.tsx"),
  "utf8"
)
const mediaActionsSource = readFileSync(
  resolve(projectRoot, "components/media-actions.tsx"),
  "utf8"
)

function cardTypeOverlay(source: string, cardMapStart: string): string {
  const cardStart = source.indexOf(cardMapStart)
  assert.notEqual(cardStart, -1, `Missing card map: ${cardMapStart}`)

  const overlayStart = source.indexOf("<span", cardStart)
  const overlayEnd = source.indexOf("</span>", overlayStart)

  assert.notEqual(overlayStart, -1, "Missing card type overlay")
  assert.notEqual(overlayEnd, -1, "Unclosed card type overlay")

  return source.slice(overlayStart, overlayEnd + "</span>".length)
}

function assertKindOnlyOverlay(overlay: string, itemName = "item"): void {
  assert.match(overlay, new RegExp(`\\{getMediaKindLabel\\(${itemName}\\.kind\\)\\}`))
  assert.doesNotMatch(overlay, new RegExp(`${itemName}\\.duration`))
  assert.doesNotMatch(overlay, new RegExp(`${itemName}\\.assetCount`))
  assert.doesNotMatch(overlay, /00:00/)
}

function originPosterCard(source: string): string {
  const posterStart = source.indexOf("src={homePosterUrl}")
  assert.notEqual(posterStart, -1, "Missing the home-only origin poster image")

  const cardStart = source.lastIndexOf("<article", posterStart)
  const cardEnd = source.indexOf("</article>", posterStart)

  assert.notEqual(cardStart, -1, "The home-only origin poster must use an article card")
  assert.notEqual(cardEnd, -1, "The home-only origin poster article must be closed")

  return source.slice(cardStart, cardEnd + "</article>".length)
}

test("home surface binds the mist garden record poster as its only priority image", () => {
  assert.match(homeSource, /getMediaItem\("tea-garden-in-mist"\)/)
  assert.match(homeSource, /src=\{hero\.poster\}/)
  assert.equal((homeSource.match(/\bpriority\b/g) ?? []).length, 1)
})

test("home hero keeps its copy above metadata in one normal-flow foreground layer", () => {
  const foregroundStart = homeSource.indexOf('data-testid="home-hero-foreground"')
  const copyStart = homeSource.indexOf('data-testid="home-hero-copy"')
  const metadataStart = homeSource.indexOf('data-testid="home-hero-metadata"')

  assert.notEqual(foregroundStart, -1, "Missing home hero foreground layer")
  assert.notEqual(copyStart, -1, "Missing home hero copy marker")
  assert.notEqual(metadataStart, -1, "Missing home hero metadata marker")
  assert.ok(copyStart < metadataStart, "Hero copy must precede metadata")

  const foregroundTag = homeSource.slice(homeSource.lastIndexOf("<div", foregroundStart), homeSource.indexOf(">", foregroundStart) + 1)
  const copyTag = homeSource.slice(homeSource.lastIndexOf("<div", copyStart), homeSource.indexOf(">", copyStart) + 1)
  const metadataTag = homeSource.slice(homeSource.lastIndexOf("<dl", metadataStart), homeSource.indexOf(">", metadataStart) + 1)

  assert.match(foregroundTag, /flex min-h-\[650px\] flex-col/)
  assert.match(copyTag, /mt-auto/)
  assert.match(copyTag, /pb-8/)
  assert.doesNotMatch(copyTag, /\babsolute\b|bottom-/)
  assert.doesNotMatch(metadataTag, /\babsolute\b|bottom-/)
})

test("home linked feature cards keep kind-only overlays", () => {
  assertKindOnlyOverlay(
    cardTypeOverlay(homeSource, 'href={`/media/${leadFeature.slug}`}'),
    "leadFeature"
  )
  assertKindOnlyOverlay(
    cardTypeOverlay(homeSource, "{supportingFeatures.map((item) => (")
  )
})

test("home places its origin poster between the lead Vlog and supporting archive cards", () => {
  const leadStart = homeSource.indexOf('href={`/media/${leadFeature.slug}`}')
  const posterStart = homeSource.indexOf("src={homePosterUrl}")
  const supportStart = homeSource.indexOf("supportingFeatures.map")

  assert.match(homeSource, /const \[leadFeature, \.\.\.supportingFeatures\] = featured/)
  assert.notEqual(leadStart, -1, "Missing the lead Vlog card")
  assert.notEqual(posterStart, -1, "Missing the home-only origin poster")
  assert.notEqual(supportStart, -1, "Missing the supporting archive cards")
  assert.ok(leadStart < posterStart, "The lead Vlog must precede the origin poster")
  assert.ok(posterStart < supportStart, "The origin poster must precede the supporting archive cards")
})

test("home renders the full-size origin poster as a contained two-row non-link article", () => {
  const card = originPosterCard(homeSource)

  assert.match(
    homeSource,
    /const homePosterUrl = resolveMediaUrl\("\/media\/posters\/origin-of-tea\.png"\)/
  )
  assert.match(card, /alt=".*The Origin of Tea"/)
  assert.match(card, /col-span-2/)
  assert.match(card, /sm:col-span-1/)
  assert.match(card, /row-span-2/)
  assert.match(
    card,
    /sizes="\(min-width: 1024px\) 25vw, \(min-width: 640px\) 50vw, 100vw"/
  )
  assert.match(card, /object-contain/)
  assert.doesNotMatch(card, /<Link\b/)
  assert.doesNotMatch(card, /href\s*=\s*(?:\{?['"`])?\/media\//)
})

test("library card type overlay contains only the media kind label", () => {
  assertKindOnlyOverlay(cardTypeOverlay(librarySource, "{results.map((item) => ("))
})

test("library browser remains poster-only", () => {
  assert.doesNotMatch(librarySource, /<video/i)
  assert.doesNotMatch(librarySource, /<source/i)
  assert.doesNotMatch(librarySource, /item\.video/)
  assert.doesNotMatch(librarySource, /\.mp4/)
})

test("media detail keeps dedicated video, photo, and poster render paths", () => {
  assert.match(mediaPageSource, /item\.kind === "video"/)
  assert.match(mediaPageSource, /<ArchiveVideo[\s\S]*?source=\{item\.video\}/)
  assert.match(archiveVideoSource, /<video[\s\S]*?<source/)
  assert.match(mediaPageSource, /item\.kind === "poster"/)
  assert.match(mediaPageSource, /relative aspect-video[\s\S]*?className="object-contain"/)
})

test("poster detail renders every portrait page in a responsive one-or-two-column grid", () => {
  assert.match(mediaPageSource, /item\.pages\.map\(\(page, index\) =>/)
  assert.match(mediaPageSource, /grid gap-3 p-3/)
  assert.match(mediaPageSource, /item\.pages\.length === 1[\s\S]*?mx-auto max-w-2xl[\s\S]*?md:grid-cols-2/)
  assert.match(mediaPageSource, /relative aspect-\[210\/297\] overflow-hidden bg-black/)
  assert.match(mediaPageSource, /src=\{page\}/)
  assert.match(mediaPageSource, /sizes="\(min-width: 1280px\) 35vw, 100vw"/)
})

test("media detail preserves established video and photo copy while labeling posters separately", () => {
  assert.match(mediaPageSource, /`视频 Video · \$\{item\.duration\}`/)
  assert.match(mediaPageSource, /"图片 Photo"/)
  assert.match(mediaPageSource, /item\.kind === "video"\s*\?\s*"视频 Video"/)
  assert.match(mediaPageSource, /item\.kind === "poster"\s*\?\s*"海报 Poster"/)
  assert.match(mediaPageSource, /"图片 Photos"/)
  assert.doesNotMatch(mediaPageSource, /getMediaKindLabel/)
})

test("poster detail uses singular page copy and bilingual page alt text", () => {
  assert.match(
    mediaPageSource,
    /item\.pages\.length === 1\s*\?\s*"1 页 \/ page"\s*:\s*`\$\{item\.assetCount \?\? item\.pages\.length\} 页 \/ pages`/
  )
  assert.match(
    mediaPageSource,
    /alt=\{`\$\{item\.titleZh\} \/ \$\{item\.titleEn\}，第 \$\{index \+ 1\} 页 \/ page \$\{index \+ 1\}`\}/
  )
})

test("related poster thumbnails fit while other media keeps its crop", () => {
  assert.match(
    mediaPageSource,
    /record\.kind === "poster"\s*\?\s*"object-contain bg-\[#080b08\]"\s*:\s*"object-cover"/
  )
})

test("media detail adds no design-system or third-party UI dependency", () => {
  const importSources = [...mediaPageSource.matchAll(/from\s+["']([^"']+)["']/g)].map(
    ([, source]) => source
  )

  assert.ok(
    importSources.every(source => source.startsWith("next/") || source.startsWith("@/")),
    `Unexpected third-party UI import: ${importSources.join(", ")}`
  )
})

test("navigation menu button describes its expanded state", () => {
  assert.match(
    archiveNavSource,
    /aria-label=\{open \? "Close navigation" : "Open navigation"\}/
  )
})

test("archive navigation renders each configured item as a link", () => {
  assert.doesNotMatch(archiveNavSource, /item\.unavailable/)
  assert.doesNotMatch(archiveNavSource, /item\.availabilityLabel/)
})

test("root layout mounts Vercel Web Analytics once for every archive route", () => {
  assert.match(rootLayoutSource, /from "@vercel\/analytics\/next"/)
  assert.equal((rootLayoutSource.match(/<Analytics \/>/g) ?? []).length, 1)
})

test("archive surface delegates detail favorite and share actions to the client component", () => {
  assert.match(mediaPageSource, /from ["']@\/components\/media-actions["']/)
  assert.match(mediaPageSource, /<MediaActions[\s\S]*?slug=\{item\.slug\}[\s\S]*?titleZh=\{item\.titleZh\}[\s\S]*?titleEn=\{item\.titleEn\}[\s\S]*?knownSlugs=\{mediaItems\.map\(\(record\) => record\.slug\)\}/)
  assert.doesNotMatch(mediaPageSource, /<button className="border border-white\/25 py-3">/)
})

test("media detail returns to the validated library URL carried by the selected card", () => {
  assert.match(mediaPageSource, /from ["']@\/components\/media-library-back-link["']/)
  assert.match(mediaPageSource, /<MediaLibraryBackLink \/>/)
})

test("favorite action is an accessible client control with same-tab feedback", () => {
  assert.match(mediaActionsSource, /^"use client"/)
  assert.match(mediaActionsSource, /getMediaFavoritesStorage\(window\)/)
  assert.match(mediaActionsSource, /readMediaFavorites\(storage, knownSlugs\)/)
  assert.match(mediaActionsSource, /toggleMediaFavorite\(\s*storage,\s*slug,\s*knownSlugs\s*\)/)
  assert.doesNotMatch(mediaActionsSource, /window\.localStorage/)
  assert.match(mediaActionsSource, /aria-pressed=\{isFavorite\}/)
  assert.match(mediaActionsSource, /☆ 加入收藏/)
  assert.match(mediaActionsSource, /★ 已收藏 \/ Saved/)
  assert.match(mediaActionsSource, /aria-live="polite"/)
  assert.match(mediaActionsSource, /已取消收藏 \/ Removed/)
  assert.match(mediaActionsSource, /if \(!result\.persisted\)[\s\S]*?收藏失败，请检查浏览器存储 \/ Unable to save favorite\.[\s\S]*?return/)
  assert.match(mediaActionsSource, /setIsFavorite\(result\.isFavorite\)/)
  assert.match(mediaActionsSource, /new CustomEvent\(MEDIA_FAVORITES_CHANGED_EVENT,[\s\S]*?detail: \{ favorites: result\.favorites \}/)
})

test("favorite action reports the existing failure when the localStorage getter is blocked", () => {
  const handlerStart = mediaActionsSource.indexOf("function handleFavorite()")
  const handlerEnd = mediaActionsSource.indexOf("async function handleShare()", handlerStart)

  assert.notEqual(handlerStart, -1, "Missing favorite handler")
  assert.notEqual(handlerEnd, -1, "Missing favorite handler end")

  const handler = mediaActionsSource.slice(handlerStart, handlerEnd)

  assert.match(handler, /const storage = getMediaFavoritesStorage\(window\)/)
  assert.match(handler, /if \(!storage\)[\s\S]*?Unable to save favorite\.[\s\S]*?return/)
})

test("share action delegates real browser behavior and maps every result", () => {
  assert.match(mediaActionsSource, /from ["']@\/lib\/media-share["']/)
  assert.match(mediaActionsSource, /shareMediaRecord\(navigator, buildMediaShareData\(titleZh, titleEn, window\.location\.href\)\)/)
  assert.match(mediaActionsSource, /已分享 \/ Shared/)
  assert.match(mediaActionsSource, /链接已复制 \/ Link copied/)
  assert.match(mediaActionsSource, /result === "aborted"/)
  assert.match(mediaActionsSource, /分享失败，请复制地址栏链接 \/ Unable to share\. Copy the address-bar link\./)

  const handlerIndex = mediaActionsSource.indexOf("async function handleShare()")
  const clearFeedbackIndex = mediaActionsSource.indexOf('setFeedback("")', handlerIndex)
  const shareIndex = mediaActionsSource.indexOf("shareMediaRecord(", handlerIndex)
  assert.ok(
    handlerIndex >= 0 && clearFeedbackIndex > handlerIndex && clearFeedbackIndex < shareIndex,
    "Share must clear stale feedback before starting"
  )
})
