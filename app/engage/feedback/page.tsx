import Link from "next/link"

import { ArchiveNav } from "@/components/archive-nav"

const archiveFeedbackFormUrl = "https://wj.qq.com/s2/27386962/28be/"

export default function EngageFeedbackPage() {
  return (
    <main className="min-h-screen bg-[#060806] pb-16 text-[#f3f0e5]">
      <ArchiveNav />

      <section
        className="archive-container py-8 md:py-12"
        aria-labelledby="archive-feedback-heading"
      >
        <div className="max-w-3xl border-y border-[#d6b45a]/55 py-8 sm:py-11">
          <p className="text-xs tracking-[.24em] text-[#d6b45a]">
            参与 / <span lang="en">ENGAGE</span>
          </p>

          <h1
            id="archive-feedback-heading"
            className="mt-3 font-display text-4xl leading-tight text-[#f3f0e5] md:text-6xl"
          >
            共建档案
            <span
              lang="en"
              className="mt-3 block text-[.5em] font-medium text-[#eee9de]"
            >
              Help improve the archive
            </span>
          </h1>

          <p className="mt-6 max-w-2xl leading-7 text-[#eee9de]/72">
            发现资料错误、拥有相关线索，或希望帮助完善本站？欢迎告诉我们。
          </p>

          <div className="mt-9 border-t border-white/15 pt-6">
            <h2 className="font-display text-2xl leading-tight text-[#f3f0e5]">
              通过腾讯问卷提交
              <span lang="en" className="mt-2 block text-[.62em] font-medium text-[#eee9de]">
                Submit through Tencent Questionnaire
              </span>
            </h2>
            <p className="mt-3 max-w-2xl leading-[1.65] text-[#eee9de]/64">
              腾讯问卷将在新标签页中打开。填写内容仅供后台人工审核与必要联系，不会未经审核公开展示；请勿提交身份证号、住址等敏感个人信息。
            </p>
            <a
              href={archiveFeedbackFormUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-[2px] border border-[#d6b45a] bg-[#060806]/30 px-[18px] text-sm text-[#fff0b4] transition hover:bg-[#d6b45a]/13 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
            >
              填写共建档案 / <span lang="en" className="ml-1">Fill in questionnaire</span>
            </a>
          </div>

          <Link
            href="/engage"
            className="mt-8 inline-flex min-h-11 items-center justify-center rounded-[2px] border border-[#d6b45a] bg-[#060806]/30 px-[18px] text-sm text-[#fff0b4] transition hover:bg-[#d6b45a]/13 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f2d37a] focus-visible:ring-offset-2 focus-visible:ring-offset-[#060806]"
          >
            返回参与 / <span lang="en" className="ml-1">Back to engage</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
