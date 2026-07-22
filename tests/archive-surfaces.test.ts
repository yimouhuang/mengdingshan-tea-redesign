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
const mediaPageSource = readFileSync(
  resolve(projectRoot, "app/media/[slug]/page.tsx"),
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

function assertKindOnlyOverlay(overlay: string): void {
  assert.match(overlay, /\{getMediaKindLabel\(item\.kind\)\}/)
  assert.doesNotMatch(overlay, /item\.duration/)
  assert.doesNotMatch(overlay, /item\.assetCount/)
  assert.doesNotMatch(overlay, /00:00/)
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

test("home featured-card type overlay contains only the media kind label", () => {
  assertKindOnlyOverlay(cardTypeOverlay(homeSource, "{featured.map((item, index) => ("))
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
  assert.match(mediaPageSource, /<video[\s\S]*?<source/)
  assert.match(mediaPageSource, /item\.kind === "poster"/)
  assert.match(mediaPageSource, /relative aspect-video[\s\S]*?className="object-contain"/)
})

test("poster detail renders every portrait page in a responsive one-or-two-column grid", () => {
  assert.match(mediaPageSource, /item\.pages\.map\(\(page, index\) =>/)
  assert.match(mediaPageSource, /grid gap-3 p-3/)
  assert.match(mediaPageSource, /item\.pages\.length === 1[\s\S]*?mx-auto max-w-2xl[\s\S]*?md:grid-cols-2/)
  assert.match(mediaPageSource, /relative aspect-\[210\/297\] overflow-hidden bg-black/)
  assert.match(mediaPageSource, /src=\{page\}/)
  assert.match(mediaPageSource, /alt=\{`\$\{item\.titleZh\} \$\{index \+ 1\}`\}/)
  assert.match(mediaPageSource, /sizes="\(min-width: 1280px\) 35vw, 100vw"/)
})

test("media detail labels kinds centrally and reports poster page count", () => {
  assert.match(mediaPageSource, /getMediaKindLabel\(item\.kind\)/)
  assert.match(mediaPageSource, /item\.assetCount \?\? item\.pages\.length/)
  assert.match(mediaPageSource, /item\.duration/)
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
