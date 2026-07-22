"use client"

import Link from "next/link"
import { useLayoutEffect, useState } from "react"
import { getLibraryReturnHref } from "@/lib/media-library-navigation"

export function MediaLibraryBackLink() {
  const [href, setHref] = useState("/library")

  useLayoutEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    setHref(getLibraryReturnHref(searchParams.get("returnTo")))
  }, [])

  return (
    <Link href={href}>
      ← 返回影像库 / Back to Media Library
    </Link>
  )
}
