export type ArchiveNavItem = {
  labelZh: string
  labelEn: string
  href: string
}

export const archiveNavItems: ArchiveNavItem[] = [
  { labelZh: "首页", labelEn: "Home", href: "/" },
  { labelZh: "影像", labelEn: "Media", href: "/library" },
  { labelZh: "探索", labelEn: "Explore", href: "/explore" },
  { labelZh: "参与", labelEn: "Engage", href: "/engage" }
]

export function isArchiveNavItemActive(
  href: string | undefined,
  pathname: string
): boolean {
  if (typeof href !== "string") {
    return false
  }

  if (href === "/") {
    return pathname === "/"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}
