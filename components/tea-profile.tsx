"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import {
  resolveTeaProfile,
  teaProfileQuestions,
  type TeaProfile,
  type TeaProfileAnswer,
  type TeaProfileResult
} from "@/lib/tea-profile"
import {
  parseTeaProfileRecord,
  storageKey,
  writeTeaProfileRecord,
  type TeaProfileRecord
} from "@/lib/tea-profile-record"
import { resolveMediaUrl } from "@/lib/media-url"

type ProfileStage = "start" | "question" | "result"
type BilingualFeedback = { zh: string; en: string }

const actionClassName = "inline-flex min-h-11 items-center justify-center border border-[#d6b45a]/70 px-5 py-2 text-sm text-[#fff0b4] transition hover:border-[#f2d37a] hover:bg-[#d6b45a]/10 active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
const subtleActionClassName = "inline-flex min-h-11 items-center justify-center border border-white/15 px-5 py-2 text-sm text-[#c5c0b4] transition hover:border-[#d6b45a]/55 hover:bg-[#d6b45a]/8 hover:text-[#f3d77d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"

function TeaRecordDetails({
  profile,
  className
}: {
  profile: TeaProfile
  className?: string
}) {
  return (
    <div className={className}>
      <section aria-labelledby={profile.slug + "-facts-heading"}>
        <h4 id={profile.slug + "-facts-heading"} className="text-sm font-semibold text-[#f3d77d]">
          可核验事实 / <span lang="en">Verified fact</span>
        </h4>
        <ul className="mt-3 grid gap-3 leading-7 text-[#eee9de]/78">
          {profile.facts.map((fact) => (
            <li key={fact.en}>
              {fact.zh}
              <span lang="en" className="mt-1 block text-sm text-[#eee9de]/60">{fact.en}</span>
            </li>
          ))}
        </ul>
        <a
          href={profile.source.url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex min-h-11 items-center text-sm text-[#f3d77d] underline underline-offset-4 transition hover:text-[#fff0b4] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
        >
          <span>
            资料出处 / <span lang="en">Source record (opens in a new tab)</span>
            <span className="mt-1 block text-[#eee9de]/72">{profile.source.publisherZh}</span>
            <span className="mt-1 block text-[#eee9de]/58">{profile.source.titleZh}</span>
          </span>
        </a>
      </section>
      <section className="mt-6 border-t border-white/12 pt-5" aria-labelledby={profile.slug + "-experience-heading"}>
        <h4 id={profile.slug + "-experience-heading"} className="text-sm font-semibold text-[#f3d77d]">
          编辑推荐 / <span lang="en">Editorial cultural experience</span>
        </h4>
        <p className="mt-3 leading-7 text-[#eee9de]/78">
          {profile.recommendation.textZh}
          <span lang="en" className="mt-1 block text-sm text-[#eee9de]/60">{profile.recommendation.textEn}</span>
        </p>
      </section>
    </div>
  )
}

function RouteHeading({
  eyebrow,
  title,
  titleEn,
  action
}: {
  eyebrow: ReactNode
  title: string
  titleEn?: string
  action: ReactNode
}) {
  return (
    <div className="route-heading flex flex-col items-start justify-between gap-6 border-b border-white/15 pb-7 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="text-xs tracking-[.2em] text-[#d6b45a]">{eyebrow}</p>
        <h1 className="mt-3 font-display text-[clamp(2.4rem,4vw,3.5rem)] leading-none tracking-[-.05em]">
          {title}
          {titleEn ? <span lang="en" className="mt-2 block text-[0.48em] font-medium tracking-[-.02em] text-[#eee9de]/80">{titleEn}</span> : null}
        </h1>
      </div>
      {action}
    </div>
  )
}

export function TeaProfile() {
  const [stage, setStage] = useState<ProfileStage>("start")
  const [answers, setAnswers] = useState<Partial<Record<string, string>>>({})
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [result, setResult] = useState<TeaProfileResult | null>(null)
  const [latestRecord, setLatestRecord] = useState<TeaProfileRecord | null>(null)
  const [storageStatus, setStorageStatus] = useState<BilingualFeedback | null>(null)
  const questionHeadingRef = useRef<HTMLHeadingElement>(null)
  const resultHeadingRef = useRef<HTMLHeadingElement>(null)
  const currentQuestion = teaProfileQuestions[currentQuestionIndex]
  const selectedOptionId = currentQuestion ? answers[currentQuestion.id] ?? null : null

  useEffect(() => {
    try {
      setLatestRecord(parseTeaProfileRecord(window.localStorage.getItem(storageKey)))
    } catch {
      setStorageStatus({
        zh: "本机存储不可用，无法读取上次记录。",
        en: "Local storage is unavailable, so the latest result could not be read."
      })
    }
  }, [])

  function focusQuestionHeading() {
    window.requestAnimationFrame(() => questionHeadingRef.current?.focus())
  }

  function focusResultHeading() {
    window.requestAnimationFrame(() => resultHeadingRef.current?.focus())
  }

  function startProfile() {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setResult(null)
    setStorageStatus(null)
    setStage("question")
    focusQuestionHeading()
  }

  function restartProfile() {
    setLatestRecord(null)
    startProfile()
  }

  function saveLatestResult(nextResult: TeaProfileResult) {
    const record: TeaProfileRecord = {
      version: 1,
      completedAt: new Date().toISOString(),
      primaryId: nextResult.primary.slug,
      secondaryId: nextResult.alternate.slug
    }
    try {
      window.localStorage.setItem(storageKey, writeTeaProfileRecord(record))
      setLatestRecord(record)
      setStorageStatus({
        zh: "本次结果仅保存在此设备。",
        en: "This result was saved only on this device."
      })
    } catch {
      setStorageStatus({
        zh: "本机存储不可用，结果未保存，但仍可在此查看。",
        en: "Local storage is unavailable, so this result was not saved, but it remains available here."
      })
    }
  }

  function continueProfile() {
    if (!currentQuestion || selectedOptionId === null) {
      return
    }
    const nextAnswers = {
      ...answers,
      [currentQuestion.id]: selectedOptionId
    }
    const finalQuestion = currentQuestionIndex === teaProfileQuestions.length - 1
    setAnswers(nextAnswers)

    if (!finalQuestion) {
      setCurrentQuestionIndex((index) => index + 1)
      focusQuestionHeading()
      return
    }

    const resolvedAnswers: TeaProfileAnswer[] = teaProfileQuestions.map((question) => ({
      questionId: question.id,
      optionId: nextAnswers[question.id]!
    }))
    const nextResult = resolveTeaProfile(resolvedAnswers)

    if (!nextResult) {
      setStorageStatus({
        zh: "无法生成结果，请重新开始。",
        en: "The result could not be calculated. Please restart."
      })
      return
    }

    setResult(nextResult)
    saveLatestResult(nextResult)
    setStage("result")
    focusResultHeading()
  }

  const storageStatusMessage = storageStatus ? (
    <p role="status" aria-live="polite" className="mt-5 text-sm leading-6 text-[#f3d77d]">
      {storageStatus.zh} / <span lang="en">{storageStatus.en}</span>
    </p>
  ) : null

  if (stage === "start") {
    return (
      <section className="archive-container py-8 md:py-12" aria-labelledby="tea-profile-start-heading">
        <RouteHeading
          eyebrow={<>参与 / <span lang="en">ENGAGE</span></>}
          title="找一盏蒙顶茶"
          action={
            <Link href="/engage" className={subtleActionClassName}>
              返回参与 / <span lang="en">Back to Engage</span>
            </Link>
          }
        />
        <div className="start-grid mt-7 grid gap-6 min-[901px]:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
          <article className="start-media relative isolate min-h-[484px] overflow-hidden rounded-[14px] border border-[#d6b45a]/55">
            <Image
              src={resolveMediaUrl("/media/photos/a-moment-at-the-tea-table.jpg")}
              alt="Archive photograph of objects and arrangement on a tea table."
              fill
              sizes="(max-width: 900px) calc(100vw - 40px), 58vw"
              className="z-[-2] object-cover saturate-[.66] brightness-[.72]"
            />
            <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-[#040805]/95 via-[#040805]/35 to-transparent" />
            <div className="relative z-0 start-media-copy flex min-h-[484px] max-w-[520px] flex-col justify-end p-7 sm:p-9">
              <h2 id="tea-profile-start-heading" className="font-display text-[clamp(2.25rem,4vw,2.65rem)] leading-[1.06] tracking-[-.04em]">
                从你的观察方式开始
                <span lang="en" className="mt-2 block text-[.65em] font-medium tracking-[-.02em]">Begin with how you notice tea</span>
              </h2>
              <p className="mt-4 max-w-[480px] leading-7 text-[#f3f0e5]/80">
                这不是人格测评。七个非敏感偏好只用于引导文化浏览。
              </p>
              <button type="button" onClick={startProfile} className={actionClassName + " mt-6 w-fit"}>
                开始 7 题体验 / <span lang="en">Begin 7 prompts</span>
              </button>
            </div>
          </article>
          <aside className="start-aside flex min-h-[300px] flex-col justify-between border-y border-[#d6b45a]/55 px-6 py-7 sm:p-8">
            <div>
              <h2 className="max-w-[340px] font-display text-3xl leading-[1.1] tracking-[-.04em]">
                结果会直接告诉你从哪一盏茶开始
              </h2>
              <ul className="quiet-list mt-6 grid gap-3">
                <li className="border-b border-white/15 pb-3 text-[#e2ddcf]">
                  主推荐茶名
                  <small lang="en" className="mt-1 block text-xs text-[#8f8b7f]">Primary Mengding tea record</small>
                </li>
                <li className="border-b border-white/15 pb-3 text-[#e2ddcf]">
                  一项备选茶名
                  <small lang="en" className="mt-1 block text-xs text-[#8f8b7f]">One alternate record</small>
                </li>
                <li className="text-[#e2ddcf]">
                  可回查的资料出处
                  <small lang="en" className="mt-1 block text-xs text-[#8f8b7f]">Traceable public source</small>
                </li>
              </ul>
            </div>
            <p className="aside-foot mt-8 text-sm leading-6 text-[#8f8b7f]">
              不提供健康、品鉴或购买建议。
              <span lang="en" className="mt-1 block">Cultural browsing only.</span>
            </p>
          </aside>
        </div>
        {latestRecord ? (
          <p className="mt-5 text-sm leading-6 text-[#eee9de]/55">
            此设备保留了一条上次完成记录。
            <span lang="en" className="mt-1 block">The latest completed record remains on this device.</span>
          </p>
        ) : null}
        {storageStatusMessage}
      </section>
    )
  }

  if (stage === "question" && currentQuestion) {
    return (
      <section className="archive-container py-8 md:py-12" aria-labelledby="tea-profile-question-heading">
        <RouteHeading
          eyebrow="找一盏蒙顶茶"
          title="找到你的观察节奏"
          action={
            <Link href="/engage" className={subtleActionClassName}>
              退出体验 / <span lang="en">Exit</span>
            </Link>
          }
        />
        <div className="question-stage mx-auto max-w-[900px] pb-3 pt-8">
          <p className="question-count text-sm tracking-[.1em] text-[#d6b45a]" aria-live="polite">
            第 {currentQuestionIndex + 1} 题，共 7 题 / <span lang="en">QUESTION {currentQuestionIndex + 1} OF 7</span>
          </p>
          <h1
            id="tea-profile-question-heading"
            ref={questionHeadingRef}
            tabIndex={-1}
            style={{ outline: "none" }}
            className="mt-4 max-w-[820px] font-display text-[clamp(2.35rem,4vw,3.4rem)] leading-[1.08] tracking-[-.04em]"
          >
            {currentQuestion.promptZh}
            <span lang="en" className="mt-3 block text-[.52em] font-medium tracking-[-.02em] text-[#d9d5c9]">{currentQuestion.promptEn}</span>
          </h1>
          <p className="question-note mt-4 max-w-[650px] leading-7 text-[#8f8b7f]">
            选择最接近你的方式。它只用于安排下一步文化浏览。
          </p>
          <fieldset className="answers mt-7 grid gap-3">
            <legend className="sr-only">选择一项 / <span lang="en">Select one option</span></legend>
            {currentQuestion.options.map((option, optionIndex) => {
              const selected = selectedOptionId === option.id
              const answerClassName = [
                "answer grid min-h-[68px] w-full cursor-pointer grid-cols-[30px_1fr] items-center gap-3 border px-4 py-3 text-left transition-colors focus-within:border-[#f2d37a] focus-within:ring-2 focus-within:ring-[#f2d37a]/70 focus-within:ring-offset-2 focus-within:ring-offset-[#060806]",
                selected
                  ? "selected border-[#d6b45a] bg-[#d6b45a]/10 text-[#f3d77d]"
                  : "border-white/15 text-[#eae6dc] hover:border-[#d6b45a]/45"
              ].join(" ")
              return (
                <label key={option.id} className={answerClassName}>
                  <input
                    className="sr-only"
                    type="radio"
                    name={"tea-profile-" + currentQuestion.id}
                    value={option.id}
                    checked={selected}
                    onChange={() => setAnswers((currentAnswers) => ({
                      ...currentAnswers,
                      [currentQuestion.id]: option.id
                    }))}
                  />
                  <span aria-hidden="true" className="answer-key grid size-[22px] place-items-center rounded-full border border-current text-[11px]">
                    {String.fromCharCode(65 + optionIndex)}
                  </span>
                  <span className="block leading-6">
                    {option.zh}
                    <span lang="en" className="mt-1 block text-xs text-current/70">{option.en}</span>
                  </span>
                </label>
              )
            })}
          </fieldset>
          <div className="question-actions mt-7 flex flex-col items-start justify-between gap-5 border-t border-white/15 pt-6 sm:flex-row sm:items-center">
            <p className="text-sm text-[#8f8b7f]">
              {selectedOptionId === null ? "请选择一项后继续。" : "已选择一项。"}
              <span lang="en" className="mt-1 block">{selectedOptionId === null ? "Choose one option to continue." : "One option selected."}</span>
            </p>
            <button
              type="button"
              onClick={continueProfile}
              disabled={selectedOptionId === null}
              className={actionClassName + " disabled:cursor-not-allowed disabled:border-white/15 disabled:text-[#eee9de]/35"}
            >
              {currentQuestionIndex === teaProfileQuestions.length - 1 ? (
                <>查看结果 / <span lang="en">See results</span></>
              ) : (
                <>继续 / <span lang="en">Continue</span></>
              )}
            </button>
          </div>
          {storageStatusMessage}
        </div>
      </section>
    )
  }

  if (!result) {
    return (
      <section className="archive-container py-8 md:py-12" aria-labelledby="tea-profile-unavailable-heading">
        <RouteHeading
          eyebrow="找一盏蒙顶茶"
          title="结果暂不可用"
          titleEn="Result unavailable"
          action={<Link href="/engage" className={subtleActionClassName}>返回参与 / <span lang="en">Back to Engage</span></Link>}
        />
        <p id="tea-profile-unavailable-heading" className="mt-8 leading-7 text-[#eee9de]/70">
          请重新开始这项文化浏览。
          <span lang="en" className="mt-1 block">Please restart this cultural-browsing experience.</span>
        </p>
        {storageStatusMessage}
        <button type="button" onClick={restartProfile} className={actionClassName + " mt-6"}>
          重新开始 / <span lang="en">Restart</span>
        </button>
      </section>
    )
  }

  return (
    <section className="archive-container py-8 md:py-12" aria-labelledby="tea-profile-result-heading">
      <RouteHeading
        eyebrow={<>找一盏蒙顶茶 / <span lang="en">RESULT</span></>}
        title="你的下一盏茶"
        action={
          <Link href="/engage" className={subtleActionClassName}>
            返回参与 / <span lang="en">Back to Engage</span>
          </Link>
        }
      />
      <h2 id="tea-profile-result-heading" ref={resultHeadingRef} tabIndex={-1} style={{ outline: "none" }} className="sr-only">
        你的下一盏茶 / <span lang="en">Your next tea</span>
      </h2>
      <div className="result-top mt-7 grid gap-6 min-[901px]:grid-cols-[minmax(0,1.22fr)_minmax(280px,0.78fr)]">
        <section className="tea-result relative isolate min-h-[420px] overflow-hidden rounded-[14px] border border-[#d6b45a]/55" aria-labelledby="tea-profile-primary-nameplate">
          <Image
            src={resolveMediaUrl("/media/photos/tea-garden-in-mist.jpg")}
            alt="Tea Garden in Mist, an archive photograph used as cultural context only."
            fill
            sizes="(max-width: 900px) calc(100vw - 40px), 62vw"
            className="z-[-2] object-cover saturate-[.66] brightness-[.68]"
          />
          <div className="absolute inset-0 z-[-1] bg-gradient-to-r from-[#050805]/95 via-[#050805]/55 to-transparent" />
          <div className="relative z-0 tea-result-copy flex min-h-[420px] max-w-[570px] flex-col justify-end p-7 sm:p-9">
            <p className="text-xs tracking-[.2em] text-[#d6b45a]">
              本次推荐 / <span lang="en">PRIMARY</span>
            </p>
            <h3 id="tea-profile-primary-nameplate" className="mt-3 font-display text-[clamp(2.75rem,4.8vw,3.9rem)] leading-[.98] tracking-[-.05em]">
              {result.primary.nameZh}
              <span lang="en" className="mt-3 block text-[.54em] font-medium tracking-[-.02em]">{result.primary.nameEn}</span>
            </h3>
            <p className="mt-5 leading-7 text-[#f3f0e5]/80">
              从观察方式和影像线索开始，进入一项可回查的蒙顶茶记录。
              <span lang="en" className="mt-1 block text-sm text-[#f3f0e5]/62">A generic archive image frames cultural browsing; it does not identify the recommended tea.</span>
            </p>
          </div>
        </section>
        <section className="alternate flex min-h-[300px] flex-col justify-between border-y border-[#d6b45a]/55 px-6 py-7 sm:p-8" aria-labelledby="tea-profile-alternate-nameplate">
          <div>
            <p className="text-xs tracking-[.2em] text-[#d6b45a]">
              备选 / <span lang="en">ALTERNATE</span>
            </p>
            <h3 id="tea-profile-alternate-nameplate" className="mt-3 font-display text-3xl leading-[1.08] tracking-[-.04em]">
              {result.alternate.nameZh}
            </h3>
            <p lang="en" className="mt-2 text-[#eee9de]/75">{result.alternate.nameEn}</p>
            <p className="mt-5 leading-7 text-[#c5c0b4]">
              如果你更愿意按清晰步骤逐项了解，可以从这项记录继续。
            </p>
          </div>
          <a
            href={result.alternate.source.url}
            target="_blank"
            rel="noreferrer"
            className={actionClassName + " mt-7 w-fit text-[#f3d77d]"}
          >
            查看资料出处 / <span lang="en">Source record</span>
          </a>
        </section>
      </div>
      <p className="result-note mt-7 border-t border-white/15 py-5 text-sm leading-7 text-[#8f8b7f]">
        这是一项编辑性的文化浏览结果，不是健康建议、品鉴结论或购买建议。
        <span lang="en" className="mt-1 block">This is an editorial cultural-browsing result, not health, tasting, or purchase advice.</span>
      </p>
      <div className="result-actions flex flex-wrap gap-3">
        <button type="button" onClick={restartProfile} className={actionClassName}>
          再找一次 / <span lang="en">Try again</span>
        </button>
        <Link href="/media/tea-garden-in-mist-photo" className={subtleActionClassName}>
          查看关联影像 / <span lang="en">Related media</span>
        </Link>
      </div>
      <div className="mt-10 grid gap-6 border-t border-white/15 pt-7 lg:grid-cols-2">
        <section aria-labelledby="tea-profile-primary-record-heading">
          <h3 id="tea-profile-primary-record-heading" className="font-display text-2xl">
            主推荐资料 / <span lang="en">Primary record details</span>
          </h3>
          <TeaRecordDetails profile={result.primary} className="mt-5" />
        </section>
        <section aria-labelledby="tea-profile-alternate-record-heading">
          <h3 id="tea-profile-alternate-record-heading" className="font-display text-2xl">
            备选资料 / <span lang="en">Alternate record details</span>
          </h3>
          <TeaRecordDetails profile={result.alternate} className="mt-5" />
        </section>
      </div>
      <p className="mt-7 max-w-3xl text-sm leading-6 text-[#eee9de]/60">
        {result.disclaimerZh} <span lang="en">{result.disclaimerEn}</span>
      </p>
      {storageStatusMessage}
    </section>
  )
}
