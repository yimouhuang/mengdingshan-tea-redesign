export type MediaSharePayload = {
  title: string
  text: string
  url: string
}

type MediaShareNavigator = {
  share?: (data: MediaSharePayload) => Promise<void>
  clipboard?: {
    writeText: (text: string) => Promise<void>
  }
}

export type MediaShareResult = "shared" | "copied" | "aborted" | "failed"

function isAbortError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "name" in error &&
    error.name === "AbortError"
  )
}

export async function shareMediaRecord(
  navigatorLike: MediaShareNavigator,
  payload: MediaSharePayload
): Promise<MediaShareResult> {
  try {
    if (typeof navigatorLike.share === "function") {
      await navigatorLike.share(payload)
      return "shared"
    }

    if (!navigatorLike.clipboard) {
      return "failed"
    }

    await navigatorLike.clipboard.writeText(payload.url)
    return "copied"
  } catch (error) {
    return isAbortError(error) ? "aborted" : "failed"
  }
}
