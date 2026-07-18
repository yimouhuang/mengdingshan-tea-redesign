"use client"

import { useEffect, useState } from "react"
import { teaQuizQuestions } from "@/lib/tea-quiz"
import {
  dispatchTeaQuizRecordsChanged,
  parseQuizAttempts,
  storageKey,
  teaQuizRecordsChangedEvent,
  type TeaQuizAttempt
} from "@/lib/tea-quiz-records"

type BilingualFeedback = { zh: string; en: string }
type SummaryState =
  | { status: "loading"; attempts: TeaQuizAttempt[]; feedback: null }
  | { status: "ready"; attempts: TeaQuizAttempt[]; feedback: BilingualFeedback | null }
  | { status: "unavailable"; attempts: TeaQuizAttempt[]; feedback: BilingualFeedback }

const quizQuestionIds = teaQuizQuestions.map((question) => question.id)

type EngageRecordSummaryProps = {
  className?: string
}

export function EngageRecordSummary({
  className = "mt-10 max-w-4xl"
}: EngageRecordSummaryProps) {
  const [summary, setSummary] = useState<SummaryState>({
    status: "loading",
    attempts: [],
    feedback: null
  })

  function readRecords() {
    try {
      const attempts = parseQuizAttempts(window.localStorage.getItem(storageKey), quizQuestionIds)
      setSummary({ status: "ready", attempts, feedback: null })
    } catch {
      setSummary({
        status: "unavailable",
        attempts: [],
        feedback: {
          zh: "本机存储不可用，无法读取记录。",
          en: "Local storage is unavailable, so saved records cannot be read."
        }
      })
    }
  }

  useEffect(() => {
    readRecords()
    window.addEventListener(teaQuizRecordsChangedEvent, readRecords)

    return () => window.removeEventListener(teaQuizRecordsChangedEvent, readRecords)
  }, [])

  function clearLocalRecords() {
    try {
      window.localStorage.removeItem(storageKey)
      dispatchTeaQuizRecordsChanged()
      setSummary({
        status: "ready",
        attempts: [],
        feedback: { zh: "本机记录已清除。", en: "Local records were cleared." }
      })
    } catch {
      setSummary({
        status: "unavailable",
        attempts: [],
        feedback: {
          zh: "本机存储不可用，无法清除记录。",
          en: "Local storage is unavailable, so saved records could not be cleared."
        }
      })
    }
  }

  const latestAttempt = summary.attempts[0]
  const bestAttempt = summary.attempts.reduce<TeaQuizAttempt | undefined>((best, attempt) => {
    if (!best || attempt.score > best.score) {
      return attempt
    }

    return best
  }, undefined)

  return (
    <section className={`${className} border border-white/15 bg-white/[0.02] p-5 sm:p-7`} aria-labelledby="local-results-heading">
      <p className="text-xs tracking-[.24em] text-[#d6b45a]"><span lang="en">LOCAL RESULTS</span> / 本机记录</p>
      <h2 id="local-results-heading" className="mt-3 font-display text-2xl sm:text-3xl">
        我的本机记录 / <span lang="en">My local results</span>
      </h2>

      {summary.status === "loading" ? (
        <p role="status" aria-live="polite" className="mt-4 leading-7 text-[#eee9de]/62">正在读取本机记录 / <span lang="en">Reading local results</span></p>
      ) : null}

      {summary.status === "ready" && !latestAttempt ? (
        <p className="mt-4 leading-7 text-[#eee9de]/72">暂无本机记录 / <span lang="en">No local results yet</span></p>
      ) : null}

      {summary.status === "ready" && latestAttempt && bestAttempt ? (
        <>
          <dl className="mt-5 grid gap-4 border-y border-white/12 py-5 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-[#d6b45a]">最近答题 / <span lang="en">Latest result</span></dt>
              <dd className="mt-2 font-display text-2xl text-[#f3f0e5]">
                {latestAttempt.score} / {latestAttempt.total}
              </dd>
              <dd className="mt-1 text-xs text-[#eee9de]/55">{latestAttempt.completedAt}</dd>
            </div>
            <div>
              <dt className="text-sm text-[#d6b45a]">最高分 / <span lang="en">Best score</span></dt>
              <dd className="mt-2 font-display text-2xl text-[#f3f0e5]">
                {bestAttempt.score} / {bestAttempt.total}
              </dd>
            </div>
          </dl>
          <button
            type="button"
            onClick={clearLocalRecords}
            className="mt-5 inline-flex min-h-11 items-center justify-center border border-white/20 px-5 py-2 text-sm text-[#eee9de]/72 transition hover:border-white/45 hover:text-[#f3f0e5]"
          >
            清除本机记录 / <span lang="en">Clear local records</span>
          </button>
        </>
      ) : null}

      {summary.feedback ? (
        <p role="status" aria-live="polite" className="mt-4 text-sm leading-6 text-[#f3d77d]">
          {summary.feedback.zh} / <span lang="en">{summary.feedback.en}</span>
        </p>
      ) : null}
    </section>
  )
}
