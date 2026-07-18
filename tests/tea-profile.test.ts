import assert from "node:assert/strict"
import test from "node:test"

import {
  resolveTeaProfile,
  teaProfileQuestions,
  teaProfiles,
  type TeaProfileAnswer,
  type TeaProfileSlug
} from "../lib/tea-profile"

const documentedSlugs: readonly TeaProfileSlug[] = [
  "mengding-ganlu",
  "mengding-huangya",
  "mengding-shihua",
  "wanchun-yinye",
  "yuye-changchun"
]

const prohibitedPreferenceCopy = /健康|养生|购买|价格|诊断|年龄|年纪|宗教|信仰|民族|种族|收入|薪资|地点|定位|住址|\b(?:medical|health|wellbeing|purchas\w*|buy|price|diagnos\w*|age|religion|faith|ethnic\w*|income|salary|location|address)\b/i

function validAnswers(): TeaProfileAnswer[] {
  return [
    { questionId: "travel-pace", optionId: "unhurried-pauses" },
    { questionId: "observation-style", optionId: "notice-fine-details" },
    { questionId: "social-style", optionId: "small-quiet-company" },
    { questionId: "route-preference", optionId: "classic-landmarks" },
    { questionId: "arrival-moment", optionId: "early-light" },
    { questionId: "story-preference", optionId: "craft-and-gesture" },
    { questionId: "memory-style", optionId: "subtle-aftertaste" }
  ]
}

function allValidAnswerSets(): TeaProfileAnswer[][] {
  return teaProfileQuestions.reduce<TeaProfileAnswer[][]>(
    (answerSets, question) =>
      answerSets.flatMap((answers) =>
        question.options.map((option) => [
          ...answers,
          { questionId: question.id, optionId: option.id }
        ])
      ),
    [[]]
  )
}

test("tea profiles retain the five documented Mengding tea records in source order", () => {
  assert.deepEqual(
    teaProfiles.map((profile) => profile.slug),
    [
      ...documentedSlugs
    ]
  )

  const expectedSourcesAndFacts = [
    {
      slug: "mengding-ganlu",
      sourceUrl: "https://www.ihchina.cn/project_details/23781.html",
      facts: [
        ["外形曲卷披毫，嫩绿油润。", "Its appearance is curled and downy, tender green and lustrous."],
        ["嫩香汤绿，爽口回甘。", "It is described as having a tender aroma and green liquor, refreshing with a returning sweetness."]
      ]
    },
    {
      slug: "mengding-huangya",
      sourceUrl: "https://www.ihchina.cn/project_details/23781.html",
      facts: [
        ["芽壮齐整，色泽黄亮，油润有金毫。", "Its buds are stout and even, bright yellow and lustrous with golden down."],
        ["甜香蜜韵。", "It is described as having a sweet aroma with a honey-like charm."]
      ]
    },
    {
      slug: "mengding-shihua",
      sourceUrl: "https://www.ihchina.cn/project_details/23781.html",
      facts: [
        ["成茶扁直齐整，银峰挺锐。", "The finished tea is flat, straight and even, with poised silvery tips."],
        ["甘鲜香纯。", "It is described as sweet-fresh with a pure aroma."]
      ]
    },
    {
      slug: "wanchun-yinye",
      sourceUrl: "https://www.yaan.gov.cn/xinwen/show/d86e76bf-0862-4966-986c-707010e2fe53.html",
      facts: [
        ["条索紧细，滋味鲜醇。", "Its leaves are described as tightly fine, with a fresh and mellow taste."]
      ]
    },
    {
      slug: "yuye-changchun",
      sourceUrl: "https://www.yaan.gov.cn/xinwen/show/d86e76bf-0862-4966-986c-707010e2fe53.html",
      facts: [
        ["色泽绿润，回味甘甜。", "It is described as green and lustrous, with a sweet returning finish."]
      ]
    }
  ]

  assert.deepEqual(
    teaProfiles.map((profile) => ({
      slug: profile.slug,
      sourceUrl: profile.source.url,
      facts: profile.facts.map((fact) => [fact.zh, fact.en])
    })),
    expectedSourcesAndFacts
  )

  for (const profile of teaProfiles) {
    assert.ok(profile.nameZh.trim())
    assert.ok(profile.nameEn.trim())
    assert.ok(profile.facts.length > 0)
    assert.equal(profile.recommendation.kind, "editorial-cultural-experience")
    assert.match(profile.recommendation.labelEn, /Editorial cultural experience/i)
    assert.match(profile.recommendation.disclaimerEn, /not a personality assessment/i)
    assert.match(profile.recommendation.disclaimerEn, /health advice/i)
    assert.match(profile.recommendation.disclaimerEn, /tasting conclusion/i)
    assert.match(profile.recommendation.disclaimerEn, /purchasing recommendation/i)
  }
})

