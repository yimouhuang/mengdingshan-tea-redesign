import { resolveMediaUrl } from "./media-url"

export { resolveMediaUrl } from "./media-url"

export type MediaKind = "photo" | "video"

export type MediaAspect = "4:3" | "3:4" | "16:9"

export type MediaBase = {
  slug: string
  titleZh: string
  titleEn: string
  categoryZh: string
  categoryEn: string
  year: string
  locationZh: string
  locationEn: string
  poster: string
  descriptionZh: string
  descriptionEn: string
  signal: string
  tags: string[]
  archiveId: string
  assetCount?: number
  captureDate: string
  photographer: string
  rights: string
  featured: boolean
  homeOrder: number
  aspect: MediaAspect
}

export type PhotoMedia = MediaBase & {
  kind: "photo"
  video?: never
  duration?: never
}

export type VideoMedia = MediaBase & {
  kind: "video"
  video: string
  duration: string
}

export type TeaMedia = PhotoMedia | VideoMedia

export type ArchiveFilter = {
  kind?: MediaKind
  query?: string
  category?: string
  sort?: "latest" | "oldest" | "title"
}

export type MediaCategory = {
  value: string
  labelZh: string
  labelEn: string
  count: number
}

const archiveCollection = "影像馆采集 / Archive field collection"
const rightsUnderReview = "权利状态待核 / Rights status under review"
const dateNotSpecified = "日期未标注 / Date not specified"
const mengdingMountainZh = "蒙顶山"
const mengdingMountainEn = "Mengding Mountain"

const categories = {
  landmarks: { zh: "景区地标", en: "Mountain Landmarks" },
  gardens: { zh: "山水茶园", en: "Mountain & Tea Gardens" },
  teaWork: { zh: "茶事劳作", en: "Tea Work" },
  heritage: { zh: "茶文化遗存", en: "Tea Heritage" },
  mountainLife: { zh: "山间人文", en: "Mountain Life" }
} as const

const featuredHomeSlugs = [
  "mengding-mountain-gateway",
  "tea-garden-overlook",
  "picking-new-tea-shoots",
  "sorting-fresh-leaves",
  "tea-ancestor-relief"
] as const

const featuredHomeOrderBySlug = new Map<string, number>(
  featuredHomeSlugs.map((slug, index) => [slug, index + 1])
)

type ArchiveSeed = Pick<
  MediaBase,
  | "slug"
  | "titleZh"
  | "titleEn"
  | "categoryZh"
  | "categoryEn"
  | "descriptionZh"
  | "descriptionEn"
  | "tags"
  | "homeOrder"
  | "aspect"
>

type VideoSeed = ArchiveSeed & {
  assetId: string
  duration: string
}

type PhotoSeed = ArchiveSeed & {
  assetName: string
  archiveId: string
}

function createVideo(seed: VideoSeed): VideoMedia {
  const { assetId, duration, ...item } = seed

  return {
    ...item,
    kind: "video",
    year: dateNotSpecified,
    locationZh: mengdingMountainZh,
    locationEn: mengdingMountainEn,
    poster: resolveMediaUrl(`/media/posters/${assetId}.jpg`),
    video: resolveMediaUrl(`/media/videos/${assetId}.mp4`),
    signal: `${item.categoryZh} / ${item.categoryEn}`,
    archiveId: `MDS-VD-${assetId.toUpperCase()}`,
    duration,
    assetCount: 1,
    captureDate: dateNotSpecified,
    photographer: archiveCollection,
    rights: rightsUnderReview,
    featured: featuredHomeOrderBySlug.has(item.slug)
  }
}

function createPhoto(seed: PhotoSeed): PhotoMedia {
  const { assetName, ...item } = seed

  return {
    ...item,
    kind: "photo",
    year: dateNotSpecified,
    locationZh: mengdingMountainZh,
    locationEn: mengdingMountainEn,
    poster: resolveMediaUrl(`/media/photos/${assetName}`),
    signal: `${item.categoryZh} / ${item.categoryEn}`,
    assetCount: 1,
    captureDate: dateNotSpecified,
    photographer: archiveCollection,
    rights: rightsUnderReview,
    featured: featuredHomeOrderBySlug.has(item.slug)
  }
}

