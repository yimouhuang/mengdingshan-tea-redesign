export const MEDIA_FAVORITES_STORAGE_KEY = "mengding-media-favorites:v1"
export const MEDIA_FAVORITES_CHANGED_EVENT = "mengding-media-favorites-changed"

const MEDIA_FAVORITES_LIMIT = 100
const MEDIA_FAVORITES_RAW_LENGTH_LIMIT = 50_000
const MEDIA_FAVORITES_SCAN_LIMIT = 1_000

export function parseMediaFavorites(
  raw: string | null,
  knownSlugs: readonly string[]
): string[] {
  if (raw === null || raw.length > MEDIA_FAVORITES_RAW_LENGTH_LIMIT) {
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

    const scanLength = Math.min(parsed.length, MEDIA_FAVORITES_SCAN_LIMIT)

    for (let index = 0; index < scanLength; index += 1) {
      const value = parsed[index]

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
): { favorites: string[]; isFavorite: boolean; persisted: boolean } {
  const favorites = readMediaFavorites(storage, knownSlugs)
  const isFavorite = favorites.includes(slug)

  if (!knownSlugs.includes(slug)) {
    return { favorites, isFavorite, persisted: false }
  }

  const nextIsFavorite = !isFavorite
  const nextFavorites = nextIsFavorite
    ? [slug, ...favorites].slice(0, MEDIA_FAVORITES_LIMIT)
    : favorites.filter((favorite) => favorite !== slug)

  try {
    storage.setItem(MEDIA_FAVORITES_STORAGE_KEY, JSON.stringify(nextFavorites))
    return {
      favorites: nextFavorites,
      isFavorite: nextIsFavorite,
      persisted: true
    }
  } catch {
    return { favorites, isFavorite, persisted: false }
  }
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
