export const MEDIA_FAVORITES_STORAGE_KEY = "mengding-media-favorites:v1"
export const MEDIA_FAVORITES_CHANGED_EVENT = "mengding-media-favorites-changed"

const MEDIA_FAVORITES_LIMIT = 100

export function parseMediaFavorites(
  raw: string | null,
  knownSlugs: readonly string[]
): string[] {
  if (raw === null) {
    return []
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (!Array.isArray(parsed)) {
      return []
    }

    const known = new Set(knownSlugs)
    const favorites: string[] = []
    const seen = new Set<string>()

    for (const value of parsed) {
      if (
        typeof value === "string" &&
        known.has(value) &&
        !seen.has(value)
      ) {
        favorites.push(value)
        seen.add(value)

        if (favorites.length === MEDIA_FAVORITES_LIMIT) {
          break
        }
      }
    }

    return favorites
  } catch {
    return []
  }
}

export function readMediaFavorites(
  storage: Pick<Storage, "getItem">,
  knownSlugs: readonly string[]
): string[] {
  try {
    return parseMediaFavorites(storage.getItem(MEDIA_FAVORITES_STORAGE_KEY), knownSlugs)
  } catch {
    return []
  }
}

export function toggleMediaFavorite(
  storage: Pick<Storage, "getItem" | "setItem">,
  slug: string,
  knownSlugs: readonly string[]
): { favorites: string[]; isFavorite: boolean } {
  const favorites = readMediaFavorites(storage, knownSlugs)

  if (!knownSlugs.includes(slug)) {
    return { favorites, isFavorite: false }
  }

  const isFavorite = !favorites.includes(slug)
  const nextFavorites = isFavorite
    ? [slug, ...favorites].slice(0, MEDIA_FAVORITES_LIMIT)
    : favorites.filter((favorite) => favorite !== slug)

  try {
    storage.setItem(MEDIA_FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites))
  } catch {
    // Return the in-memory result when storage is unavailable or full.
  }

  return { favorites: nextFavorites, isFavorite }
}

export function shouldShowNoSavedMedia(
  favoritesOnly: boolean,
  favoriteSlugs: ReadonlySet<string>
): boolean {
  return favoritesOnly && favoriteSlugs.size === 0
}

export function buildMediaShareData(
  titleZh: string,
  titleEn: string,
  url: string
): { title: string; text: string; url: string } {
  return {
    title: `${titleZh} / ${titleEn}`,
    text: "在蒙顶山茶文化数字影像馆查看这条档案 / View this record in the Mengding Mountain Tea Visual Archive.",
    url
  }
}