const seededMediaItems: TeaMedia[] = [
  createVideo({
    assetId: "gh010090",
    slug: "mengding-mountain-gateway",
    titleZh: "蒙顶山门",
    titleEn: "Mengding Mountain Gateway",
    categoryZh: categories.landmarks.zh,
    categoryEn: categories.landmarks.en,
    descriptionZh: "镜头记录蒙顶山入口处的山门与周边环境。",
    descriptionEn: "A brief view of the mountain gateway and its surroundings.",
    tags: ["山门", "Mountain gateway", "Video"],
    duration: "7.7s",
    homeOrder: 1,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010091",
    slug: "tea-ancestor-hometown-signposts",
    titleZh: "茶祖故里路标",
    titleEn: "Tea Ancestor Hometown Signposts",
    categoryZh: categories.landmarks.zh,
    categoryEn: categories.landmarks.en,
    descriptionZh: "镜头呈现指向茶祖故里的路标。",
    descriptionEn: "A view of signposts pointing toward the tea ancestor hometown.",
    tags: ["路标", "Signposts", "Video"],
    duration: "10.5s",
    homeOrder: 2,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010092",
    slug: "tea-summit-landmark",
    titleZh: "茶顶地标",
    titleEn: "Tea Summit Landmark",
    categoryZh: categories.landmarks.zh,
    categoryEn: categories.landmarks.en,
    descriptionZh: "镜头停留在茶顶地标及其所在空间。",
    descriptionEn: "The camera pauses on a tea summit landmark and its setting.",
    tags: ["地标", "Landmark", "Video"],
    duration: "9.1s",
    homeOrder: 3,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010093",
    slug: "national-tourist-attraction-marker",
    titleZh: "国家级旅游景区碑",
    titleEn: "National Tourist Attraction Marker",
    categoryZh: categories.landmarks.zh,
    categoryEn: categories.landmarks.en,
    descriptionZh: "镜头记录一方国家级旅游景区碑。",
    descriptionEn: "A short view of a marker for a national tourist attraction.",
    tags: ["景区碑", "Attraction marker", "Video"],
    duration: "9.3s",
    homeOrder: 4,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010096",
    slug: "waterfall-and-lily-pond",
    titleZh: "瀑布与睡莲",
    titleEn: "Waterfall and Lily Pond",
    categoryZh: categories.gardens.zh,
    categoryEn: categories.gardens.en,
    descriptionZh: "镜头记录瀑布水景与睡莲池的相邻画面。",
    descriptionEn: "A view of a waterfall water feature beside a lily pond.",
    tags: ["瀑布", "Lily pond", "Video"],
    duration: "7.3s",
    homeOrder: 5,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010103",
    slug: "valley-overlook",
    titleZh: "山谷远眺",
    titleEn: "Valley Overlook",
    categoryZh: categories.gardens.zh,
    categoryEn: categories.gardens.en,
    descriptionZh: "镜头从高处望向山谷中的层叠景色。",
    descriptionEn: "A distant view across the layered mountain valley.",
    tags: ["山谷", "Valley", "Video"],
    duration: "6.4s",
    homeOrder: 6,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010105",
    slug: "early-summer-tea-garden",
    titleZh: "初夏茶园",
    titleEn: "Early Summer Tea Garden",
    categoryZh: categories.gardens.zh,
    categoryEn: categories.gardens.en,
    descriptionZh: "镜头扫过初夏时节的茶园坡地。",
    descriptionEn: "The camera moves across a tea garden hillside in early summer.",
    tags: ["茶园", "Early summer", "Video"],
    duration: "5.4s",
    homeOrder: 7,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010110",
    slug: "ancient-tea-tree-of-mengding",
    titleZh: "蒙顶古茶树",
    titleEn: "Ancient Tea Tree of Mengding",
    categoryZh: categories.gardens.zh,
    categoryEn: categories.gardens.en,
    descriptionZh: "镜头近距离记录一株蒙顶古茶树的枝叶形态。",
    descriptionEn: "A close view of the branches and leaves of an ancient tea tree of Mengding.",
    tags: ["古茶树", "Tea tree", "Video"],
    duration: "5.0s",
    homeOrder: 8,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010116",
    slug: "tea-garden-in-mist",
    titleZh: "云岚茶园",
    titleEn: "Tea Garden in Mist",
    categoryZh: categories.gardens.zh,
    categoryEn: categories.gardens.en,
    descriptionZh: "薄雾中的茶园在镜头中渐次展开。",
    descriptionEn: "A tea garden emerges gradually through light mist.",
    tags: ["云岚", "Tea garden", "Video"],
    duration: "7.2s",
    homeOrder: 9,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010120",
    slug: "way-up-the-mountain",
    titleZh: "上山由此去",
    titleEn: "Way Up the Mountain",
    categoryZh: categories.landmarks.zh,
    categoryEn: categories.landmarks.en,
    descriptionZh: "镜头记录一处指向上山方向的提示。",
    descriptionEn: "A view of a sign indicating the way up the mountain.",
    tags: ["上山", "Wayfinding", "Video"],
    duration: "5.4s",
    homeOrder: 10,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010124",
    slug: "tea-ancestor-relief",
    titleZh: "茶祖浮雕",
    titleEn: "Tea Ancestor Relief",
    categoryZh: categories.heritage.zh,
    categoryEn: categories.heritage.en,
    descriptionZh: "镜头聚焦以茶祖为主题的浮雕细节。",
    descriptionEn: "A close view of relief details centered on the tea ancestor.",
    tags: ["浮雕", "Relief", "Video"],
    duration: "7.2s",
    homeOrder: 11,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010130",
    slug: "forest-inscription",
    titleZh: "山林题刻",
    titleEn: "Forest Inscription",
    categoryZh: categories.heritage.zh,
    categoryEn: categories.heritage.en,
    descriptionZh: "山林中的题刻在镜头中逐渐显现。",
    descriptionEn: "An inscription in the forest comes into view.",
    tags: ["题刻", "Inscription", "Video"],
    duration: "8.3s",
    homeOrder: 12,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010137",
    slug: "forest-stone-steps",
    titleZh: "林间石阶",
    titleEn: "Forest Stone Steps",
    categoryZh: categories.mountainLife.zh,
    categoryEn: categories.mountainLife.en,
    descriptionZh: "镜头沿着林间石阶向前延伸。",
    descriptionEn: "The view follows stone steps through the forest.",
    tags: ["石阶", "Forest path", "Video"],
    duration: "6.3s",
    homeOrder: 13,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010141",
    slug: "red-ribbons-of-wishes",
    titleZh: "祈愿红绸",
    titleEn: "Red Ribbons of Wishes",
    categoryZh: categories.mountainLife.zh,
    categoryEn: categories.mountainLife.en,
    descriptionZh: "山间悬挂的祈愿红绸随风轻动。",
    descriptionEn: "Red ribbons of wishes hang and move lightly in the mountain air.",
    tags: ["红绸", "Wishes", "Video"],
    duration: "5.2s",
    homeOrder: 14,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010146",
    slug: "red-gate-of-mengding",
    titleZh: "蒙顶红门",
    titleEn: "Red Gate of Mengding",
    categoryZh: categories.landmarks.zh,
    categoryEn: categories.landmarks.en,
    descriptionZh: "镜头记录蒙顶山中的一座红色门楼。",
    descriptionEn: "A view of a red gate structure on Mengding Mountain.",
    tags: ["红门", "Gate", "Video"],
    duration: "11.2s",
    homeOrder: 15,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010154",
    slug: "visitors-at-the-mountain-gate",
    titleZh: "山门来客",
    titleEn: "Visitors at the Mountain Gate",
    categoryZh: categories.mountainLife.zh,
    categoryEn: categories.mountainLife.en,
    descriptionZh: "镜头记录山门前来往的游客身影。",
    descriptionEn: "Visitors pass through the space before the mountain gate.",
    tags: ["来客", "Visitors", "Video"],
    duration: "62.9s",
    homeOrder: 16,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010173",
    slug: "dragon-carved-rock-wall",
    titleZh: "龙纹石壁",
    titleEn: "Dragon Carved Rock Wall",
    categoryZh: categories.heritage.zh,
    categoryEn: categories.heritage.en,
    descriptionZh: "镜头展示石壁上的龙纹雕刻。",
    descriptionEn: "A view of dragon carvings on a rock wall.",
    tags: ["龙纹", "Stone carving", "Video"],
    duration: "6.5s",
    homeOrder: 17,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010199",
    slug: "a-retreat-for-wellbeing",
    titleZh: "人间养生场",
    titleEn: "A Retreat for Wellbeing",
    categoryZh: categories.mountainLife.zh,
    categoryEn: categories.mountainLife.en,
    descriptionZh: "镜头记录题有“人间养生场”的景观文字。",
    descriptionEn: "A view of landscape text that reads “A Retreat for Wellbeing.”",
    tags: ["养生", "Wellbeing", "Video"],
    duration: "3.5s",
    homeOrder: 18,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010219",
    slug: "picking-new-tea-shoots",
    titleZh: "采一芽",
    titleEn: "Picking New Tea Shoots",
    categoryZh: categories.teaWork.zh,
    categoryEn: categories.teaWork.en,
    descriptionZh: "镜头记录采摘一芽茶叶的手部动作。",
    descriptionEn: "A close view of hands picking new tea shoots.",
    tags: ["采茶", "Tea picking", "Video"],
    duration: "9.7s",
    homeOrder: 19,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010230",
    slug: "new-tea-shoots",
    titleZh: "茶芽初展",
    titleEn: "New Tea Shoots",
    categoryZh: categories.teaWork.zh,
    categoryEn: categories.teaWork.en,
    descriptionZh: "镜头呈现初展的茶芽形态。",
    descriptionEn: "A close view of newly unfurled tea shoots.",
    tags: ["茶芽", "Tea shoots", "Video"],
    duration: "3.4s",
    homeOrder: 20,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010246",
    slug: "sorting-fresh-leaves",
    titleZh: "鲜叶分拣",
    titleEn: "Sorting Fresh Leaves",
    categoryZh: categories.teaWork.zh,
    categoryEn: categories.teaWork.en,
    descriptionZh: "镜头记录工作台上分拣鲜叶的过程。",
    descriptionEn: "Fresh leaves are sorted on a worktable.",
    tags: ["鲜叶", "Sorting", "Video"],
    duration: "16.5s",
    homeOrder: 21,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010258",
    slug: "fresh-leaves-in-hand",
    titleZh: "鲜叶在手",
    titleEn: "Fresh Leaves in Hand",
    categoryZh: categories.teaWork.zh,
    categoryEn: categories.teaWork.en,
    descriptionZh: "镜头聚焦手中捧起的鲜叶。",
    descriptionEn: "A close view of fresh leaves held in hand.",
    tags: ["鲜叶", "Hands", "Video"],
    duration: "5.4s",
    homeOrder: 22,
    aspect: "16:9"
  }),
  createVideo({
    assetId: "gh010263",
    slug: "finished-tea-examined",
    titleZh: "成茶观形",
    titleEn: "Finished Tea, Examined",
    categoryZh: categories.teaWork.zh,
    categoryEn: categories.teaWork.en,
    descriptionZh: "镜头记录对成茶外形的观察。",
    descriptionEn: "A close observation of the appearance of finished tea.",
    tags: ["成茶", "Tea examination", "Video"],
    duration: "5.7s",
    homeOrder: 23,
    aspect: "16:9"
  }),
  createPhoto({
    assetName: "ancient-archway-in-the-woods.jpg",
    archiveId: "MDS-PH-1F42C25E",
    slug: "ancient-archway-in-the-woods",
    titleZh: "林间古牌坊",
    titleEn: "Ancient Archway in the Woods",
    categoryZh: categories.heritage.zh,
    categoryEn: categories.heritage.en,
    descriptionZh: "静态影像记录林木之间的古牌坊。",
    descriptionEn: "A still image of an ancient archway among the trees.",
    tags: ["牌坊", "Archway", "Photo"],
    homeOrder: 24,
    aspect: "3:4"
  }),
  createPhoto({
    assetName: "tea-garden-overlook.jpg",
    archiveId: "MDS-PH-21D77D9C",
    slug: "tea-garden-overlook",
    titleZh: "茶园远眺",
    titleEn: "Tea Garden Overlook",
    categoryZh: categories.gardens.zh,
    categoryEn: categories.gardens.en,
    descriptionZh: "静态影像呈现茶园与山地环境的远景。",
    descriptionEn: "A still overlook of the tea garden and its mountain setting.",
    tags: ["茶园", "Overlook", "Photo"],
    homeOrder: 25,
    aspect: "4:3"
  }),
  createPhoto({
    assetName: "world-tea-culture-museum.jpg",
    archiveId: "MDS-PH-2795F4D9",
    slug: "world-tea-culture-museum",
    titleZh: "世界茶文化博物馆",
    titleEn: "World Tea Culture Museum",
    categoryZh: categories.heritage.zh,
    categoryEn: categories.heritage.en,
    descriptionZh: "静态影像记录世界茶文化博物馆的外观。",
    descriptionEn: "A still image of the World Tea Culture Museum exterior.",
    tags: ["博物馆", "Tea culture", "Photo"],
    homeOrder: 26,
    aspect: "3:4"
  }),
  createPhoto({
    assetName: "a-moment-at-the-tea-table.jpg",
    archiveId: "MDS-PH-2FDBFF1B",
    slug: "a-moment-at-the-tea-table",
    titleZh: "茶席一刻",
    titleEn: "A Moment at the Tea Table",
    categoryZh: categories.heritage.zh,
    categoryEn: categories.heritage.en,
    descriptionZh: "静态影像记录茶席上的器物与布置。",
    descriptionEn: "A still image of objects and arrangement on a tea table.",
    tags: ["茶席", "Tea table", "Photo"],
    homeOrder: 27,
    aspect: "3:4"
  }),
  createPhoto({
    assetName: "tea-garden-in-mist.jpg",
    archiveId: "MDS-PH-44F85692",
    slug: "tea-garden-in-mist-photo",
    titleZh: "云岚茶园",
    titleEn: "Tea Garden in Mist",
    categoryZh: categories.gardens.zh,
    categoryEn: categories.gardens.en,
    descriptionZh: "静态影像凝住云岚笼罩的茶园。",
    descriptionEn: "A still view of a tea garden held in mist.",
    tags: ["云岚", "Tea garden", "Photo"],
    homeOrder: 28,
    aspect: "4:3"
  }),
  createPhoto({
    assetName: "a-retreat-for-wellbeing.jpg",
    archiveId: "MDS-PH-E34E0FB6",
    slug: "a-retreat-for-wellbeing-photo",
    titleZh: "人间养生场",
    titleEn: "A Retreat for Wellbeing",
    categoryZh: categories.mountainLife.zh,
    categoryEn: categories.mountainLife.en,
    descriptionZh: "静态影像记录“人间养生场”景观文字所在的环境。",
    descriptionEn: "A still image of the setting around the “A Retreat for Wellbeing” landscape text.",
    tags: ["养生", "Landscape text", "Photo"],
    homeOrder: 29,
    aspect: "3:4"
  })
]

