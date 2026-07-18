import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const componentPath = resolve(projectRoot, "components/star-trail.tsx")
const layoutSource = readFileSync(resolve(projectRoot, "app/layout.tsx"), "utf8")
const globalCssSource = readFileSync(resolve(projectRoot, "app/globals.css"), "utf8")

test("the archive mounts one bounded star-trail layer from the root layout", () => {
  assert.ok(existsSync(componentPath), "Missing shared star-trail component")

  const componentSource = readFileSync(componentPath, "utf8")

  assert.match(layoutSource, /import \{ StarTrail \} from "@\/components\/star-trail"/)
  assert.match(layoutSource, /<StarTrail \/>/)
  assert.match(componentSource, /^"use client"/)
  assert.match(componentSource, /MAX_PARTICLES/)
  assert.match(componentSource, /pointermove/)
  assert.match(componentSource, /mousemove/)
  assert.match(componentSource, /\(pointer: fine\)/)
  assert.match(componentSource, /\(prefers-reduced-motion: reduce\)/)
  assert.match(componentSource, /pointer-events-none/)
})

test("the star trail keeps a visibly deep leading spark before it fades", () => {
  const componentSource = readFileSync(componentPath, "utf8")

  assert.match(componentSource, /const STAR_SIZES = \[4, 5, 6\]/)
  assert.match(componentSource, /const STAR_OPACITIES = \[0\.62, 0\.78, 0\.9\]/)
  assert.match(globalCssSource, /box-shadow: 0 0 12px 3px rgb\(214 180 90 \/ 0\.26\)/)
})
