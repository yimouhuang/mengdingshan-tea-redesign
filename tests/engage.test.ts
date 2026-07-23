import assert from "node:assert/strict"
import { existsSync, readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const engagePagePath = resolve(projectRoot, "app/engage/page.tsx")
const feedbackPagePath = resolve(projectRoot, "app/engage/feedback/page.tsx")
const quizPagePath = resolve(projectRoot, "app/engage/quiz/page.tsx")
const teaProfilePagePath = resolve(projectRoot, "app/engage/tea-profile/page.tsx")

test("engage is a real archive route with the prototype hub heading and focused participation hierarchy", () => {
  assert.equal(existsSync(engagePagePath), true, "expected app/engage/page.tsx to exist")
  const source = readFileSync(engagePagePath, "utf8")

  assert.match(source, /ArchiveNav/)
  assert.match(source, /\/engage\/quiz/)
  assert.match(source, /\/engage\/tea-profile/)
  assert.match(source, /min-h-screen bg-\[#060806\] pb-16 text-\[#f3f0e5\]/)
  assert.match(source, /\u53c2\u4e0e\s*\/\s*<span lang="en">ENGAGE<\/span>/)
  assert.match(source, /\u4ece\u5f71\u50cf\uff0c\u8d70\u8fd1\u8499\u9876\u8336/)
  assert.match(source, /\u4ee5\u504f\u597d\u4e3a\u8d77\u70b9\uff0c\u8fdb\u5165\u53ef\u56de\u67e5\u7684\u8499\u9876\u8336\u6587\u5316\u8bb0\u5f55\u3002/)
  assert.match(source, /Seven preferences lead to traceable Mengding tea records\./)
  assert.doesNotMatch(source, /<header[^>]*border-b/)
  assert.doesNotMatch(source, /<video\b|\.mp4|leaderboard|forum|placeholder/i)
})

test("engage implements the prototype 1.8/.78 media feature and vertically balanced quiz path", () => {
  const source = readFileSync(engagePagePath, "utf8")
  const primaryTeaCard = source.match(
    /<Link\s+href="\/engage\/tea-profile"[\s\S]*?<\/Link>/
  )
  const quizPath = source.match(
    /<article[\s\S]*?<Link\s+href="\/engage\/quiz"[\s\S]*?<\/Link>[\s\S]*?<\/article>/
  )

  assert.match(source, /import Image from "next\/image"/)
  assert.match(source, /min-\[901px\]:grid-cols-\[minmax\(0,1\.8fr\)_minmax\(300px,\.78fr\)\]/)
  assert.match(source, /gap-\[22px\]/)
  assert.match(source, /max-\[900px\]:grid-cols-1/)
  assert.match(source, /src=\{resolveMediaUrl\("\/media\/photos\/tea-garden-in-mist\.jpg"\)\}/)
  assert.ok(primaryTeaCard, "expected one primary tea-profile feature link")
  assert.match(primaryTeaCard[0], /min-h-\[490px\]/)
  assert.match(primaryTeaCard[0], /rounded-2xl/)
  assert.match(primaryTeaCard[0], /linear-gradient\(90deg/)
  assert.match(primaryTeaCard[0], /linear-gradient\(0deg/)
  assert.match(primaryTeaCard[0], /Find your Mengding tea/)
  assert.match(primaryTeaCard[0], /\u5f00\u59cb\u5bfb\u627e/)
  assert.match(primaryTeaCard[0], /Start finding/)
  assert.ok(quizPath, "expected a concrete quiz path")
  assert.match(quizPath[0], /min-h-\[490px\]/)
  assert.match(quizPath[0], /border-y/)
  assert.match(quizPath[0], /justify-between/)
  assert.match(quizPath[0], /Tea knowledge quiz/)
  assert.match(quizPath[0], /10 questions/)
  assert.match(quizPath[0], /Traceable sources/)
  assert.match(quizPath[0], /\u5f00\u59cb\u95ee\u7b54/)
  assert.match(quizPath[0], /Start quiz/)
})

test("engage exposes a static archive-contribution route without submission behavior", () => {
  const source = readFileSync(engagePagePath, "utf8")
  const quizIndex = source.indexOf('href="/engage/quiz"')
  const feedbackIndex = source.indexOf('href="/engage/feedback"')

  assert.equal(existsSync(feedbackPagePath), true, "expected app/engage/feedback/page.tsx to exist")
  assert.ok(quizIndex >= 0, "expected the established quiz entry")
  assert.ok(feedbackIndex > quizIndex, "expected the archive-contribution entry below the quiz entry")
  assert.match(source, /\u5171\u5efa\u6863\u6848/)
  assert.match(source, /\u63d0\u4ea4\u53cd\u9988/)
  assert.match(source, /href="\/engage\/feedback"/)
  assert.match(source, /border-\[#d6b45a\]\/55/)
  assert.doesNotMatch(source, /(?:fetch\s*\(|axios\.|XMLHttpRequest|\/api\/|beforeunload|pagehide|visibilitychange|mouseleave|mouseout|exit[-\s]?intent)/i)

  const feedbackSource = readFileSync(feedbackPagePath, "utf8")
  assert.match(feedbackSource, /ArchiveNav/)
  assert.match(feedbackSource, /\u5171\u5efa\u6863\u6848/)
  assert.match(feedbackSource, /\u53d1\u73b0\u8d44\u6599\u9519\u8bef\u3001\u62e5\u6709\u76f8\u5173\u7ebf\u7d22\uff0c\u6216\u5e0c\u671b\u5e2e\u52a9\u5b8c\u5584\u672c\u7ad9\uff1f\u6b22\u8fce\u544a\u8bc9\u6211\u4eec\u3002/)
  assert.match(feedbackSource, /\u5f53\u524d\u4e3a\u529f\u80fd\u8bf4\u660e\u9875/)
  assert.doesNotMatch(feedbackSource, /(?:<form\b|fetch\s*\(|axios\.|XMLHttpRequest|\/api\/|beforeunload|pagehide|visibilitychange|mouseleave|mouseout|exit[-\s]?intent)/i)
})

test("engage gives both prototype CTAs the shared restrained archive-button treatment", () => {
  const source = readFileSync(engagePagePath, "utf8")
  const featureCta = source.match(/<span className="([^"]+)">[\s\S]*?Start finding/)
  const quizCta = source.match(
    /<Link\s+href="\/engage\/quiz"\s+className="([^"]+)"[\s\S]*?Start quiz/
  )
  const prototypeButtonClasses = [
    "inline-flex",
    "min-h-11",
    "w-fit",
    "items-center",
    "justify-center",
    "rounded-[2px]",
    "border",
    "border-[#d6b45a]",
    "bg-[#060806]/30",
    "px-[18px]",
    "text-sm",
    "text-[#fff0b4]",
    "hover:bg-[#d6b45a]/13"
  ]

  assert.ok(featureCta, "expected the feature CTA span")
  assert.ok(quizCta, "expected the quiz CTA link")

  for (const className of prototypeButtonClasses) {
    assert.ok(featureCta[1].split(/\s+/).includes(className), `expected feature CTA class ${className}`)
    assert.ok(quizCta[1].split(/\s+/).includes(className), `expected quiz CTA class ${className}`)
  }

  assert.equal(featureCta[1].split(/\s+/).includes("bg-[#d6b45a]"), false)
  assert.equal(featureCta[1].split(/\s+/).includes("text-[#060806]"), false)
  assert.equal(quizCta[1].split(/\s+/).includes("bg-[#d6b45a]"), false)
  assert.equal(quizCta[1].split(/\s+/).includes("text-[#060806]"), false)
})

test("engage caps feature and archive image download sizes at the archive container width", () => {
  const source = readFileSync(engagePagePath, "utf8")

  assert.match(
    source,
    /sizes="\(min-width: 1640px\) 1100px, \(min-width: 901px\) 64vw, 100vw"/
  )
  assert.match(
    source,
    /sizes="\(min-width: 1640px\) 272px, \(min-width: 901px\) calc\(17\.8vw - 21px\), 30vw"/
  )
  assert.doesNotMatch(source, /sizes="\(min-width: 901px\) 64vw, 100vw"/)
  assert.doesNotMatch(source, /sizes="\(min-width: 901px\) 23vw, 30vw"/)
})

test("engage implements the prototype archive row with three caption-only real record links", () => {
  const source = readFileSync(engagePagePath, "utf8")

  for (const slug of [
    "mengding-mountain-gateway",
    "forest-stone-steps",
    "ancient-tea-tree-of-mengding"
  ]) {
    assert.match(source, new RegExp(`"${slug}"`), `expected the real ${slug} archive source`)
  }

  assert.doesNotMatch(source, /"(?:way-up-the-mountain|tea-garden-overlook)"/)

  assert.match(source, /\u4ece\u5f71\u50cf\u5f00\u59cb\uff0c\u4e0d\u6b62\u505c\u5728\u7ed3\u679c/)
  assert.match(source, /\u627e\u8336\u7ed3\u679c\u4e0e\u95ee\u7b54\u4f9d\u636e\u90fd\u53ef\u4ee5\u56de\u5230\u672c\u9986\u7684\u771f\u5b9e\u5f71\u50cf\u6761\u76ee\u7ee7\u7eed\u6d4f\u89c8\u3002/)
  assert.match(source, /min-\[901px\]:grid-cols-\[minmax\(0,1fr\)_minmax\(0,1\.15fr\)\]/)
  assert.match(source, /grid-cols-3/)
  assert.match(source, /aspect-\[1\.35\/1\]/)
  assert.match(source, /archiveInvitations\.map\(/)
  assert.match(source, /href=\{`\/media\/\$\{item\.slug\}`\}/)
  assert.doesNotMatch(source, /Source boundary|Only traceable public materials|teaQuizSources|EngageRecordSummary|Local results/i)
})

test("tea-profile route uses the shared archive shell without route-level framing copy", () => {
  assert.equal(existsSync(teaProfilePagePath), true, "expected app/engage/tea-profile/page.tsx to exist")
  const source = readFileSync(teaProfilePagePath, "utf8")

  assert.match(source, /ArchiveNav/)
  assert.match(source, /TeaProfile/)
  assert.match(source, /min-h-screen bg-\[#060806\] pb-16 text-\[#f3f0e5\]/)
  assert.doesNotMatch(source, /<video\b|\.mp4|leaderboard|forum|price|cart/i)
})

test("quiz route is only the archive shell, leaving all confirmed prototype headings to TeaQuiz", () => {
  assert.equal(existsSync(quizPagePath), true, "expected app/engage/quiz/page.tsx to exist")
  const source = readFileSync(quizPagePath, "utf8")

  assert.match(source, /ArchiveNav/)
  assert.match(source, /TeaQuiz/)
  assert.match(source, /min-h-screen bg-\[#060806\] pb-16 text-\[#f3f0e5\]/)
  assert.doesNotMatch(source, /EngageRecordSummary|Back to Engage|Traceable sources|<h1|<section/)
  assert.doesNotMatch(source, /<video\b|\.mp4|leaderboard|forum|placeholder/i)
})

test("the quiz route has no unconditional local-record summary while the engage hub stays action-led", () => {
  const engageSource = readFileSync(engagePagePath, "utf8")
  const quizSource = readFileSync(quizPagePath, "utf8")

  assert.doesNotMatch(engageSource, /EngageRecordSummary/)
  assert.doesNotMatch(quizSource, /EngageRecordSummary/)
})

test("engage routes mark their bilingual English copy with language metadata", () => {
  const engageSource = readFileSync(engagePagePath, "utf8")
  const quizSource = readFileSync(quizPagePath, "utf8")

  assert.match(engageSource, /<span lang="en"[^>]*>\s*Tea knowledge quiz/)
  assert.match(engageSource, /<span lang="en"[^>]*>\s*Find your Mengding tea/)
  assert.match(engageSource, /<span lang="en"[^>]*>\s*Seven preferences lead to traceable Mengding tea records\./)
  assert.doesNotMatch(quizSource, /Tea knowledge quiz|Traceable sources/)
})

test("the source boundary stays inside the opened result reviews rather than the quiz route shell", () => {
  const engageSource = readFileSync(engagePagePath, "utf8")
  const quizSource = readFileSync(quizPagePath, "utf8")

  assert.doesNotMatch(quizSource, /Traceable sources/)
  assert.doesNotMatch(quizSource, /Source boundary:/)
  assert.doesNotMatch(engageSource, /Source boundary|Only traceable public materials|Each question links to a traceable source/i)
  assert.doesNotMatch(quizSource, /every result provides its official source/i)
})
