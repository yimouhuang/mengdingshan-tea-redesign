import { teaProfiles, type TeaProfileSlug } from "./tea-profile"

export const storageKey = "mengdingshan-tea-profile-v1"
export const teaProfileRecordVersion = 1

export type TeaProfileRecord = {
  version: 1
  completedAt: string
  primaryId: TeaProfileSlug
  secondaryId: TeaProfileSlug
}

const teaProfileIds = new Set(teaProfiles.map((profile) => profile.slug))

function isIsoTimestamp(value: unknown): value is string {
  if (typeof value !== "string") {
    return false
  }

  const completedAt = new Date(value)
  return !Number.isNaN(completedAt.valueOf()) && completedAt.toISOString() === value
}

function isKnownTeaProfileId(value: unknown): value is TeaProfileSlug {
  return typeof value === "string" && teaProfileIds.has(value as TeaProfileSlug)
}

export function parseTeaProfileRecord(value: string | null): TeaProfileRecord | null {
  if (!value) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(value)

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return null
    }

    const record = parsed as Partial<TeaProfileRecord>
    const keys = Object.keys(record).sort()

    if (
      keys.length !== 4 ||
      keys.join(",") !== "completedAt,primaryId,secondaryId,version" ||
      record.version !== teaProfileRecordVersion ||
      !isIsoTimestamp(record.completedAt) ||
      !isKnownTeaProfileId(record.primaryId) ||
      !isKnownTeaProfileId(record.secondaryId) ||
      record.primaryId === record.secondaryId
    ) {
      return null
    }

    return {
      version: teaProfileRecordVersion,
      completedAt: record.completedAt,
      primaryId: record.primaryId,
      secondaryId: record.secondaryId
    }
  } catch {
    return null
  }
}

export function writeTeaProfileRecord(record: TeaProfileRecord): string {
  return JSON.stringify({
    version: teaProfileRecordVersion,
    completedAt: record.completedAt,
    primaryId: record.primaryId,
    secondaryId: record.secondaryId
  })
}
