import Link from "next/link"

const navItems = [
  { href: "/", label: "Home" },
  { href: "/library", label: "Collection" },
  { href: "/media/ganlu-close-study", label: "Archive" },
  { href: "/library", label: "Research" },
  { href: "/library", label: "Visit" }
]

type SiteNavProps = {
  compactBrand?: boolean
}

export function SiteNav({ compactBrand = false }: SiteNavProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#080908]/95 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-[1180px] items-center justify-between px-5 text-[#f4f1e8] md:px-0">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="relative h-9 w-9 shrink-0 rounded-full border border-[#d3b35f]/45">
            <span className="absolute left-2 top-3 h-4 w-2 -rotate-45 rounded-full bg-[#d3b35f]" />
            <span className="absolute right-2 top-2 h-5 w-2 rotate-45 rounded-full border border-[#f4f1e8]/70" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[0.82rem] font-semibold uppercase tracking-[0.08em] md:text-lg">
              {compactBrand ? "MENGDING TEA" : "MENGDING TEA"}
            </span>
            <span className="block text-xs text-[#f4f1e8]/72 md:text-sm">
              {compactBrand ? "Museum" : "Digital Archive"}
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-[#f4f1e8]/88 md:flex">
          {navItems.map((item) => (
            <Link key={`${item.href}-${item.label}`} href={item.href} className="transition hover:text-[#f2d37a]">
              {item.label}
            </Link>
          ))}
          <span className="h-6 w-px bg-white/12" />
          <span className="text-[#f4f1e8]/80">中 / EN</span>
          <span className="text-xl leading-none text-[#f4f1e8]/82">⌕</span>
        </div>

        <Link
          href="/library"
          className="rounded-full border border-white/14 px-3 py-2 text-xs text-[#f4f1e8]/86 md:hidden"
        >
          Library
        </Link>
      </nav>
    </header>
  )
}
