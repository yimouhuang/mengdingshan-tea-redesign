import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import {
  AMBIENT_AUDIO_PATH,
  DEFAULT_AMBIENT_VOLUME,
  MAX_AMBIENT_VOLUME,
  clampAmbientVolume,
  shouldResumeAmbientAfterVideo
} from "../lib/ambient-audio"

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")

function readSource(relativePath: string): string {
  return readFileSync(resolve(repositoryRoot, relativePath), "utf8")
}

test("ambient audio exports the approved path and volume defaults", () => {
  assert.equal(AMBIENT_AUDIO_PATH, "/media/audio/mengdingshan-atmosphere.mp3")
  assert.equal(DEFAULT_AMBIENT_VOLUME, 0.12)
  assert.equal(MAX_AMBIENT_VOLUME, 0.25)
})

test("ambient volume clamps below the lower bound, preserves the default, and caps at the maximum", () => {
  assert.equal(clampAmbientVolume(-0.01), 0)
  assert.equal(clampAmbientVolume(0.12), 0.12)
  assert.equal(clampAmbientVolume(0.3), 0.25)
})

test("ambient volume safely falls back to the default for an invalid stored value", () => {
  assert.equal(clampAmbientVolume(Number.NaN), DEFAULT_AMBIENT_VOLUME)
})

test("ambient audio resumes after video only when it was enabled and paused for that video", () => {
  assert.equal(shouldResumeAmbientAfterVideo(true, true), true)
  assert.equal(shouldResumeAmbientAfterVideo(true, false), false)
  assert.equal(shouldResumeAmbientAfterVideo(false, true), false)
  assert.equal(shouldResumeAmbientAfterVideo(false, false), false)
})

test("ambient soundscape provider keeps audio opt-in, locally remembered, and accessible", () => {
  const relativePath = "components/ambient-soundscape.tsx"

  assert.ok(existsSync(resolve(repositoryRoot, relativePath)))
  const source = readSource(relativePath)

  assert.match(source, /^"use client"/)
  assert.match(source, /resolveMediaUrl\(AMBIENT_AUDIO_PATH\)/)
  assert.match(source, /<audio[^>]*loop[^>]*preload="none"/)
  assert.match(source, /localStorage/)
  assert.match(source, /aria-pressed/)
  assert.match(source, /min="0"/)
  assert.match(source, /max=\{MAX_AMBIENT_VOLUME\}/)
})

test("a saved soundscape preference is only a resume hint until this session successfully plays audio", () => {
  const source = readSource("components/ambient-soundscape.tsx")

  assert.match(source, /const \[resumeHint, setResumeHint\] = useState\(false\)/)
  assert.match(source, /setResumeHint\(storedEnabled\)/)
  assert.doesNotMatch(source, /enabledRef\.current = storedEnabled/)
  assert.doesNotMatch(source, /setEnabled\(storedEnabled\)/)
  assert.match(source, /const played = await playAudio\(\)/)
  assert.match(source, /if \(!played\) \{[\s\S]*?setEnabled\(false\)/)
  assert.match(source, /resumeHint \? "继续音景"/)
})

test("archive navigation exposes the global soundscape control before the language marker", () => {
  const source = readSource("components/archive-nav.tsx")

  assert.match(source, /AmbientSoundscapeControl/)
  assert.ok(source.indexOf("<AmbientSoundscapeControl") < source.indexOf("archive-language"))
})

test("archive video emits lifecycle events without changing hover-preview cards", () => {
  const videoPath = "components/archive-video.tsx"

  assert.ok(existsSync(resolve(repositoryRoot, videoPath)))
  const videoSource = readSource(videoPath)
  assert.match(videoSource, /onPlay/)
  assert.match(videoSource, /onPause/)
  assert.match(videoSource, /onEnded/)
  assert.match(videoSource, /useEffect/)
  assert.match(videoSource, /dispatchEvent/)

  const lazyVideoSource = readSource("components/lazy-video-card.tsx")
  assert.doesNotMatch(lazyVideoSource, /ambient-video/)
})

test("only the detail video uses the archive video wrapper", () => {
  const mediaPageSource = readSource("app/media/[slug]/page.tsx")

  assert.match(mediaPageSource, /import \{ ArchiveVideo \} from "@\/components\/archive-video"/)
  assert.match(mediaPageSource, /<ArchiveVideo/)
})
