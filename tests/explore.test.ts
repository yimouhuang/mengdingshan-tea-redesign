import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const explorePagePath = resolve(projectRoot, "app/explore/page.tsx")

test("explore page composes the map with poster-only archive media", () => {
  assert.equal(existsSync(explorePagePath), true, "expected the explore page to exist")

  const source = readFileSync(explorePagePath, "utf8")

  assert.match(source, /ArchiveNav/)
  assert.match(source, /ExploreMapShell/)
  assert.match(source, /tea-garden-in-mist/)
  assert.match(source, /picking-new-tea-shoots/)
  assert.match(source, /tea-ancestor-relief/)
  assert.match(source, /Browse media/)
  assert.match(source, /src=\{item\.poster\}/)
  assert.match(source, /general regional context/)
  assert.doesNotMatch(source, /\bpriority\b/)
  assert.match(source, /<div className="mt-8">\s*<ExploreMapShell \/>\s*<\/div>/)
  assert.match(source.slice(source.indexOf("{exploreMedia.map")), /alt=""/)
  assert.doesNotMatch(source, /\.mp4/i)
  assert.doesNotMatch(source, /<video/i)
})
