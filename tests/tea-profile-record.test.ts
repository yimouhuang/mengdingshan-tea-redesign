import assert from "node:assert/strict"
import test from "node:test"

import {
  parseTeaProfileRecord,
  storageKey,
  writeTeaProfileRecord,
  type TeaProfileRecord
} from "../lib/tea-profile-record"

const latestRecord: TeaProfileRecord = {
  version: 1,
  completedAt: "2026-07-15T08:30:00.000Z",
  primaryId: "mengding-huangya",
  secondaryId: "mengding-ganlu"
}

test("tea-profile storage uses the versioned latest-result key", () => {
  assert.equal(storageKey, "mengdingshan-tea-profile-v1")
})

test("a latest profile record contains only the valid versioned result fields", () => {
  const written = writeTeaProfileRecord(latestRecord)

  assert.deepEqual(JSON.parse(written), latestRecord)
  assert.deepEqual(parseTeaProfileRecord(written), latestRecord)
})

test("missing, malformed, and invalid latest profile records return null", () => {
  const invalidRecords = [
    null,
    "",
    "not JSON",
    JSON.stringify({ ...latestRecord, version: 2 }),
    JSON.stringify({ ...latestRecord, primaryId: "unknown-tea" }),
    JSON.stringify({ ...latestRecord, secondaryId: "unknown-tea" }),
    JSON.stringify({ ...latestRecord, secondaryId: latestRecord.primaryId }),
    JSON.stringify({ ...latestRecord, completedAt: "2026-07-15" }),
    JSON.stringify({ ...latestRecord, completedAt: "not-a-date" }),
    JSON.stringify({ ...latestRecord, answers: ["not retained"] })
  ]

  for (const value of invalidRecords) {
    assert.equal(parseTeaProfileRecord(value), null)
  }
})
