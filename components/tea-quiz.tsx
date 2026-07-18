"use client"

import Image from "next/image"
import Link from "next/link"
import { useRef, useState, type ReactNode } from "react"
import { createQuizSession, teaQuizQuestions, type TeaQuizQuestion } from "@/lib/tea-quiz"
import {
  appendQuizAttempt,
  dispatchTeaQuizRecordsChanged,
  parseQuizAttempts,
  quizRecordsVersion,
  storageKey,
  type TeaQuizAttempt
} from "@/lib/tea-quiz-records"
import { resolveMediaUrl } from "@/lib/media-url"

type QuizStage = "start" | "question" | "result"
type BilingualFeedback = { zh: string; en: string }

const quizQuestionIds = teaQuizQuestions.map((question) => question.id)
const quizActionClassName = "inline-flex min-h-11 w-fit items-center justify-center rounded-[2px] border border-[#d6b45a] bg-[#060806]/30 px-[18px] py-2 text-sm text-[#fff0b4] transition hover:border-[#f2d37a] hover:bg-[#d6b45a]/13 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
const subtleQuizActionClassName = "inline-flex min-h-11 w-fit items-center justify-center rounded-[2px] border border-white/20 px-[18px] py-2 text-sm text-[#ddd7c8] transition hover:border-[#d6b45a]/55 hover:bg-[#d6b45a]/8 hover:text-[#fff0b4] active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"

