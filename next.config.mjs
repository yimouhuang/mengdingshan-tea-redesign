function getMediaRemotePatterns() {
  const mediaBaseUrl = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.trim()

  if (!mediaBaseUrl) {
    return []
  }

  let parsedUrl

  try {
    parsedUrl = new URL(mediaBaseUrl)
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

  const basePath = parsedUrl.pathname.replace(/\/+$/, "")

  return [
    {
      protocol: "https",
      hostname: parsedUrl.hostname,
      port: parsedUrl.port,
      pathname: `${basePath}/media/**`,
      search: ""
    }
  ]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: getMediaRemotePatterns()
  }
}

export default nextConfig
