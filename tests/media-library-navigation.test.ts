import assert from "node:assert/strict"
import test from "node:test"

type LibraryState = {
  query: string
  category: string
  kind: "all" | "photo" | "video" | "poster"
  sort: "latest" | "oldest" | "title"
  view: "grid" | "list"
  favoritesOnly: boolean
}

type MediaLibraryNavigation = {
  readLibraryState: (searchParams: Pick<URLSearchParams, "get">) => LibraryState
  getLibraryHref: (state: LibraryState) => string
  getMediaDetailHref: (slug: string, state: LibraryState) => string
  getLibraryReturnHref: (returnTo: string | null) => string
}

const navigationModuleSpecifier = "../lib/media-library-navigation"
async function loadNavigation(): Promise<MediaLibraryNavigation | null> {
  return (await import(navigationModuleSpecifier).catch(() => null)) as
    | MediaLibraryNavigation
    | null
}

test("library navigation restores every supported view state through a media detail URL", async () => {
  const navigation = await loadNavigation()
  assert.ok(navigation, "Missing media-library navigation helpers")

  const state = navigation.readLibraryState(
    new URLSearchParams(
      "q=%E8%8C%B6%E5%9B%AD&category=Tea+Heritage&kind=poster&sort=title&view=list&favorites=1"
    )
  )

  assert.deepEqual(state, {
    query: "茶园",
    category: "Tea Heritage",
    kind: "poster",
    sort: "title",
    view: "list",
    favoritesOnly: true
  })

  const libraryHref = "/library?q=%E8%8C%B6%E5%9B%AD&category=Tea+Heritage&kind=poster&sort=title&view=list&favorites=1"
  assert.equal(navigation.getLibraryHref(state), libraryHref)
  assert.equal(
    navigation.getMediaDetailHref("origin-of-tea", state),
    "/media/origin-of-tea?returnTo=%2Flibrary%3Fq%3D%25E8%258C%25B6%25E5%259B%25AD%26category%3DTea%2BHeritage%26kind%3Dposter%26sort%3Dtitle%26view%3Dlist%26favorites%3D1"
  )
  assert.equal(navigation.getLibraryReturnHref(libraryHref), libraryHref)
})

test("library navigation rejects unsupported return paths and invalid filter values", async () => {
  const navigation = await loadNavigation()
  assert.ok(navigation, "Missing media-library navigation helpers")

  assert.equal(navigation.getLibraryReturnHref("/explore"), "/library")
  assert.deepEqual(
    navigation.readLibraryState(
      new URLSearchParams("category=Unverified&kind=audio&sort=random&view=wall&favorites=true")
    ),
    {
      query: "",
      category: "",
      kind: "all",
      sort: "latest",
      view: "grid",
      favoritesOnly: false
    }
  )
})