export const mediaItems: TeaMedia[] = seededMediaItems.map((item) => {
  const featuredOrder = featuredHomeOrderBySlug.get(item.slug)

  if (featuredOrder) {
    return { ...item, homeOrder: featuredOrder }
  }

  const nonFeaturedRank = seededMediaItems
    .filter((candidate) => !featuredHomeOrderBySlug.has(candidate.slug))
    .findIndex((candidate) => candidate.slug === item.slug)

  return { ...item, homeOrder: featuredHomeSlugs.length + nonFeaturedRank + 1 }
})

export function getMediaKindLabel(kind: MediaKind): string {
  return kind === "video" ? "视频 / Video" : "图片 / Photo"
}

function normalize(value: string): string {
  return value.trim().toLocaleLowerCase()
}

function chronologyValue(item: TeaMedia): number {
  const dateMatch = item.captureDate.match(/\d{4}(?:-\d{2})?(?:-\d{2})?/)?.[0]
  const source = dateMatch ?? item.year
  const timestamp = Date.parse(source.length === 4 ? `${source}-01-01` : source)

  return Number.isNaN(timestamp) ? 0 : timestamp
}

function compareByTitle(left: TeaMedia, right: TeaMedia): number {
  return (
    left.titleEn.localeCompare(right.titleEn, "en", { sensitivity: "base" }) ||
    left.titleZh.localeCompare(right.titleZh, "zh") ||
    left.slug.localeCompare(right.slug)
  )
}

