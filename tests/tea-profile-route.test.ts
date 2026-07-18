import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const profileRoutePath = resolve(projectRoot, "app/engage/tea-profile/page.tsx")

test("tea-profile is a minimal archive shell that delegates its stage-specific prototype headings", () => {
  assert.equal(existsSync(profileRoutePath), true, "expected app/engage/tea-profile/page.tsx to exist")
  const source = readFileSync(profileRoutePath, "utf8")

  assert.match(source, /ArchiveNav/)
  assert.match(source, /TeaProfile/)
  assert.doesNotMatch(source, /<h1/)
  assert.doesNotMatch(source, /Source boundary|local results/i)
  assert.doesNotMatch(source, /<video\b|\.mp4|leaderboard|forum|\bprice\b|\bcart\b/i)
})
