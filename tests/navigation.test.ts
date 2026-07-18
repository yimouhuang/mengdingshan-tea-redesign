import assert from "node:assert/strict"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import { archiveNavItems, isArchiveNavItemActive } from "../lib/archive-navigation"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const archiveNavSource = readFileSync(resolve(projectRoot, "components/archive-nav.tsx"), "utf8")

test("archive navigation contains the four primary destinations", () => {
  assert.deepEqual(
    archiveNavItems,
    [
      { labelZh: "首页", labelEn: "Home", href: "/" },
      { labelZh: "影像", labelEn: "Media", href: "/library" },
      { labelZh: "探索", labelEn: "Explore", href: "/explore" },
      { labelZh: "参与", labelEn: "Engage", href: "/engage" }
    ]
  )
})

test("archive navigation labels every destination in Chinese and English", () => {
  for (const item of archiveNavItems) {
    assert.ok(item.labelZh.length > 0)
    assert.ok(item.labelEn.length > 0)
  }
})

test("archive navigation active state only matches available routes", () => {
  assert.equal(isArchiveNavItemActive("/", "/"), true)
  assert.equal(isArchiveNavItemActive("/library", "/library"), true)
  assert.equal(isArchiveNavItemActive("/", "/library"), false)
  assert.equal(isArchiveNavItemActive("/library", "/media/mengding-mountain-gateway"), false)
  assert.equal(isArchiveNavItemActive("/explore", "/explore"), true)
  assert.equal(isArchiveNavItemActive("/engage", "/engage"), true)
  assert.equal(isArchiveNavItemActive("/engage", "/engage/quiz"), true)
  assert.equal(isArchiveNavItemActive("/", "/engage"), false)
  assert.equal(isArchiveNavItemActive("/", "/engage/quiz"), false)
  assert.equal(isArchiveNavItemActive(undefined, "/"), false)
  assert.equal(isArchiveNavItemActive(undefined, "/library"), false)
})

test("archive navigation marks only the current route as the current page", () => {
  assert.match(
    archiveNavSource,
    /aria-current=\{active \? "page" : undefined\}/
  )
})
