export const storageKey = "mengdingshan-tea-quiz-v1"
export const quizRecordsVersion = 1
export const maxQuizAttempts = 12
export const teaQuizRecordsChangedEvent = "mengdingshan-tea-quiz-records-changed"

export function dispatchTeaQuizRecordsChanged() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(teaQuizRecordsChangedEvent))
  }
}

export type TeaQuizAttempt = {
  completedAt: string
  score: number
  total: number
  questionIds: string[]
}

type TeaQuizRecordPayload = {
  version: number
  attempts: TeaQuizAttempt[]
}

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false
  }

  const completedAt = new Date(value)
  return !Number.isNaN(completedAt.valueOf()) && completedAt.toISOString() === value
}

function isTeaQuizAttempt(value: unknown, allowedQuestionIds: ReadonlySet<string>): value is TeaQuizAttempt {
  if (!value || typeof value !== "object") {
    return false
  }

  const attempt = value as Partial<TeaQuizAttempt>
  const questionIds = attempt.questionIds

  return (
    isIsoTimestamp(attempt.completedAt) &&
    Number.isInteger(attempt.score) &&
    attempt.score! >= 0 &&
    attempt.score! <= 10 &&
    attempt.total === 10 &&
    Array.isArray(questionIds) &&
    questionIds.length === 10 &&
    new Set(questionIds).size === 10 &&
    questionIds.every((id) => typeof id === "string" && allowedQuestionIds.has(id))
  )
}

export function parseQuizAttempts(
  value: string | null,
  allowedQuestionIds: readonly string[]
): TeaQuizAttempt[] {
  if (!value) {
    return []
  }

  try {
    const parsed = JSON.parse(value) as Partial<TeaQuizRecordPayload>
    const allowedIds = new Set(allowedQuestionIds)

    if (
      parsed.version !== quizRecordsVersion ||
      !Array.isArray(parsed.attempts) ||
      parsed.attempts.length > maxQuizAttempts
    ) {
      return []
    }

    return parsed.attempts.every((attempt) => isTeaQuizAttempt(attempt, allowedIds))
      ? parsed.attempts
      : []
  } catch {
    return []
  }
}

export function appendQuizAttempt(
  attempts: readonly TeaQuizAttempt[],
  attempt: TeaQuizAttempt
): TeaQuizAttempt[] {
  return [attempt, ...attempts].slice(0, maxQuizAttempts)
}
