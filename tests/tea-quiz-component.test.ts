import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const componentPath = resolve(projectRoot, "components/tea-quiz.tsx")

test("tea quiz maps the confirmed prototype start, question, and result stages", () => {
  assert.equal(existsSync(componentPath), true, "expected components/tea-quiz.tsx to exist")
  const source = readFileSync(componentPath, "utf8")

  assert.match(source, /^"use client"/)
  assert.match(source, /import Image from "next\/image"/)
  assert.match(source, /const quizActionClassName/)
  assert.match(source, /const subtleQuizActionClassName/)
  assert.match(source, /className="route-heading/)
  assert.match(source, /参与\s*\/\s*<span lang="en">ENGAGE<\/span>/)
  assert.match(source, /用十道题，读回影像与资料/)
  assert.match(source, /Ten questions lead back to images and sources/)
  assert.match(source, /src=\{resolveMediaUrl\("\/media\/posters\/gh010146\.jpg"\)\}/)
  assert.match(source, /className="start-grid/)
  assert.match(source, /min-h-\[484px\]/)
  assert.match(source, /rounded-\[14px\]/)
  assert.match(source, /className="start-aside/)
  assert.match(source, /你将得到的不是排名/)
  assert.match(source, /A score for this session/)
  assert.match(source, /Sources when you choose to open them/)
  assert.match(source, /Records stay on this device/)

  assert.match(source, /从可回查的资料出发/)
  assert.match(source, /className="question-stage/)
  assert.match(source, /className="question-count/)
  assert.match(source, /<fieldset/)
  assert.match(source, /<legend/)
  assert.match(source, /type="radio"/)
  assert.match(source, /aria-live="polite"/)
  assert.match(source, /QUESTION \{currentQuestionIndex \+ 1\} OF \{session\.length\}/)
  assert.match(source, /min-h-11/)
  assert.match(source, /border-\[#d6b45a\]\/70 bg-\[#d6b45a\]\/10 text-\[#f3d77d\]/)
  assert.match(source, /focus-within:border-\[#f2d37a\]/)
  assert.match(source, /focus-within:ring-2 focus-within:ring-\[#f2d37a\]\/70/)
  assert.match(source, /\["A", "B", "C", "D"\]\[optionIndex\]/)
  assert.match(source, /disabled=\{selectedIndex === null\}/)
  assert.match(source, /questionHeadingRef\.current\?\.focus\(\)/)
  assert.match(source, /resultHeadingRef\.current\?\.focus\(\)/)
})

test("tea quiz keeps programmatic reading-heading focus visually quiet", () => {
  assert.equal(existsSync(componentPath), true, "expected components/tea-quiz.tsx to exist")
  const source = readFileSync(componentPath, "utf8")

  assert.match(
    source,
    /<h2\s+id="quiz-question-heading"\s+ref=\{questionHeadingRef\}\s+tabIndex=\{-1\}\s+style=\{\{ outline: "none" \}\}/
  )
  assert.match(
    source,
    /<h2 id="quiz-result-heading" ref=\{resultHeadingRef\} tabIndex=\{-1\} style=\{\{ outline: "none" \}\}/
  )
})

test("tea quiz result follows the confirmed score panel, wrong summary, and secondary disclosure order", () => {
  assert.equal(existsSync(componentPath), true, "expected components/tea-quiz.tsx to exist")
  const source = readFileSync(componentPath, "utf8")

  const scorePanel = source.indexOf("score-panel")
  const scoreLabel = source.lastIndexOf("本轮得分")
  const missedQuestionSummary = source.indexOf("wrong-summary")
  const restartAction = source.indexOf("Start again")
  const resultNote = source.indexOf("Nothing is uploaded, ranked, or shared.")
  const completeAnswerKey = source.indexOf("Complete answer key and sources")

  assert.ok(scorePanel >= 0, "expected the prototype score panel")
  assert.ok(scoreLabel > scorePanel, "expected the score label inside the score panel")
  assert.ok(restartAction > scoreLabel, "expected restart action in the score panel")
  assert.ok(missedQuestionSummary > restartAction, "expected wrong summary after the score panel actions")
  assert.ok(resultNote > restartAction, "expected local-only result note below next actions")
  assert.ok(completeAnswerKey > resultNote, "expected full answer key below the prototype result note")
  assert.match(source, /这一轮的结果/)
  assert.match(source, /答对 \{score\} 题，\{missedQuestionCount\} 处可以再回看/)
  assert.match(source, /Find a tea/)
  assert.match(source, /aria-label="错题摘要 \/ Missed question summary"/)
  assert.doesNotMatch(source, /id="missed-question-summary-heading"/)
  assert.match(source, /const firstMissedQuestionIndex = session\.findIndex\(/)
  assert.match(source, /<details open=\{index === firstMissedQuestionIndex\}[^>]*>/)
  assert.match(source, /<summary[^>]*>[\s\S]*?错题 \{index \+ 1\}/)
  assert.match(source, /<summary[^>]*>[\s\S]*?Complete answer key and sources/)
  assert.match(source, /question\.source\.url/)
  assert.match(source, /\/media\/\$\{question\.mediaSlug\}/)
  assert.match(source, /local storage is unavailable/i)
  assert.match(source, /Clear saved records/)
  assert.doesNotMatch(source, /<video\b|\.mp4/i)
})

test("tea quiz announces local record changes, distinguishes source links, and labels English text", () => {
  const source = readFileSync(componentPath, "utf8")

  assert.match(source, /dispatchTeaQuizRecordsChanged/)
  assert.match(source, /question\.source\.type === "external"/)
  assert.match(source, /question\.source\.mediaSlug/)
  assert.match(source, /Project archive record/)
  assert.match(source, /role="status" aria-live="polite"/)
  assert.match(source, /<span lang="en"[^>]*>\s*\{currentQuestion\.promptEn\}\s*<\/span>/)
  assert.match(source, /<span lang="en"[^>]*>\{option\.en\}<\/span>/)
  assert.match(source, /lang="en" className=.*\{question\.explanationEn\}/)
  assert.match(source, /第 \{currentQuestionIndex \+ 1\} 题，共 \{session\.length\} 题/)
  assert.match(source, /<span lang="en">QUESTION \{currentQuestionIndex \+ 1\} OF \{session\.length\}<\/span>/)
})

test("tea quiz avoids a duplicate related-archive link when the archive source is the question media", () => {
  const source = readFileSync(componentPath, "utf8")

  assert.match(
    source,
    /const shouldShowRelatedArchiveItem = question\.source\.type !== "archive" \|\| question\.source\.mediaSlug !== question\.mediaSlug/
  )
  assert.match(
    source,
    /\{shouldShowRelatedArchiveItem \? \(\s*<Link\s+href=\{`\/media\/\$\{question\.mediaSlug\}`\}/
  )
})
