import assert from "node:assert/strict"
import { spawnSync } from "node:child_process"
import { readFileSync } from "node:fs"
import { dirname, resolve } from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"

import { resolveMediaUrl } from "../lib/media"

const projectDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")

function loadNextConfig(environment: Record<string, string> = {}) {
  const result = spawnSync(
    process.execPath,
    [
      "--input-type=module",
      "--eval",
      'import config from "./next.config.mjs"; process.stdout.write(JSON.stringify(config))'
    ],
    {
      cwd: projectDirectory,
      encoding: "utf8",
      env: {
        ...process.env,
        NEXT_PUBLIC_MEDIA_BASE_URL: "",
        ...environment
      }
    }
  )

  assert.equal(result.status, 0, result.stderr)
  return JSON.parse(result.stdout) as {
    images?: {
      unoptimized?: boolean
      remotePatterns?: Array<{
        protocol: string
        hostname: string
        port: string
        pathname: string
        search: string
      }>
    }
  }
}

test("media URL resolver falls back locally and normalizes a public OSS base URL", () => {
  assert.equal(
    resolveMediaUrl("/media/posters/gh010146.jpg", ""),
    "/media/posters/gh010146.jpg"
  )
  assert.equal(
    resolveMediaUrl(
      "/media/videos/gh010146.mp4",
      " https://mengding-assets.oss-cn-chengdu.aliyuncs.com/ "
    ),
    "https://mengding-assets.oss-cn-chengdu.aliyuncs.com/media/videos/gh010146.mp4"
  )
})

test("media URL resolver rejects unsafe OSS base URLs and non-media paths", () => {
  assert.throws(
    () => resolveMediaUrl("/media/photos/tea-garden-overlook.jpg", "http://assets.example.com"),
    /HTTPS/i
  )
  assert.throws(
    () => resolveMediaUrl("/other/asset.jpg", "https://assets.example.com"),
    /must start with \/media\//i
  )
})

test("Next images are served directly and the OSS host is scoped at build time", () => {
  const localConfig = loadNextConfig()
  assert.equal(localConfig.images?.unoptimized, true)
  assert.deepEqual(localConfig.images?.remotePatterns, [])

  const ossConfig = loadNextConfig({
    NEXT_PUBLIC_MEDIA_BASE_URL: "https://mengding-assets.oss-cn-chengdu.aliyuncs.com/archive/"
  })
  assert.deepEqual(ossConfig.images?.remotePatterns, [
    {
      protocol: "https",
      hostname: "mengding-assets.oss-cn-chengdu.aliyuncs.com",
      port: "",
      pathname: "/archive/media/**",
      search: ""
    }
  ])
})

test("static archive images use the shared media URL resolver", () => {
  for (const sourcePath of [
    "app/engage/page.tsx",
    "components/tea-profile.tsx",
    "components/tea-quiz.tsx"
  ]) {
    const source = readFileSync(resolve(projectDirectory, sourcePath), "utf8")
    assert.match(source, /resolveMediaUrl/)
    assert.doesNotMatch(source, /src\s*=\s*["']\/media\//)
  }
})
