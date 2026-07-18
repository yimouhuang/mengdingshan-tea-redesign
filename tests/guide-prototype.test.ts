import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"

const routePath = path.resolve(process.cwd(), "app/guide-prototype/page.tsx")

test("guide prototype is a poster-only, six-stop archive route", () => {
  assert.equal(
    fs.existsSync(routePath),
    true,
    "expected the isolated guide prototype route to exist"
  )

  const source = fs.readFileSync(routePath, "utf8")
  const requiredSlugs = [
    "mengding-mountain-gateway",
    "tea-summit-landmark",
    "tea-garden-in-mist",
    "ancient-tea-tree-of-mengding",
    "picking-new-tea-shoots",
    "tea-ancestor-relief"
  ]

  assert.match(source, /getMediaItem/)
  requiredSlugs.forEach((slug) => assert.match(source, new RegExp(slug)))
  assert.match(source, /Static guide concept/)
  assert.match(source, /Route node/)
  assert.match(source, /Follow the route/)
  assert.match(
    source,
    /index % 2 === 0[\s\S]*?sm:top-12/,
    "expected alternate route nodes to have a distinct desktop vertical offset"
  )
  assert.match(source, /Audio guide — coming later/)
  assert.match(source, /\.poster/)
  assert.doesNotMatch(source, /<video/i)
  assert.doesNotMatch(source, /\.mp4/i)
  assert.doesNotMatch(source, /\bpriority\b/)
})
