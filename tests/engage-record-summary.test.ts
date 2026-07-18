import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const componentPath = resolve(projectRoot, "components/engage-record-summary.tsx")
const engagePagePath = resolve(projectRoot, "app/engage/page.tsx")

test("engage record summary safely reads real local attempts after mount", () => {
  assert.equal(existsSync(componentPath), true, "expected components/engage-record-summary.tsx to exist")
  const source = readFileSync(componentPath, "utf8")

  assert.match(source, /^"use client"/)
  assert.match(source, /useEffect/)
  assert.match(source, /localStorage\.getItem\(storageKey\)/)
  assert.match(source, /parseQuizAttempts/)
  assert.match(source, /teaQuizRecordsChangedEvent/)
  assert.match(source, /addEventListener\(teaQuizRecordsChangedEvent, readRecords\)/)
  assert.match(source, /removeEventListener\(teaQuizRecordsChangedEvent, readRecords\)/)
  assert.match(source, /Latest result/)
  assert.match(source, /Best score/)
  assert.match(source, /No local results yet/)
  assert.match(source, /Local storage is unavailable/i)
  assert.match(source, /className\?: string/)
  assert.match(source, /className = "mt-10 max-w-4xl"/)
  assert.match(source, /\$\{className\}/)
  assert.match(source, /role="status" aria-live="polite"/)
})

test("engage record summary clears saved records with a real success state", () => {
  assert.equal(existsSync(componentPath), true, "expected components/engage-record-summary.tsx to exist")
  const source = readFileSync(componentPath, "utf8")

  assert.match(source, /localStorage\.removeItem\(storageKey\)/)
  assert.match(source, /dispatchTeaQuizRecordsChanged\(\)/)
  assert.match(source, /role="status" aria-live="polite"/)
  assert.match(source, /本机记录已清除/)
  assert.match(source, /Clear local records/)
})

test("engage hub keeps the local record summary off the participation entry", () => {
  const source = readFileSync(engagePagePath, "utf8")

  assert.doesNotMatch(source, /EngageRecordSummary/)
})
