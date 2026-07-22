import assert from "node:assert/strict"
import { existsSync, readFileSync, readdirSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const quizModulePath = resolve(projectRoot, "lib/tea-quiz.ts")
const engagePagePath = resolve(projectRoot, "app/engage/page.tsx")

test("tea quiz provides fifteen sourced bilingual questions with valid media references", async () => {
  assert.equal(existsSync(quizModulePath), true, "expected lib/tea-quiz.ts to exist")

  const { teaQuizQuestions } = await import("../lib/tea-quiz")
  const { mediaItems } = await import("../lib/media")
  const mediaSlugs = new Set(mediaItems.map((item) => item.slug))

  assert.equal(teaQuizQuestions.length, 15)
  assert.equal(new Set(teaQuizQuestions.map((question) => question.id)).size, 15)

  for (const question of teaQuizQuestions) {
    assert.ok(question.promptZh.length > 0)
    assert.ok(question.promptEn.length > 0)
    assert.equal(question.options.length, 4)
    assert.ok(question.options.every((option) => option.zh.length > 0 && option.en.length > 0))
    assert.ok(Number.isInteger(question.correctIndex))
    assert.ok(question.correctIndex >= 0 && question.correctIndex < question.options.length)
    if (question.source.type === "external") {
      assert.ok(question.source.titleZh.length > 0)
      assert.ok(question.source.publisherZh.length > 0)
      assert.match(question.source.url, /^https:\/\//)
      assert.equal(question.source.checkedAt, "2026-07-15")
    } else {
      assert.equal(question.source.type, "archive")
      assert.equal(question.source.mediaSlug, question.mediaSlug)
      assert.ok(question.source.titleZh.length > 0)
      assert.ok(question.source.titleEn.length > 0)
    }
    assert.ok(mediaSlugs.has(question.mediaSlug), `missing media ${question.mediaSlug}`)
  }
})

test("tea quiz only uses the three verified visual-observation records", async () => {
  assert.equal(existsSync(quizModulePath), true, "expected lib/tea-quiz.ts to exist")

  const { teaQuizQuestions } = await import("../lib/tea-quiz")
  const observationQuestions = teaQuizQuestions.filter((question) => question.id.startsWith("observe-"))

  assert.deepEqual(
    observationQuestions.map((question) => question.mediaSlug).sort(),
    ["new-tea-shoots", "sorting-fresh-leaves", "tea-ancestor-relief"]
  )
  assert.ok(observationQuestions.every((question) => question.source.type === "archive"))
  assert.ok(
    observationQuestions.every(
      (question) => question.source.type === "archive" && question.source.mediaSlug === question.mediaSlug
    )
  )
  assert.ok(observationQuestions.every((question) => !("url" in question.source)))
})

test("new tea shoots observation stays bounded to the refreshed archive record", async () => {
  const { teaQuizQuestions } = await import("../lib/tea-quiz")
  const question = teaQuizQuestions.find((candidate) => candidate.id === "observe-new-tea-shoots")

  assert.ok(question)
  assert.equal(question.promptZh, "只根据已核验影像条目《茶芽初展》，画面主要呈现的是？")
  assert.equal(
    question.promptEn,
    "Based only on the verified archive item 'New Tea Shoots,' what does the image primarily show?"
  )
  assert.deepEqual(question.options, [
    { zh: "初展的茶芽", en: "Newly unfurled tea shoots" },
    { zh: "工作台上的鲜叶", en: "Fresh leaves on a worktable" },
    { zh: "石壁上的浮雕", en: "A relief on a stone wall" },
    { zh: "林间的石阶", en: "Stone steps in the forest" }
  ])
  assert.equal(question.correctIndex, 0)
  assert.equal(
    question.explanationZh,
    "该题只读取档案条目的标题和说明：画面呈现的是初展的茶芽，不对地点或年代作推断。"
  )
  assert.equal(
    question.explanationEn,
    "This answer uses only the item's title and description: the image shows newly unfurled tea shoots and makes no claim about place or date."
  )
  assert.deepEqual(question.source, {
    type: "archive",
    mediaSlug: "new-tea-shoots",
    titleZh: "茶芽初展",
    titleEn: "New Tea Shoots"
  })
  assert.equal(question.mediaSlug, "new-tea-shoots")
})

test("production TypeScript contains no exact retired media slug literals", () => {
  const productionDirectories = ["app", "components", "lib"]
  const retiredSlugs = [
    "way-up-the-mountain",
    "a-retreat-for-wellbeing",
    "picking-new-tea-shoots",
    "fresh-leaves-in-hand",
    "tea-garden-overlook"
  ]
  const sourceFiles = productionDirectories.flatMap((directory) =>
    readdirSync(resolve(projectRoot, directory), { recursive: true, withFileTypes: true })
      .filter((entry) => entry.isFile() && /\.[cm]?[jt]sx?$/.test(entry.name))
      .map((entry) => resolve(entry.parentPath, entry.name))
  )

  for (const filePath of sourceFiles) {
    const source = readFileSync(filePath, "utf8")

    for (const slug of retiredSlugs) {
      assert.doesNotMatch(
        source,
        new RegExp(`["']${slug}["']`),
        `found retired media slug ${slug} in ${filePath}`
      )
    }
  }
})

test("tea quiz question types require four readonly options and a valid answer index", () => {
  const source = readFileSync(quizModulePath, "utf8")

  assert.match(source, /TeaQuizOptions\s*=\s*readonly \[/)
  assert.match(source, /options:\s*TeaQuizOptions/)
  assert.match(source, /correctIndex:\s*0 \| 1 \| 2 \| 3/)
})

test("a quiz session draws ten non-repeating questions with a supplied random source", async () => {
  assert.equal(existsSync(quizModulePath), true, "expected lib/tea-quiz.ts to exist")

  const { createQuizSession } = await import("../lib/tea-quiz")
  const session = createQuizSession(() => 0)

  assert.equal(session.length, 10)
  assert.equal(new Set(session.map((question) => question.id)).size, 10)
})

test("tea quiz exports six unique checked public sources for the engage registry", async () => {
  const { teaQuizSources } = await import("../lib/tea-quiz")

  const expectedSourceUrls = new Set([
    "https://www.ihchina.cn/project_details/23781.html",
    "https://www.yasrdw.gov.cn/html/2025/yardw_15_1216/25427.html",
    "https://www.yaan.gov.cn/zhangzhe/show/40750101-a7f1-4962-9c24-b81acde6f9a2.html",
    "https://jgs.agri.gov.cn/detail/zh/16405.html",
    "https://ich.unesco.org/en/RL/traditional-tea-processing-techniques-and-associated-social-practices-in-china-01884",
    "https://www.yaan.gov.cn/mob/article.html?id=84b02cd8-5706-41f6-a776-6907eadfb2c7"
  ])

  assert.equal(teaQuizSources.length, 6)
  assert.ok(teaQuizSources.every((source) => source.type === "external"))
  assert.equal(
    new Set(teaQuizSources.map((source) => `${source.titleZh}|${source.publisherZh}|${source.url}`)).size,
    6
  )
  assert.deepEqual(new Set(teaQuizSources.map((source) => source.url)), expectedSourceUrls)
  assert.ok(teaQuizSources.every((source) => source.checkedAt === "2026-07-15"))
  assert.ok(teaQuizSources.every((source) => source.url.startsWith("https://")))
  assert.ok(
    teaQuizSources.some(
      (source) =>
        source.publisherZh === "雅安市人民政府" &&
        source.titleZh.includes("中国传统制茶技艺及其相关习俗")
    )
  )
})

test("engage hub leaves the checked public source registry inside the quiz experience", () => {
  const source = readFileSync(engagePagePath, "utf8")

  assert.doesNotMatch(source, /teaQuizSources/)
  assert.doesNotMatch(source, /teaQuizSources\.map/)
  assert.doesNotMatch(source, /Last checked: 2026-07-15/)
})

test("tea quiz data contains no health or wellbeing claims", () => {
  const source = readFileSync(quizModulePath, "utf8")

  assert.doesNotMatch(source, /养生|疗效|health|wellbeing/i)
})
