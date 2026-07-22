import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const componentPath = resolve(projectRoot, "components/tea-profile.tsx")

function readComponent() {
  assert.equal(existsSync(componentPath), true, "expected components/tea-profile.tsx to exist")
  return readFileSync(componentPath, "utf8")
}

test("tea profile remains a client-side focus-managed seven-question radio flow", () => {
  const source = readComponent()

  assert.match(source, /^"use client"/)
  assert.match(source, /teaProfileQuestions/)
  assert.match(source, /<fieldset/)
  assert.match(source, /<legend/)
  assert.match(source, /type="radio"/)
  assert.match(source, /QUESTION \{currentQuestionIndex \+ 1\} OF 7/)
  assert.match(source, /disabled=\{selectedOptionId === null\}/)
  assert.match(source, /questionHeadingRef\.current\?\.focus\(\)/)
  assert.match(source, /resultHeadingRef\.current\?\.focus\(\)/)
  assert.match(source, /focus-within:border-\[#f2d37a\]/)
  assert.match(source, /focus-within:ring-2 focus-within:ring-\[#f2d37a\]\/70/)
})

test("tea profile keeps programmatic reading-heading focus visually quiet", () => {
  const source = readComponent()

  assert.match(
    source,
    /<h1\s+id="tea-profile-question-heading"\s+ref=\{questionHeadingRef\}\s+tabIndex=\{-1\}\s+style=\{\{ outline: "none" \}\}/
  )
  assert.match(
    source,
    /<h2 id="tea-profile-result-heading" ref=\{resultHeadingRef\} tabIndex=\{-1\} style=\{\{ outline: "none" \}\}/
  )
})

test("tea profile maps every state to the approved archive-led tea prototype", () => {
  const source = readComponent()
  const startAction = source.indexOf("Begin 7 prompts")
  const localRecord = source.indexOf("The latest completed record remains on this device.")
  const resultTop = source.indexOf('className="result-top')
  const resultActions = source.indexOf('className="result-actions')
  const detailGrid = source.indexOf('className="mt-10 grid')

  assert.match(source, /import Image from "next\/image"/)
  assert.match(source, /import Link from "next\/link"/)
  assert.match(source, /className="start-grid/)
  assert.match(source, /className="start-media/)
  assert.match(source, /src=\{resolveMediaUrl\("\/media\/photos\/a-moment-at-the-tea-table\.jpg"\)\}/)
  assert.match(source, /Archive photograph of objects and arrangement on a tea table\./)
  assert.match(source, /Begin with how you notice tea/)
  assert.match(source, /Begin 7 prompts/)
  assert.match(source, /className="start-aside/)
  assert.match(source, /Primary Mengding tea record/)
  assert.match(source, /One alternate record/)
  assert.match(source, /Traceable public source/)
  assert.match(source, /Cultural browsing only\./)
  assert.ok(startAction >= 0 && startAction < localRecord, "expected the start action before local-record copy")

  assert.match(source, /Exit/)
  assert.match(source, /className="question-stage/)
  assert.match(source, /className="question-count/)
  assert.match(source, /className="question-note/)
  assert.match(source, /option, optionIndex\) =>/)
  assert.match(source, /String\.fromCharCode\(65 \+ optionIndex\)/)
  assert.match(source, /answer-key/)
  assert.match(source, /className="question-actions/)

  assert.match(source, /className="result-top/)
  assert.match(source, /className="tea-result/)
  assert.match(source, /src=\{resolveMediaUrl\("\/media\/photos\/tea-garden-in-mist\.jpg"\)\}/)
  assert.match(source, /alt="Tea Garden in Mist, an archive photograph used as cultural context only\."/)
  assert.match(source, /PRIMARY/)
  assert.match(source, /result\.primary\.nameZh/)
  assert.match(source, /aria-labelledby="tea-profile-primary-nameplate"/)
  assert.match(source, /className="alternate/)
  assert.match(source, /ALTERNATE/)
  assert.match(source, /result\.alternate\.nameZh/)
  assert.match(source, /aria-labelledby="tea-profile-alternate-nameplate"/)
  assert.match(source, /Source record/)
  assert.match(source, /Related media/)
  assert.match(source, /href="\/media\/tea-garden-in-mist-photo"/)
  assert.ok(resultTop >= 0 && resultActions > resultTop, "expected result actions after the primary and alternate identity")
  assert.ok(detailGrid > resultActions, "expected detailed source records after result actions")
})

test("tea profile keeps the prototype media hierarchy inside its responsive state surfaces", () => {
  const source = readComponent()
  const startGridStart = source.indexOf('<div className="start-grid')
  const startGridEnd = source.indexOf("{latestRecord ?", startGridStart)
  const primaryStart = source.indexOf('<section className="tea-result')
  const alternateStart = source.indexOf('<section className="alternate', primaryStart)
  const resultNoteStart = source.indexOf('<p className="result-note', alternateStart)
  const startGrid = source.slice(startGridStart, startGridEnd)
  const primaryPanel = source.slice(primaryStart, alternateStart)
  const alternatePanel = source.slice(alternateStart, resultNoteStart)

  assert.match(source, /min-\[901px\]:grid-cols-\[minmax\(0,1\.15fr\)_minmax\(320px,0\.85fr\)\]/)
  assert.match(source, /min-\[901px\]:grid-cols-\[minmax\(0,1\.22fr\)_minmax\(280px,0\.78fr\)\]/)
  assert.match(source, /sizes="\(max-width: 900px\) calc\(100vw - 40px\), 58vw"/)
  assert.match(source, /sizes="\(max-width: 900px\) calc\(100vw - 40px\), 62vw"/)

  assert.match(startGrid, /a-moment-at-the-tea-table\.jpg/)
  assert.match(startGrid, /Begin 7 prompts/)
  assert.match(startGrid, /className="start-aside/)
  assert.match(primaryPanel, /tea-garden-in-mist\.jpg/)
  assert.match(primaryPanel, /<h3 id="tea-profile-primary-nameplate"/)
  assert.match(alternatePanel, /<h3 id="tea-profile-alternate-nameplate"/)

  assert.match(source, /className="z-\[-2\] object-cover/)
  assert.match(source, /className="absolute inset-0 z-\[-1\]/)
  assert.match(source, /className="relative z-0 start-media-copy/)
  assert.match(source, /className="relative z-0 tea-result-copy/)
})

test("tea profile preserves bounded records, source links, and local-only storage", () => {
  const source = readComponent()

  assert.match(source, /<h3 id="tea-profile-primary-nameplate"/)
  assert.match(source, /<h3 id="tea-profile-alternate-nameplate"/)
  assert.match(source, /Verified fact/)
  assert.match(source, /Editorial cultural experience/)
  assert.match(source, /profile\.source\.url/)
  assert.match(source, /profile\.source\.publisherZh/)
  assert.match(source, /profile\.source\.titleZh/)
  assert.match(source, /target="_blank"/)
  assert.match(source, /rel="noreferrer"/)
  assert.match(source, /result\.disclaimerZh/)
  assert.match(source, /result\.disclaimerEn/)
  assert.match(source, /parseTeaProfileRecord/)
  assert.match(source, /writeTeaProfileRecord/)
  assert.match(source, /window\.localStorage\.setItem/)
  assert.match(source, /role="status" aria-live="polite"/)
  assert.match(source, /Local storage is unavailable/i)
  assert.match(source, /function restartProfile\(\)/)
  assert.doesNotMatch(source, /localStorage\.removeItem|<video\b|<source\b|\.mp4|leaderboard|forum|\bcart\b|\bprice\b/i)
})
