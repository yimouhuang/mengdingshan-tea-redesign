import { ArchiveNav } from "@/components/archive-nav"
import { TeaProfile } from "@/components/tea-profile"

export default function TeaProfilePage() {
  return (
    <main className="min-h-screen bg-[#060806] pb-16 text-[#f3f0e5]">
      <ArchiveNav />
      <TeaProfile />
    </main>
  )
}
