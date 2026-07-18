import assert from "node:assert/strict"
import { existsSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const recordsModulePath = resolve(projectRoot, "lib/tea-quiz-records.ts")
const allowedQuestionIds = Array.from({ length: 10 }, (_, index) => `question-${index + 1}`)

function createAttempt(overrides: Partial<{
  completedAt: string
  score: number
  total: number
  questionIds: string[]
}> = {}) {
  return {
    completedAt: "2026-07-15T00:00:00.000Z",
    score: 8,
    total: 10,
    questionIds: allowedQuestionIds,
    ...overrides
  }
}

function serializeAttempts(attempts = [createAttempt()], version = 1) {
  return JSON.stringify({ version, attempts })
}

test("quiz records accept only the current version and a complete valid attempt", async () => {
  assert.equal(existsSync(recordsModulePath), true, "expected lib/tea-quiz-records.ts to exist")

  const { parseQuizAttempts, storageKey } = await import("../lib/tea-quiz-records")
  const validAttempt = createAttempt()

  assert.equal(storageKey, "mengdingshan-tea-quiz-v1")
  assert.deepEqual(parseQuizAttempts(null, allowedQuestionIds), [])
  assert.deepEqual(parseQuizAttempts("not json", allowedQuestionIds), [])
  assert.deepEqual(parseQuizAttempts(serializeAttempts([validAttempt], 2), allowedQuestionIds), [])
  assert.deepEqual(parseQuizAttempts(serializeAttempts([validAttempt]), allowedQuestionIds), [validAttempt])
})

test("quiz records reject payloads with more than twelve attempts", async () => {
  const { parseQuizAttempts } = await import("../lib/tea-quiz-records")
  const attempts = Array.from({ length: 13 }, () => createAttempt())

  assert.deepEqual(parseQuizAttempts(serializeAttempts(attempts), allowedQuestionIds), [])
})

test("quiz records reject attempts with a non-ISO completion timestamp", async () => {
  const { parseQuizAttempts } = await import("../lib/tea-quiz-records")

  assert.deepEqual(
    parseQuizAttempts(serializeAttempts([createAttempt({ completedAt: "15 July 2026" })]), allowedQuestionIds),
    []
  )
})

test("quiz records reject attempts whose total is not ten", async () => {
  const { parseQuizAttempts } = await import("../lib/tea-quiz-records")

  assert.deepEqual(parseQuizAttempts(serializeAttempts([createAttempt({ total: 9 })]), allowedQuestionIds), [])
})

test("quiz records reject non-integer and out-of-range scores", async () => {
  const { parseQuizAttempts } = await import("../lib/tea-quiz-records")

  for (const score of [-1, 10.5, 11]) {
    assert.deepEqual(parseQuizAttempts(serializeAttempts([createAttempt({ score })]), allowedQuestionIds), [])
  }
})

test("quiz records reject attempts without ten unique whitelisted question IDs", async () => {
  const { parseQuizAttempts } = await import("../lib/tea-quiz-records")

  assert.deepEqual(
    parseQuizAttempts(serializeAttempts([createAttempt({ questionIds: allowedQuestionIds.slice(0, 9) })]), allowedQuestionIds),
    []
  )
  assert.deepEqual(
    parseQuizAttempts(
      serializeAttempts([createAttempt({ questionIds: [...allowedQuestionIds.slice(0, 9), allowedQuestionIds[0]!] })]),
      allowedQuestionIds
    ),
    []
  )
  assert.deepEqual(
    parseQuizAttempts(
      serializeAttempts([createAttempt({ questionIds: [...allowedQuestionIds.slice(0, 9), "unknown-question"] })]),
      allowedQuestionIds
    ),
    []
  )
})

test("appending quiz records keeps newest first and caps the device history at twelve", async () => {
  assert.equal(existsSync(recordsModulePath), true, "expected lib/tea-quiz-records.ts to exist")

  const { appendQuizAttempt } = await import("../lib/tea-quiz-records")
  const attempts = Array.from({ length: 12 }, (_, index) =>
    createAttempt({ completedAt: `2026-07-${String(index + 1).padStart(2, "0")}T00:00:00.000Z` })
  )
  const newest = createAttempt({ completedAt: "2026-07-15T12:00:00.000Z", score: 10 })

  const result = appendQuizAttempt(attempts, newest)

  assert.equal(result.length, 12)
  assert.deepEqual(result[0], newest)
  assert.equal(result.at(-1)?.completedAt, "2026-07-11T00:00:00.000Z")
})

test("quiz record changes dispatch the exported same-tab event contract", async () => {
  const { dispatchTeaQuizRecordsChanged, teaQuizRecordsChangedEvent } = await import("../lib/tea-quiz-records")
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window")
  const eventTarget = new EventTarget()
  let received = 0

  eventTarget.addEventListener(teaQuizRecordsChangedEvent, () => {
    received += 1
  })
  Object.defineProperty(globalThis, "window", { configurable: true, value: eventTarget })

  try {
    dispatchTeaQuizRecordsChanged()
    assert.equal(teaQuizRecordsChangedEvent, "mengdingshan-tea-quiz-records-changed")
    assert.equal(received, 1)
  } finally {
    if (previousWindow) {
      Object.defineProperty(globalThis, "window", previousWindow)
    } else {
      delete (globalThis as { window?: unknown }).window
    }
  }
})
