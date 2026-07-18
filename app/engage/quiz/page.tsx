import { ArchiveNav } from "@/components/archive-nav"
import { TeaQuiz } from "@/components/tea-quiz"

export default function TeaQuizPage() {
  return (
    <main className="min-h-screen bg-[#060806] pb-16 text-[#f3f0e5]">
      <ArchiveNav />
      <TeaQuiz />
    </main>
  )
}
