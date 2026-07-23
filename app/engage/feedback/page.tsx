import Link from "next/link"

import { ArchiveNav } from "@/components/archive-nav"

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
              反馈机制正在准备
            </h2>
            <p className="mt-3 max-w-2xl leading-[1.65] text-[#eee9de]/64">
              当前为功能说明页。正式反馈功能将在隐私说明、字段校验与后台审核机制配置完成后开放；提交内容不会公开展示。
            </p>
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
