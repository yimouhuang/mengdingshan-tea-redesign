const mediaPathPrefix = "/media/"

function normalizeMediaBaseUrl(mediaBaseUrl?: string): string {
  const configuredUrl = mediaBaseUrl?.trim()

  if (!configuredUrl) {
    return ""
  }

  let parsedUrl: URL

  try {
    parsedUrl = new URL(configuredUrl)
  } catch {
    throw new Error("NEXT_PUBLIC_MEDIA_BASE_URL must be a valid HTTPS URL")
  }

  if (parsedUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_MEDIA_BASE_URL must use HTTPS")
  }

  if (parsedUrl.username || parsedUrl.password || parsedUrl.search || parsedUrl.hash) {
    throw new Error(
      "NEXT_PUBLIC_MEDIA_BASE_URL must not include credentials, a query string, or a hash"
    )
  }

  return parsedUrl.toString().replace(/\/+$/, "")
}

export function resolveMediaUrl(
  mediaPath: string,
  mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL
): string {
  if (!mediaPath.startsWith(mediaPathPrefix)) {
    throw new Error(`Media paths must start with ${mediaPathPrefix}`)
  }

  const normalizedBaseUrl = normalizeMediaBaseUrl(mediaBaseUrl)

  return normalizedBaseUrl ? `${normalizedBaseUrl}${mediaPath}` : mediaPath
}
