import { getMediaCategories, mediaItems, type MediaKind } from "./media"

export type LibraryKind = MediaKind | "all"
export type LibraryView = "grid" | "list"

export type LibraryState = {
  query: string
  category: string
  kind: LibraryKind
  sort: "latest" | "oldest" | "title"
  view: LibraryView
  favoritesOnly: boolean
}

const defaultLibraryState: LibraryState = {
  query: "",
  category: "",
  kind: "all",
  sort: "latest",
  view: "grid",
  favoritesOnly: false
}

const mediaKinds = new Set<LibraryKind>(["all", "photo", "video", "poster"])
const sortValues = new Set<LibraryState["sort"]>(["latest", "oldest", "title"])
const viewValues = new Set<LibraryView>(["grid", "list"])
const mediaCategories = new Set(getMediaCategories(mediaItems).map((item) => item.value))

export function readLibraryState(searchParams: Pick<URLSearchParams, "get">): LibraryState {
  const kind = searchParams.get("kind")
  const category = searchParams.get("category")
  const sort = searchParams.get("sort")
  const view = searchParams.get("view")

  return {
    query: searchParams.get("q") ?? defaultLibraryState.query,
    category: category && mediaCategories.has(category) ? category : defaultLibraryState.category,
    kind: kind && mediaKinds.has(kind as LibraryKind) ? (kind as LibraryKind) : defaultLibraryState.kind,
    sort: sort && sortValues.has(sort as LibraryState["sort"])
      ? (sort as LibraryState["sort"])
      : defaultLibraryState.sort,
    view: view && viewValues.has(view as LibraryView) ? (view as LibraryView) : defaultLibraryState.view,
    favoritesOnly: searchParams.get("favorites") === "1"
  }
}

export function getLibraryHref(state: LibraryState): string {
  const searchParams = new URLSearchParams()

  if (state.query) searchParams.set("q", state.query)
  if (state.category) searchParams.set("category", state.category)
  if (state.kind !== "all") searchParams.set("kind", state.kind)
  if (state.sort !== "latest") searchParams.set("sort", state.sort)
  if (state.view !== "grid") searchParams.set("view", state.view)
  if (state.favoritesOnly) searchParams.set("favorites", "1")

  const query = searchParams.toString()
  return query ? `/library?${query}` : "/library"
}

export function getMediaDetailHref(slug: string, state: LibraryState): string {
  const searchParams = new URLSearchParams({ returnTo: getLibraryHref(state) })
  return `/media/${slug}?${searchParams.toString()}`
}

export function getLibraryReturnHref(returnTo: string | null): string {
  if (!returnTo) return "/library"

  try {
    const libraryUrl = new URL(returnTo, "https://mengdingshan-tea.invalid")

    if (libraryUrl.origin !== "https://mengdingshan-tea.invalid" || libraryUrl.pathname !== "/library") {
      return "/library"
    }

    return getLibraryHref(readLibraryState(libraryUrl.searchParams))
  } catch {
    return "/library"
  }
}
