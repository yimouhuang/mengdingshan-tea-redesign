"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import {
  archiveNavItems,
  isArchiveNavItemActive
} from "@/lib/archive-navigation"

export function ArchiveNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false)

    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [])

  return (
    <header className="archive-header">
      <nav className="archive-nav archive-container" aria-label="Main navigation">
        <Link href="/" className="archive-brand">
          <span className="tea-mark" aria-hidden="true">◼</span>
          <span>
            <b>蒙顶山茶文化数字影像馆</b>
            <small>Mengding Mountain Tea Visual Archive</small>
          </span>
        </Link>
        <div className={`archive-links ${open ? "is-open" : ""}`} id="archive-navigation">
          {archiveNavItems.map((item) => {
            const active = isArchiveNavItemActive(item.href, pathname)

            return (
              <Link
                key={item.labelEn}
                href={item.href}
                onClick={() => setOpen(false)}
                className={active ? "is-active" : ""}
                aria-current={active ? "page" : undefined}
              >
                <span>{item.labelZh}</span>
                <small>{item.labelEn}</small>
              </Link>
            )
          })}
        </div>
        <div className="archive-actions">
          <Link href="/library" className="archive-icon" aria-label="Search archive">⌕</Link>
          <span className="archive-language">中文 / EN</span>
          <button
            className="archive-menu"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-controls="archive-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <i />
            <i />
            <i />
          </button>
        </div>
      </nav>
    </header>
  )
}