function RouteHeading({
  eyebrow,
  title,
  action
}: {
  eyebrow: ReactNode
  title: string
  action: ReactNode
}) {
  return (
    <div className="route-heading flex flex-col items-start justify-between gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="text-xs tracking-[.2em] text-[#d6b45a]">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-none tracking-[-.05em]">
          {title}
        </h1>
      </div>
      {action}
    </div>
  )
}

function QuestionReferenceLinks({ question }: { question: TeaQuizQuestion }) {
  const shouldShowRelatedArchiveItem = question.source.type !== "archive" || question.source.mediaSlug !== question.mediaSlug

  return (
    <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 text-sm text-[#f3d77d]">
      {question.source.type === "external" ? (
        <a
          href={question.source.url}
          target="_blank"
          rel="noreferrer"
          className="underline underline-offset-4 transition hover:text-[#fff0b4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
        >
          官方来源 / <span lang="en">Official source:</span> {question.source.titleZh} · {question.source.publisherZh}
        </a>
      ) : (
        <Link
          href={`/media/${question.source.mediaSlug}`}
          className="underline underline-offset-4 transition hover:text-[#fff0b4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
        >
          项目影像档案 / <span lang="en">Project archive record:</span> {question.source.titleZh} / <span lang="en">{question.source.titleEn}</span>
        </Link>
      )}
      {shouldShowRelatedArchiveItem ? (
        <Link
          href={`/media/${question.mediaSlug}`}
          className="underline underline-offset-4 transition hover:text-[#fff0b4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
        >
          关联影像条目 / <span lang="en">Related archive item</span>
        </Link>
      ) : null}
    </div>
  )
}

export function TeaQuiz() {
  const [stage, setStage] = useState<QuizStage>("start")
  const [session, setSession] = useState<TeaQuizQuestion[]>([])
  const [answers, setAnswers] = useState<number[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [storageStatus, setStorageStatus] = useState<BilingualFeedback | null>(null)
  const questionHeadingRef = useRef<HTMLHeadingElement>(null)
  const resultHeadingRef = useRef<HTMLHeadingElement>(null)

  const currentQuestion = session[currentQuestionIndex]
  const selectedIndex = answers[currentQuestionIndex] ?? null

  function focusQuestionHeading() {
    window.requestAnimationFrame(() => questionHeadingRef.current?.focus())
  }

  function focusResultHeading() {
    window.requestAnimationFrame(() => resultHeadingRef.current?.focus())
  }

  function startSession() {
    setSession(createQuizSession())
    setAnswers([])
    setCurrentQuestionIndex(0)
    setStorageStatus(null)
    setStage("question")
    focusQuestionHeading()
  }

  function saveAttempt(attempt: TeaQuizAttempt) {
    try {
      const attempts = parseQuizAttempts(window.localStorage.getItem(storageKey), quizQuestionIds)
      const nextAttempts = appendQuizAttempt(attempts, attempt)
      window.localStorage.setItem(
        storageKey,
        JSON.stringify({ version: quizRecordsVersion, attempts: nextAttempts })
      )
      dispatchTeaQuizRecordsChanged()
      setStorageStatus({
        zh: "本次结果已保存在本设备。",
        en: "This result was saved on this device."
      })
    } catch {
      setStorageStatus({
        zh: "本机存储不可用，结果未保存。",
        en: "Local storage is unavailable, so this result was not saved."
      })
    }
  }

  function clearSavedRecords() {
    try {
      window.localStorage.removeItem(storageKey)
      dispatchTeaQuizRecordsChanged()
      setStorageStatus({
        zh: "本机记录已清除。",
        en: "Saved records on this device were cleared."
      })
    } catch {
      setStorageStatus({
        zh: "本机存储不可用，无法清除记录。",
        en: "Local storage is unavailable, so saved records could not be cleared."
      })
    }
  }

  function continueSession() {
    if (!currentQuestion || selectedIndex === null) {
      return
    }

    const nextAnswers = [...answers]
    nextAnswers[currentQuestionIndex] = selectedIndex
    const finalQuestion = currentQuestionIndex === session.length - 1

    setAnswers(nextAnswers)

    if (!finalQuestion) {
      setCurrentQuestionIndex((index) => index + 1)
      focusQuestionHeading()
      return
    }

    const score = session.reduce(
      (total, question, index) => total + Number(nextAnswers[index] === question.correctIndex),
      0
    )
    saveAttempt({
      completedAt: new Date().toISOString(),
      score,
      total: session.length,
      questionIds: session.map((question) => question.id)
    })
    setStage("result")
    focusResultHeading()
  }

  if (stage === "start") {
    return (
      <section className="archive-container py-8 md:py-12" aria-labelledby="quiz-start-heading">
        <RouteHeading
          eyebrow={<>参与 / <span lang="en">ENGAGE</span></>}
          title="茶知识问答"
          action={
            <Link href="/engage" className={subtleQuizActionClassName}>
              返回参与 / <span lang="en">Back to Engage</span>
            </Link>
          }
        />

        <div className="start-grid mt-7 grid gap-6 min-[901px]:grid-cols-[minmax(0,1.15fr)_minmax(320px,.85fr)]">
          <article className="start-media relative isolate min-h-[484px] overflow-hidden rounded-[14px] border border-[#d6b45a]/55 bg-[#0b100b]">
            <Image
              src={resolveMediaUrl("/media/posters/gh010146.jpg")}
              alt="Archive still showing Mengding Mountain tea culture."
              fill
              priority
              sizes="(max-width: 900px) calc(100vw - 40px), 58vw"
              className="z-0 object-cover saturate-[.66] brightness-[.72]"
            />
            <div className="absolute inset-0 z-[1] bg-[linear-gradient(0deg,rgba(4,8,5,.91)_0%,rgba(4,8,5,.14)_70%)]" />
            <div className="relative z-[2] flex min-h-[484px] max-w-[520px] flex-col justify-end p-7 sm:p-9">
              <h2 id="quiz-start-heading" className="font-display text-[clamp(2.25rem,4vw,2.65rem)] leading-[1.06] tracking-[-.04em]">
                用十道题，读回影像与资料
                <span lang="en" className="mt-2 block text-[.65em] font-medium tracking-[-.02em]">
                  Ten questions lead back to images and sources
                </span>
              </h2>
              <p className="mt-4 max-w-[480px] leading-7 text-[#f3f0e5]/80">
                每轮从已核验的题目中随机抽取十题。完成后先看得分与错题摘要。
                <span lang="en" className="mt-1 block text-sm text-[#f3f0e5]/62">
                  Each session draws ten verified prompts at random. Finish with a score and a focused missed-question review.
                </span>
              </p>
              <button type="button" onClick={startSession} className={quizActionClassName + " mt-6"}>
                开始问答 / <span lang="en" className="ml-1">Start the quiz</span>
              </button>
            </div>
          </article>

          <aside className="start-aside flex min-h-[300px] flex-col justify-between border-y border-[#d6b45a]/55 bg-white/[.012] px-6 py-7 sm:p-8">
            <div>
              <h2 className="max-w-[340px] font-display text-3xl leading-[1.1] tracking-[-.04em]">
                你将得到的不是排名
              </h2>
              <ul className="quiet-list mt-6 grid gap-3">
                <li className="border-b border-white/15 pb-3 text-[#e2ddcf]">
                  本轮得分
                  <small lang="en" className="mt-1 block text-xs text-[#8f8b7f]">A score for this session</small>
                </li>
                <li className="border-b border-white/15 pb-3 text-[#e2ddcf]">
                  错题摘要
                  <small lang="en" className="mt-1 block text-xs text-[#8f8b7f]">A focused review of missed prompts</small>
                </li>
                <li className="text-[#e2ddcf]">
                  逐题资料链接
                  <small lang="en" className="mt-1 block text-xs text-[#8f8b7f]">Sources when you choose to open them</small>
                </li>
              </ul>
            </div>
            <p className="aside-foot mt-8 text-sm leading-6 text-[#8f8b7f]">
              结果仅保存在当前设备。
              <span lang="en" className="mt-1 block">Records stay on this device.</span>
            </p>
          </aside>
        </div>
      </section>
    )
  }

  if (stage === "question" && currentQuestion) {
    return (
      <section className="archive-container py-8 md:py-12" aria-labelledby="quiz-question-heading">
        <RouteHeading
          eyebrow="茶知识问答"
          title="从可回查的资料出发"
          action={
            <Link href="/engage" className={subtleQuizActionClassName}>
              退出问答 / <span lang="en">Exit</span>
            </Link>
          }
        />

        <div className="question-stage mx-auto max-w-[900px] pb-3 pt-8">
          <p className="question-count mb-4 text-sm tracking-[.1em] text-[#d6b45a]" aria-live="polite">
            第 {currentQuestionIndex + 1} 题，共 {session.length} 题 / <span lang="en">QUESTION {currentQuestionIndex + 1} OF {session.length}</span>
          </p>
          <h2
            id="quiz-question-heading"
            ref={questionHeadingRef}
            tabIndex={-1}
            style={{ outline: "none" }}
            className="mb-4 max-w-[820px] font-display text-[clamp(2.4rem,4vw,3.375rem)] leading-[1.08] tracking-[-.05em] focus-visible:outline-none"
          >
            {currentQuestion.promptZh}
            <span lang="en" className="mt-2 block text-[.52em] font-medium tracking-[-.02em] text-[#d9d5c9]">
              {currentQuestion.promptEn}
            </span>
          </h2>
          <p className="question-note mb-7 max-w-[650px] leading-7 text-[#8f8b7f]">
            每题只有一个答案。完成后可按需查看对应公开资料或档案条目。
            <span lang="en" className="mt-1 block text-sm">Choose one answer. Sources and archive records remain available when you finish.</span>
          </p>

          <fieldset className="answers grid gap-[10px]">
            <legend className="sr-only">选择一个答案 / <span lang="en">Select one answer</span></legend>
            {currentQuestion.options.map((option, optionIndex) => {
              const selected = selectedIndex === optionIndex

              return (
                <label
                  key={option.en}
                  className={`grid min-h-[68px] w-full cursor-pointer grid-cols-[30px_1fr] items-center gap-3 border px-4 py-3 text-left transition-colors focus-within:border-[#f2d37a] focus-within:ring-2 focus-within:ring-[#f2d37a]/70 focus-within:ring-offset-2 focus-within:ring-offset-[#060806] ${
                    selected
                      ? "border-[#d6b45a]/70 bg-[#d6b45a]/10 text-[#f3d77d]"
                      : "border-white/15 text-[#eae6dc] hover:border-[#d6b45a]/45"
                  }`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name={`tea-question-${currentQuestion.id}`}
                    value={optionIndex}
                    checked={selected}
                    onChange={() => {
                      const nextAnswers = [...answers]
                      nextAnswers[currentQuestionIndex] = optionIndex
                      setAnswers(nextAnswers)
                    }}
                  />
                  <span className="grid size-[22px] place-items-center rounded-full border border-current text-[11px]" aria-hidden="true">
                    {["A", "B", "C", "D"][optionIndex]}
                  </span>
                  <span className="min-w-0 leading-[1.45]">
                    <span className="block">{option.zh}</span>
                    <span lang="en" className="mt-1 block text-xs text-current/75">{option.en}</span>
                  </span>
                </label>
              )
            })}
          </fieldset>

          <div className="question-actions mt-7 flex flex-col items-start justify-between gap-5 border-t border-white/15 pt-[22px] sm:flex-row sm:items-center">
            <p className="text-[13px] text-[#8f8b7f]">
              {selectedIndex === null ? "请选择一项。" : "已选择一项。"} <span lang="en">{selectedIndex === null ? "Choose one answer to continue." : "One answer selected."}</span>
            </p>
            <button
              type="button"
              onClick={continueSession}
              disabled={selectedIndex === null}
              className={quizActionClassName + " disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-transparent disabled:text-[#eee9de]/35"}
            >
              {currentQuestionIndex === session.length - 1 ? (
                <>查看结果 / <span lang="en" className="ml-1">See results</span></>
              ) : (
                <>继续 / <span lang="en" className="ml-1">Continue</span></>
              )}
            </button>
          </div>
        </div>
      </section>
    )
  }

  const score = session.reduce(
    (total, question, index) => total + Number(answers[index] === question.correctIndex),
    0
  )
  const missedQuestionCount = session.length - score
  const firstMissedQuestionIndex = session.findIndex(
    (question, index) => answers[index] !== question.correctIndex
  )

  return (
    <section className="archive-container py-8 md:py-12" aria-labelledby="quiz-result-heading">
      <RouteHeading
        eyebrow={<>茶知识问答 / <span lang="en">RESULT</span></>}
        title="这一轮的结果"
        action={
          <Link href="/engage" className={subtleQuizActionClassName}>
            返回参与 / <span lang="en">Back to Engage</span>
          </Link>
        }
      />

      <section className="score-panel mt-7 grid gap-6 border-y border-white/15 p-6 min-[901px]:grid-cols-[minmax(220px,.54fr)_minmax(0,1fr)] sm:p-[30px]" aria-labelledby="quiz-result-heading">
        <div>
          <p className="score-label mb-2 text-[13px] tracking-[.12em] text-[#d6b45a]">本轮得分 / <span lang="en">SCORE</span></p>
          <p className="score-value font-display text-[clamp(3.875rem,7vw,6.25rem)] leading-[.82] tracking-[-.08em]">
            {score} <span className="text-[.38em] tracking-[-.03em] text-[#8f8b7f]">/ {session.length}</span>
          </p>
        </div>
        <div className="score-copy">
          <h2 id="quiz-result-heading" ref={resultHeadingRef} tabIndex={-1} style={{ outline: "none" }} className="font-display text-[32px] leading-[1.08] tracking-[-.04em] focus-visible:outline-none">
            答对 {score} 题，{missedQuestionCount} 处可以再回看
          </h2>
          <p className="mt-3 max-w-[520px] leading-7 text-[#b7b1a4]">
            先看错题的正确答案与解释。其余逐题资料保持收起，避免结果页变成一篇长文。
            <span lang="en" className="mt-1 block text-sm text-[#8f8b7f]">Review missed answers first. The complete key stays closed until you choose to open it.</span>
          </p>
          <div className="result-actions mt-6 flex flex-wrap gap-3">
            <button type="button" onClick={startSession} className={quizActionClassName}>
              再来一轮 / <span lang="en" className="ml-1">Start again</span>
            </button>
            <Link href="/engage/tea-profile" className={subtleQuizActionClassName}>
              找一盏茶 / <span lang="en" className="ml-1">Find a tea</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="wrong-summary mt-6 grid gap-[10px]" aria-label="错题摘要 / Missed question summary">
        {missedQuestionCount > 0 ? (
          <ol className="grid gap-[10px]">
            {session.map((question, index) => {
              const selectedAnswer = answers[index] === undefined ? undefined : question.options[answers[index]!]
              const correct = answers[index] === question.correctIndex

              if (correct) {
                return null
              }

              return (
                <li key={question.id}>
                  <details open={index === firstMissedQuestionIndex} className="border border-white/15 bg-white/[.012]">
                    <summary className="cursor-pointer px-4 py-[15px] text-[#e7e2d7]">
                      错题 {index + 1}：{question.promptZh}
                      <span lang="en" className="mt-1 block text-sm text-[#d9d5c9]">Missed question {index + 1}: {question.promptEn}</span>
                    </summary>
                    <div className="px-4 pb-4">
                      <p className="text-sm leading-6 text-[#eee9de]/78">
                        你的选择 / <span lang="en">Your choice:</span>{" "}
                        {selectedAnswer ? (
                          <><span>{selectedAnswer.zh}</span> / <span lang="en">{selectedAnswer.en}</span></>
                        ) : (
                          <>未作答 / <span lang="en">No answer</span></>
                        )}
                      </p>
                      <p className="mt-2 text-sm leading-6 text-[#eee9de]/78">
                        正确答案 / <span lang="en">Correct answer:</span>{" "}
                        {question.options[question.correctIndex].zh} / <span lang="en">{question.options[question.correctIndex].en}</span>
                      </p>
                      <p className="mt-4 max-w-3xl leading-7 text-[#b7b1a4]">
                        {question.explanationZh}
                        <span lang="en" className="mt-1 block text-sm text-[#8f8b7f]">{question.explanationEn}</span>
                      </p>
                      <QuestionReferenceLinks question={question} />
                    </div>
                  </details>
                </li>
              )
            })}
          </ol>
        ) : (
          <p className="text-sm leading-6 text-[#b7b1a4]">
            本轮十题全对。 <span lang="en">You answered all ten questions correctly.</span>
          </p>
        )}
      </section>

      <p className="result-note mt-7 border-t border-white/15 py-[22px] text-[13px] leading-[1.62] text-[#8f8b7f]">
        本页不会上传、排名或公开作答。
        <span lang="en" className="mt-1 block">Nothing is uploaded, ranked, or shared.</span>
      </p>

      <div className="flex flex-wrap items-center gap-4">
        {storageStatus ? (
          <p role="status" aria-live="polite" className="text-sm leading-6 text-[#f3d77d]">
            {storageStatus.zh} / <span lang="en">{storageStatus.en}</span>
          </p>
        ) : null}
        <button type="button" onClick={clearSavedRecords} className={subtleQuizActionClassName}>
          清除本机记录 / <span lang="en" className="ml-1">Clear saved records</span>
        </button>
      </div>

      <details className="mt-8 border-t border-white/15 pt-6">
        <summary className="cursor-pointer">
          <span className="font-display text-xl text-[#f3f0e5]">完整答案与出处 / <span lang="en">Complete answer key and sources</span></span>
        </summary>
        <ol className="mt-5 grid gap-5">
          {session.map((question, index) => {
            const selectedAnswer = answers[index] === undefined ? undefined : question.options[answers[index]!]
            const correct = answers[index] === question.correctIndex

            return (
              <li key={question.id} className="border-b border-white/12 pb-5 last:border-b-0">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h3 className="font-display text-xl leading-tight sm:text-2xl">
                    {index + 1}. {question.promptZh}
                    <span lang="en" className="mt-1 block text-base text-[#f3f0e5]/72">{question.promptEn}</span>
                  </h3>
                  <span className={`text-sm ${correct ? "text-[#b6dc9e]" : "text-[#f3d77d]"}`}>
                    {correct ? "正确 / " : "错误 / "}<span lang="en">{correct ? "Correct" : "Incorrect"}</span>
                  </span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#eee9de]/78">
                  你的选择 / <span lang="en">Your choice:</span>{" "}
                  {selectedAnswer ? (
                    <><span>{selectedAnswer.zh}</span> / <span lang="en">{selectedAnswer.en}</span></>
                  ) : (
                    <>未作答 / <span lang="en">No answer</span></>
                  )}
                </p>
                <p className="mt-2 text-sm leading-6 text-[#eee9de]/62">
                  正确答案 / <span lang="en">Correct answer:</span>{" "}
                  {question.options[question.correctIndex].zh} / <span lang="en">{question.options[question.correctIndex].en}</span>
                </p>
                <p className="mt-4 max-w-3xl leading-7 text-[#b7b1a4]">
                  {question.explanationZh}
                  <span lang="en" className="mt-1 block text-sm text-[#8f8b7f]">{question.explanationEn}</span>
                </p>
                <QuestionReferenceLinks question={question} />
              </li>
            )
          })}
        </ol>
      </details>
    </section>
  )
}