test("tea profile questionnaire contains seven non-sensitive preference questions with four options each", () => {
  assert.equal(teaProfileQuestions.length, 7)
  assert.deepEqual(
    teaProfileQuestions.map((question) => ({
      id: question.id,
      optionIds: question.options.map((option) => option.id)
    })),
    [
      {
        id: "travel-pace",
        optionIds: ["unhurried-pauses", "steady-walk", "short-stops", "quiet-detour"]
      },
      {
        id: "observation-style",
        optionIds: ["notice-fine-details", "follow-lines", "notice-colour", "read-the-setting"]
      },
      {
        id: "social-style",
        optionIds: ["small-quiet-company", "shared-notes", "independent-nearby", "lively-conversation"]
      },
      {
        id: "route-preference",
        optionIds: ["classic-landmarks", "craft-workspaces", "scenic-ridges", "focused-exhibit"]
      },
      {
        id: "arrival-moment",
        optionIds: ["early-light", "midday-clarity", "late-afternoon", "misty-morning"]
      },
      {
        id: "story-preference",
        optionIds: ["craft-and-gesture", "place-and-history", "natural-forms", "workshop-rhythm"]
      },
      {
        id: "memory-style",
        optionIds: ["subtle-aftertaste", "clear-image", "colour-impression", "shared-route"]
      }
    ]
  )

  for (const question of teaProfileQuestions) {
    assert.equal(question.options.length, 4)
    assert.match(question.promptEn, /travel|route|observe|company|pace|pause|share|story|memory/i)
    assert.doesNotMatch(
      [
        question.promptZh,
        question.promptEn,
        ...question.options.flatMap((option) => [option.zh, option.en])
      ].join("\n"),
      prohibitedPreferenceCopy
    )

    for (const option of question.options) {
      assert.ok(option.zh.trim())
      assert.ok(option.en.trim())

      const weights = Object.entries(option.weights)
      assert.ok(
        weights.some(([slug]) => documentedSlugs.includes(slug as TeaProfileSlug)),
        `${question.id}/${option.id} needs at least one documented tea weight`
      )

      for (const [slug, weight] of weights) {
        assert.ok(
          documentedSlugs.includes(slug as TeaProfileSlug),
          `${question.id}/${option.id} has an unknown tea weight: ${slug}`
        )
        assert.equal(Number.isFinite(weight), true)
        assert.ok(weight > 0)
      }
    }
  }
})

test("fixed travel-preference answers resolve Mengding Huangya first and Mengding Ganlu second", () => {
  const result = resolveTeaProfile(validAnswers())

  assert.ok(result)
  assert.equal(result.primary.slug, "mengding-huangya")
  assert.equal(result.alternate.slug, "mengding-ganlu")
  assert.equal(result.disclaimerEn, "This is an editorial cultural experience, not a personality assessment, health advice, tasting conclusion, or purchasing recommendation.")
})

test("tea profile resolver rejects duplicate answers for one question", () => {
  const answers = validAnswers()
  answers[1] = { questionId: "travel-pace", optionId: "unhurried-pauses" }

  assert.equal(answers.length, teaProfileQuestions.length)
  assert.equal(resolveTeaProfile(answers), null)
})

test("tea profile resolver rejects conflicting options for one question", () => {
  const answers = validAnswers()
  answers[1] = { questionId: "travel-pace", optionId: "steady-walk" }

  assert.equal(answers.length, teaProfileQuestions.length)
  assert.equal(resolveTeaProfile(answers), null)
})

test("tea profile resolver rejects an option assigned to the wrong known question", () => {
  const answers = validAnswers()
  answers[0] = { questionId: "travel-pace", optionId: "notice-fine-details" }

  assert.equal(answers.length, teaProfileQuestions.length)
  assert.equal(resolveTeaProfile(answers), null)
})

test("tea profile resolver rejects an answer with an unknown option", () => {
  const answers = validAnswers()
  answers[0] = { questionId: "travel-pace", optionId: "unknown-option" }

  assert.equal(resolveTeaProfile(answers), null)
})

test("tea profile resolver rejects an answer with an unknown question", () => {
  const answers = validAnswers()
  answers[0] = { questionId: "unknown-question", optionId: "unhurried-pauses" }

  assert.equal(resolveTeaProfile(answers), null)
})

test("tea profile resolver rejects incomplete seven-question submissions", () => {
  assert.equal(resolveTeaProfile(validAnswers().slice(0, -1)), null)
})

test("tea profile resolver breaks a non-zero Ganlu-Huangya score tie by documented order", () => {
  const result = resolveTeaProfile([
    { questionId: "travel-pace", optionId: "unhurried-pauses" },
    { questionId: "observation-style", optionId: "notice-fine-details" },
    { questionId: "social-style", optionId: "small-quiet-company" },
    { questionId: "route-preference", optionId: "classic-landmarks" },
    { questionId: "arrival-moment", optionId: "early-light" },
    { questionId: "story-preference", optionId: "craft-and-gesture" },
    { questionId: "memory-style", optionId: "shared-route" }
  ])

  assert.ok(result)
  assert.equal(result.scores["mengding-ganlu"], 13)
  assert.equal(result.scores["mengding-huangya"], 13)
  assert.equal(result.primary.slug, "mengding-ganlu")
  assert.equal(result.alternate.slug, "mengding-huangya")
})

test("every documented tea is reachable as both primary and alternate", () => {
  const primaries = new Set<TeaProfileSlug>()
  const alternates = new Set<TeaProfileSlug>()

  for (const answers of allValidAnswerSets()) {
    const result = resolveTeaProfile(answers)
    assert.ok(result, "a complete answer set must resolve")
    primaries.add(result.primary.slug)
    alternates.add(result.alternate.slug)
  }

  assert.deepEqual([...primaries].sort(), [...documentedSlugs].sort())
  assert.deepEqual([...alternates].sort(), [...documentedSlugs].sort())
})