export function getMediaItem(slug: string): TeaMedia | undefined {
  return mediaItems.find((item) => item.slug === slug)
}

export function getMediaCategories(items: readonly TeaMedia[]): MediaCategory[] {
  const categories = new Map<string, MediaCategory>()

  for (const item of items) {
    const current = categories.get(item.categoryEn)

    if (current) {
      current.count += 1
      continue
    }

    categories.set(item.categoryEn, {
      value: item.categoryEn,
      labelZh: item.categoryZh,
      labelEn: item.categoryEn,
      count: 1
    })
  }

  return [...categories.values()]
}

export function getRelatedMedia(slug: string, count = 4): TeaMedia[] {
  const current = getMediaItem(slug)
  const available = mediaItems.filter((item) => item.slug !== slug)

  if (!current) {
    return available.slice(0, Math.max(0, count))
  }

  const related = [
    ...available.filter((item) => item.categoryEn === current.categoryEn),
    ...available.filter(
      (item) => item.categoryEn !== current.categoryEn && item.kind === current.kind
    ),
    ...available.filter(
      (item) => item.categoryEn !== current.categoryEn && item.kind !== current.kind
    )
  ]

  return related.slice(0, Math.max(0, count))
}

export function filterMedia(
  items: readonly TeaMedia[],
  options: ArchiveFilter = {}
): TeaMedia[] {
  const query = options.query ? normalize(options.query) : ""
  const category = options.category ? normalize(options.category) : ""

  const filtered = items.filter((item) => {
    if (options.kind && item.kind !== options.kind) {
      return false
    }

    const searchable = normalize(
      [
        item.titleZh,
        item.titleEn,
        item.categoryZh,
        item.categoryEn,
        item.kind,
        ...item.tags
      ].join(" ")
    )
    const categories = normalize(`${item.categoryZh} ${item.categoryEn}`)

    return (!query || searchable.includes(query)) && (!category || categories.includes(category))
  })

  return filtered
    .map((item, index) => ({ item, index }))
    .sort((left, right) => {
      if (options.sort === "title") {
        return compareByTitle(left.item, right.item) || left.index - right.index
      }

      if (options.sort === "latest") {
        return (
          chronologyValue(right.item) - chronologyValue(left.item) ||
          left.item.homeOrder - right.item.homeOrder ||
          left.index - right.index
        )
      }

      if (options.sort === "oldest") {
        return (
          chronologyValue(left.item) - chronologyValue(right.item) ||
          left.item.homeOrder - right.item.homeOrder ||
          left.index - right.index
        )
      }

      return left.index - right.index
    })
    .map(({ item }) => item)
}

export function getFeaturedMedia(): TeaMedia[] {
  return mediaItems
    .filter((item) => featuredHomeOrderBySlug.has(item.slug))
    .sort((left, right) => left.homeOrder - right.homeOrder)
}

export function getMediaNeighbors(
  slug: string
): { previous: TeaMedia; next: TeaMedia } | undefined {
  const index = mediaItems.findIndex((item) => item.slug === slug)

  if (index === -1 || mediaItems.length === 0) {
    return undefined
  }

  return {
    previous: mediaItems[(index - 1 + mediaItems.length) % mediaItems.length],
    next: mediaItems[(index + 1) % mediaItems.length]
  }
}
