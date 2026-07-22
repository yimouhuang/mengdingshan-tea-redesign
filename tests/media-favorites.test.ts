import assert from "node:assert/strict"
import test from "node:test"

import {
  MEDIA_FAVORITES_STORAGE_KEY,
  buildMediaShareData,
  parseMediaFavorites,
  readMediaFavorites,
  shouldShowNoSavedMedia,
  toggleMediaFavorite
} from "../lib/media-favorites"

test("parseMediaFavorites returns an empty list for absent or invalid input", () => {
  assert.deepEqual(parseMediaFavorites(null, ["known"]), [])
  assert.deepEqual(parseMediaFavorites("not-json", ["known"]), [])
  assert.deepEqual(parseMediaFavorites('{"slug":"known"}', ["known"]), [])
})

test("parseMediaFavorites keeps unique known string slugs in input order", () => {
  const raw = JSON.stringify(["second", "unknown", "first", "second", 42, "third"])

  assert.deepEqual(
    parseMediaFavorites(raw, ["first", "second", "third"]),
    ["second", "first", "third"]
  )
})

test("parseMediaFavorites limits the result to one hundred entries", () => {
  const knownSlugs = Array.from({ length: 101 }, (_, index) => `record-${index}`)

  assert.deepEqual(
    parseMediaFavorites(JSON.stringify(knownSlugs), knownSlugs),
    knownSlugs.slice(0, 100)
  )
})

test("parseMediaFavorites rejects raw payloads larger than fifty thousand characters", () => {
  assert.deepEqual(parseMediaFavorites("[" + " ".repeat(50_000) + "]", ["known"]), [])
})

test("parseMediaFavorites scans at most the first one thousand array items", () => {
  const invalidThenKnown = [...Array.from({ length: 1_000 }, () => null), "known"]
  const duplicatesThenLateSlug = [
    ...Array.from({ length: 1_000 }, () => "first"),
    "second"
  ]

  assert.deepEqual(parseMediaFavorites(JSON.stringify(invalidThenKnown), ["known"]), [])
  assert.deepEqual(
    parseMediaFavorites(JSON.stringify(duplicatesThenLateSlug), ["first", "second"]),
    ["first"]
  )
})

test("readMediaFavorites returns an empty list when storage throws", () => {
  const storage = {
    getItem() {
      throw new Error("storage unavailable")
    }
  }

  assert.deepEqual(readMediaFavorites(storage, ["known"]), [])
})

test("toggleMediaFavorite adds a new favorite at the front", () => {
  let writtenKey = ""
  let writtenValue = ""
  const storage = {
    getItem() {
      return JSON.stringify(["second"])
    },
    setItem(key: string, value: string) {
      writtenKey = key
      writtenValue = value
    }
  }

  assert.deepEqual(toggleMediaFavorite(storage, "first", ["first", "second"]), {
    favorites: ["first", "second"],
    isFavorite: true,
    persisted: true
  })
  assert.equal(writtenKey, MEDIA_FAVORITES_STORAGE_KEY)
  assert.equal(writtenValue, JSON.stringify(["first", "second"]))
})

test("toggleMediaFavorite removes an existing favorite", () => {
  let writtenValue = ""
  const storage = {
    getItem() {
      return JSON.stringify(["first", "second"])
    },
    setItem(_key: string, value: string) {
      writtenValue = value
    }
  }

  assert.deepEqual(toggleMediaFavorite(storage, "first", ["first", "second"]), {
    favorites: ["second"],
    isFavorite: false,
    persisted: true
  })
  assert.equal(writtenValue, JSON.stringify(["second"]))
})

test("toggleMediaFavorite ignores an unknown slug without writing", () => {
  let writes = 0
  const storage = {
    getItem() {
      return JSON.stringify(["first"])
    },
    setItem() {
      writes += 1
    }
  }

  assert.deepEqual(toggleMediaFavorite(storage, "unknown", ["first"]), {
    favorites: ["first"],
    isFavorite: false,
    persisted: false
  })
  assert.equal(writes, 0)
})

test("toggleMediaFavorite keeps the original state when adding cannot be persisted", () => {
  const storage = {
    getItem() {
      return null
    },
    setItem() {
      throw new Error("quota exceeded")
    }
  }

  assert.deepEqual(toggleMediaFavorite(storage, "first", ["first"]), {
    favorites: [],
    isFavorite: false,
    persisted: false
  })
})

test("toggleMediaFavorite keeps the original state when removal cannot be persisted", () => {
  const storage = {
    getItem() {
      return JSON.stringify(["first"])
    },
    setItem() {
      throw new Error("quota exceeded")
    }
  }

  assert.deepEqual(toggleMediaFavorite(storage, "first", ["first"]), {
    favorites: ["first"],
    isFavorite: true,
    persisted: false
  })
})

test("toggleMediaFavorite keeps at most one hundred favorites when adding", () => {
  const knownSlugs = Array.from({ length: 101 }, (_, index) => `record-${index}`)
  const existing = knownSlugs.slice(1)
  let writtenValue = ""
  const storage = {
    getItem() {
      return JSON.stringify(existing)
    },
    setItem(_key: string, value: string) {
      writtenValue = value
    }
  }

  const result = toggleMediaFavorite(storage, knownSlugs[0], knownSlugs)

  assert.equal(result.persisted, true)
  assert.equal(result.favorites.length, 100)
  assert.deepEqual(result.favorites, [knownSlugs[0], ...existing.slice(0, 99)])
  assert.equal(writtenValue, JSON.stringify(result.favorites))
})

test("shouldShowNoSavedMedia only selects the dedicated empty state with no favorites", () => {
  assert.equal(shouldShowNoSavedMedia(true, new Set()), true)
  assert.equal(shouldShowNoSavedMedia(true, new Set(["saved-record"])), false)
  assert.equal(shouldShowNoSavedMedia(false, new Set()), false)
})

test("buildMediaShareData creates the bilingual archive payload", () => {
  assert.deepEqual(
    buildMediaShareData("云岚茶园", "Tea Garden in Mist", "https://example.test/media/mist"),
    {
      title: "云岚茶园 / Tea Garden in Mist",
      text: "在蒙顶山茶文化数字影像馆查看这条档案 / View this record in the Mengding Mountain Tea Visual Archive.",
      url: "https://example.test/media/mist"
    }
  )
})
