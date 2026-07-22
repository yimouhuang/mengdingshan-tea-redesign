import assert from "node:assert/strict"
import test from "node:test"

import {
  shareMediaRecord,
  type MediaSharePayload
} from "../lib/media-share"

const payload: MediaSharePayload = {
  title: "云岚茶园 / Tea Garden in Mist",
  text: "Archive record",
  url: "https://example.test/media/mist"
}

test("shareMediaRecord prefers Web Share over the clipboard", async () => {
  const calls: string[] = []
  const navigatorLike = {
    async share(data: MediaSharePayload) {
      calls.push(`share:${data.url}`)
    },
    clipboard: {
      async writeText(url: string) {
        calls.push(`copy:${url}`)
      }
    }
  }

  assert.equal(await shareMediaRecord(navigatorLike, payload), "shared")
  assert.deepEqual(calls, [`share:${payload.url}`])
})

test("shareMediaRecord copies the URL when Web Share is unavailable", async () => {
  const calls: string[] = []
  const navigatorLike = {
    clipboard: {
      async writeText(url: string) {
        calls.push(`copy:${url}`)
      }
    }
  }

  assert.equal(await shareMediaRecord(navigatorLike, payload), "copied")
  assert.deepEqual(calls, [`copy:${payload.url}`])
})

test("shareMediaRecord reports an aborted Web Share without copying", async () => {
  const calls: string[] = []
  const abortError = new Error("cancelled")
  abortError.name = "AbortError"
  const navigatorLike = {
    async share() {
      calls.push("share")
      throw abortError
    },
    clipboard: {
      async writeText() {
        calls.push("copy")
      }
    }
  }

  assert.equal(await shareMediaRecord(navigatorLike, payload), "aborted")
  assert.deepEqual(calls, ["share"])
})

test("shareMediaRecord reports failed share and clipboard operations", async () => {
  assert.equal(
    await shareMediaRecord(
      {
        async share() {
          throw new Error("share unavailable")
        }
      },
      payload
    ),
    "failed"
  )
  assert.equal(
    await shareMediaRecord(
      {
        clipboard: {
          async writeText() {
            throw new Error("clipboard blocked")
          }
        }
      },
      payload
    ),
    "failed"
  )
})
