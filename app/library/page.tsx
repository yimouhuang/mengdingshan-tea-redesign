import { ArchiveNav } from "@/components/archive-nav"
import { MediaLibraryBrowser } from "@/components/media-library-browser"

export default function LibraryPage() {
  return (
    <main className="min-h-screen bg-[#060806] pb-16 text-[#f3f0e5]">
      <ArchiveNav />
      <MediaLibraryBrowser />
    </main>
  )
}
