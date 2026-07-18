import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import {
  DEFAULT_EXPLORE_MAP_STYLE_URL,
  EXPLORE_MAP_STYLE_URL,
  MENGDING_MAP_CENTER,
  MENGDING_MAP_ZOOM
} from "../lib/explore-map"

const mapPath = path.resolve(process.cwd(), "components/explore-map.tsx")
const mapShellPath = path.resolve(process.cwd(), "components/explore-map-shell.tsx")

test("explore map uses the configured general-view defaults and safe map surface", () => {
  assert.equal(DEFAULT_EXPLORE_MAP_STYLE_URL, "https://tiles.openfreemap.org/styles/liberty")
  assert.equal(EXPLORE_MAP_STYLE_URL, "https://tiles.openfreemap.org/styles/liberty")
  assert.deepEqual(MENGDING_MAP_CENTER, [103.046, 30.084])
  assert.equal(MENGDING_MAP_ZOOM, 12.2)

  assert.equal(fs.existsSync(mapPath), true, "expected the interactive map component to exist")
  const source = fs.readFileSync(mapPath, "utf8")

  assert.match(source, /const maplibregl = await import\("maplibre-gl"\)/)
  assert.doesNotMatch(source, /require\("maplibre-gl"\)/)
  assert.doesNotMatch(source, /import \* as maplibregl from "maplibre-gl"/)
  assert.match(source, /NavigationControl/)
  assert.match(source, /IntersectionObserver/)
  assert.match(source, /getBoundingClientRect/)
  assert.match(source, /window\.innerHeight/)
  assert.match(source, /ResizeObserver/)
  assert.match(source, /map\.resize\(\)/)
  assert.match(source, /Map service is temporarily unavailable\./)
  assert.match(source, /className="absolute inset-0 explore-map-canvas"/)
  assert.match(
    source,
    /\.explore-map-surface > \.explore-map-canvas\.maplibregl-map/
  )
  assert.match(source, /left-3 top-3 z-10/)
  assert.match(source, /md:bottom-3 md:top-auto/)
  assert.match(
    source,
    /\.explore-map-surface \.maplibregl-canvas\s*\{\s*filter: sepia\(/
  )
  assert.doesNotMatch(source, /\bas never\b/)
  assert.doesNotMatch(source, /attributionControl\s*:\s*(?:true|false)/)
  assert.doesNotMatch(source, /\bMarker\b/)
  assert.doesNotMatch(source, /\baddSource\b/)
  assert.doesNotMatch(source, /\.mp4/i)
  assert.doesNotMatch(source, /<video/i)

  const mapFrame = source.match(/<section className="([^"]+)">/)
  assert.ok(mapFrame, "expected the map to have a framed section")
  assert.match(mapFrame[1], /rounded-\[18px\]/)
  assert.match(mapFrame[1], /border/)
  assert.match(mapFrame[1], /border-white\/15/)

  assert.equal(fs.existsSync(mapShellPath), true, "expected the map shell to exist")
  const shellSource = fs.readFileSync(mapShellPath, "utf8")
  assert.match(shellSource, /import \{ ExploreMap \} from "\.\/explore-map"/)
  assert.match(shellSource, /return <ExploreMap \/>/)
  assert.doesNotMatch(shellSource, /next\/dynamic/)
  assert.doesNotMatch(shellSource, /Loading interactive map/)

  const fallbackCta = source.match(/<Link className="([^"]+)" href="\/library">/)
  assert.ok(fallbackCta, "expected a library fallback link")
  assert.doesNotMatch(fallbackCta[1], /rounded-full/)
  assert.doesNotMatch(fallbackCta[1], /bg-\[var\(--accent\)\]/)
  assert.match(fallbackCta[1], /border-\[#d6b45a\]\/55/)
  assert.match(fallbackCta[1], /bg-transparent/)
  assert.match(fallbackCta[1], /text-\[#f3d77d\]/)
  assert.match(fallbackCta[1], /hover:bg-\[#d6b45a\]\/10/)
  assert.match(fallbackCta[1], /active:translate-y-px/)
})
