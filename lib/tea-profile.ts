export type TeaProfileSlug =
  | "mengding-ganlu"
  | "mengding-huangya"
  | "mengding-shihua"
  | "wanchun-yinye"
  | "yuye-changchun"

export type TeaProfileSource = {
  publisherZh: string
  titleZh: string
  url: string
}

export type TeaProfileFact = {
  zh: string
  en: string
}

export type EditorialCulturalExperience = {
  kind: "editorial-cultural-experience"
  labelZh: "编辑文化体验"
  labelEn: "Editorial cultural experience"
  textZh: string
  textEn: string
  disclaimerZh: "这是一项编辑文化体验，不是人格测评、健康建议、品鉴结论或购买建议。"
  disclaimerEn: "This is an editorial cultural experience, not a personality assessment, health advice, tasting conclusion, or purchasing recommendation."
}

export type TeaProfile = {
  slug: TeaProfileSlug
  nameZh: string
  nameEn: string
  source: TeaProfileSource
  facts: readonly TeaProfileFact[]
  recommendation: EditorialCulturalExperience
}

export type TeaProfileWeights = Readonly<Partial<Record<TeaProfileSlug, number>>>

export type TeaProfileOption = {
  id: string
  zh: string
  en: string
  weights: TeaProfileWeights
}

export type TeaProfileOptions = readonly [
  TeaProfileOption,
  TeaProfileOption,
  TeaProfileOption,
  TeaProfileOption
]

export type TeaProfileQuestion = {
  id: string
  promptZh: string
  promptEn: string
  options: TeaProfileOptions
}

export type TeaProfileAnswer = {
  questionId: string
  optionId: string
}

export type TeaProfileResult = {
  primary: TeaProfile
  alternate: TeaProfile
  scores: Readonly<Record<TeaProfileSlug, number>>
  disclaimerZh: EditorialCulturalExperience["disclaimerZh"]
  disclaimerEn: EditorialCulturalExperience["disclaimerEn"]
}

const mengdingCraftSource: TeaProfileSource = {
  publisherZh: "中国非物质文化遗产网·中国非物质文化遗产数字博物馆",
  titleZh: "绿茶制作技艺（蒙山茶传统制作技艺）",
  url: "https://www.ihchina.cn/project_details/23781.html"
}

const sichuanTeaCraftSource: TeaProfileSource = {
  publisherZh: "中国非物质文化遗产网·中国非物质文化遗产数字博物馆",
  titleZh: "“中国传统制茶技艺及其相关习俗”四川篇",
  url: "https://www.ihchina.cn/project_details/28522.html"
}

const yaanTeaRouteSource: TeaProfileSource = {
  publisherZh: "雅安市人民政府",
  titleZh: "从蒙顶山到硗碛藏寨：茶马古道上的非遗美食寻味之旅",
  url: "https://www.yaan.gov.cn/xinwen/show/d86e76bf-0862-4966-986c-707010e2fe53.html"
}

const disclaimerZh = "这是一项编辑文化体验，不是人格测评、健康建议、品鉴结论或购买建议。" as const
const disclaimerEn = "This is an editorial cultural experience, not a personality assessment, health advice, tasting conclusion, or purchasing recommendation." as const

function editorialCulturalExperience(
  textZh: string,
  textEn: string
): EditorialCulturalExperience {
  return {
    kind: "editorial-cultural-experience",
    labelZh: "编辑文化体验",
    labelEn: "Editorial cultural experience",
    textZh,
    textEn,
    disclaimerZh,
    disclaimerEn
  }
}

export const teaProfiles: readonly TeaProfile[] = [
  {
    slug: "mengding-ganlu",
    nameZh: "蒙顶甘露",
    nameEn: "Mengding Ganlu",
    source: mengdingCraftSource,
    facts: [
      {
        zh: "外形曲卷披毫，嫩绿油润。",
        en: "Its appearance is curled and downy, tender green and lustrous."
      },
      {
        zh: "嫩香汤绿，爽口回甘。",
        en: "It is described as having a tender aroma and green liquor, refreshing with a returning sweetness."
      }
    ],
    recommendation: editorialCulturalExperience(
      "在这项编辑文化体验中，可把蒙顶甘露作为留意曲卷与嫩绿意象的一则文化线索。",
      "In this editorial cultural experience, Mengding Ganlu is a cultural cue for noticing curled forms and tender-green imagery."
    )
  },
  {
    slug: "mengding-huangya",
    nameZh: "蒙顶黄芽",
    nameEn: "Mengding Huangya",
    source: mengdingCraftSource,
    facts: [
      {
        zh: "芽壮齐整，色泽黄亮，油润有金毫。",
        en: "Its buds are stout and even, bright yellow and lustrous with golden down."
      },
      {
        zh: "甜香蜜韵。",
        en: "It is described as having a sweet aroma with a honey-like charm."
      }
    ],
    recommendation: editorialCulturalExperience(
      "在这项编辑文化体验中，可把蒙顶黄芽作为留意齐整芽形与黄亮色泽的一则文化线索。",
      "In this editorial cultural experience, Mengding Huangya is a cultural cue for noticing even buds and bright-yellow colour."
    )
  },
  {
    slug: "mengding-shihua",
    nameZh: "蒙顶石花",
    nameEn: "Mengding Shihua",
    source: mengdingCraftSource,
    facts: [
      {
        zh: "成茶扁直齐整，银峰挺锐。",
        en: "The finished tea is flat, straight and even, with poised silvery tips."
      },
      {
        zh: "甘鲜香纯。",
        en: "It is described as sweet-fresh with a pure aroma."
      }
    ],
    recommendation: editorialCulturalExperience(
      "在这项编辑文化体验中，可把蒙顶石花作为留意扁直线条与银峰意象的一则文化线索。",
      "In this editorial cultural experience, Mengding Shihua is a cultural cue for noticing flat, straight lines and silvery tips."
    )
  },
  {
    slug: "wanchun-yinye",
    nameZh: "万春银叶",
    nameEn: "Wanchun Yinye",
    source: yaanTeaRouteSource,
    facts: [
      {
        zh: "条索紧细，滋味鲜醇。",
        en: "Its leaves are described as tightly fine, with a fresh and mellow taste."
      }
    ],
    recommendation: editorialCulturalExperience(
      "在这项编辑文化体验中，可把万春银叶作为留意紧细条索的一则文化线索。",
      "In this editorial cultural experience, Wanchun Yinye is a cultural cue for noticing tightly fine leaf forms."
    )
  },
  {
    slug: "yuye-changchun",
    nameZh: "玉叶长春",
    nameEn: "Yuye Changchun",
    source: yaanTeaRouteSource,
    facts: [
      {
        zh: "色泽绿润，回味甘甜。",
        en: "It is described as green and lustrous, with a sweet returning finish."
      }
    ],
    recommendation: editorialCulturalExperience(
      "在这项编辑文化体验中，可把玉叶长春作为留意绿润色泽的一则文化线索。",
      "In this editorial cultural experience, Yuye Changchun is a cultural cue for noticing green, lustrous colour."
    )
  }
]

export const teaProfileSources = [
  mengdingCraftSource,
  sichuanTeaCraftSource,
  yaanTeaRouteSource
] as const

export const teaProfileQuestions: readonly TeaProfileQuestion[] = [
  {
    id: "travel-pace",
    promptZh: "在山间行程中，你更偏好的旅行节奏是？",
    promptEn: "Which travel pace do you prefer on a mountain route?",
    options: [
      {
        id: "unhurried-pauses",
        zh: "从容停留，留出观察的间隙",
        en: "Unhurried pauses for observation",
        weights: { "mengding-huangya": 3, "mengding-ganlu": 2, "yuye-changchun": 1 }
      },
      {
        id: "steady-walk",
        zh: "稳定步行，持续向前",
        en: "A steady walk onward",
        weights: { "mengding-ganlu": 3, "wanchun-yinye": 2, "mengding-shihua": 1 }
      },
      {
        id: "short-stops",
        zh: "以几个短停串联路线",
        en: "A route linked by short stops",
        weights: { "mengding-shihua": 3, "mengding-huangya": 1, "wanchun-yinye": 1 }
      },
      {
        id: "quiet-detour",
        zh: "留意安静的小路与转角",
        en: "Quiet detours and turns",
        weights: { "yuye-changchun": 3, "wanchun-yinye": 1, "mengding-ganlu": 1 }
      }
    ]
  },
  {
    id: "observation-style",
    promptZh: "面对一件手作或一处景观时，你常怎样观察？",
    promptEn: "How do you prefer to observe a craft or landscape?",
    options: [
      {
        id: "notice-fine-details",
        zh: "先留意细节、纹理与整齐感",
        en: "Notice fine details, texture, and order",
        weights: { "mengding-huangya": 3, "mengding-ganlu": 2, "mengding-shihua": 1 }
      },
      {
        id: "follow-lines",
        zh: "沿着线条和轮廓慢慢看",
        en: "Follow lines and contours slowly",
        weights: { "mengding-shihua": 3, "wanchun-yinye": 2, "mengding-ganlu": 1 }
      },
      {
        id: "notice-colour",
        zh: "先感受色泽与光线变化",
        en: "Notice colour and changing light first",
        weights: { "yuye-changchun": 3, "mengding-huangya": 1, "mengding-ganlu": 1 }
      },
      {
        id: "read-the-setting",
        zh: "从环境与整体氛围开始",
        en: "Begin with setting and overall atmosphere",
        weights: { "wanchun-yinye": 3, "yuye-changchun": 2, "mengding-shihua": 1 }
      }
    ]
  },
  {
    id: "social-style",
    promptZh: "旅行时，你更喜欢怎样与同伴相处？",
    promptEn: "What kind of company do you prefer while travelling?",
    options: [
      {
        id: "small-quiet-company",
        zh: "与少量同伴安静同行",
        en: "Small, quiet company",
        weights: { "mengding-huangya": 2, "mengding-ganlu": 1, "yuye-changchun": 1 }
      },
      {
        id: "shared-notes",
        zh: "边走边交换观察笔记",
        en: "Share observation notes as you go",
        weights: { "mengding-ganlu": 3, "mengding-shihua": 2, "wanchun-yinye": 1 }
      },
      {
        id: "independent-nearby",
        zh: "各自观察，再在近处会合",
        en: "Observe independently, then regroup nearby",
        weights: { "yuye-changchun": 3, "wanchun-yinye": 2, "mengding-huangya": 1 }
      },
      {
        id: "lively-conversation",
        zh: "在热络交谈中认识路线",
        en: "Discover the route through lively conversation",
        weights: { "wanchun-yinye": 3, "mengding-shihua": 1, "mengding-ganlu": 1 }
      }
    ]
  },
  {
    id: "route-preference",
    promptZh: "你更愿意把哪种路线作为一段文化行程的主线？",
    promptEn: "Which route do you prefer as the spine of a cultural journey?",
    options: [
      {
        id: "classic-landmarks",
        zh: "串联经典地标与代表性节点",
        en: "Link classic landmarks and key stops",
        weights: { "mengding-ganlu": 3, "mengding-huangya": 1, "mengding-shihua": 1 }
      },
      {
        id: "craft-workspaces",
        zh: "围绕手作空间与工序线索",
        en: "Follow craft spaces and process cues",
        weights: { "wanchun-yinye": 3, "mengding-shihua": 2, "mengding-huangya": 1 }
      },
      {
        id: "scenic-ridges",
        zh: "沿山脊、茶园与远望点展开",
        en: "Follow ridges, tea gardens, and overlooks",
        weights: { "yuye-changchun": 3, "mengding-ganlu": 2, "wanchun-yinye": 1 }
      },
      {
        id: "focused-exhibit",
        zh: "围绕一处展陈或器物深入停留",
        en: "Pause deeply with one display or object",
        weights: { "mengding-huangya": 3, "mengding-shihua": 1, "yuye-changchun": 1 }
      }
    ]
  },
  {
    id: "arrival-moment",
    promptZh: "你会把一天中的哪个到达时刻留给山间观察？",
    promptEn: "Which arrival moment do you prefer for a mountain pause?",
    options: [
      {
        id: "early-light",
        zh: "晨光初起时",
        en: "At early light",
        weights: { "mengding-huangya": 2, "mengding-ganlu": 2, "mengding-shihua": 1 }
      },
      {
        id: "midday-clarity",
        zh: "光线清晰的午间",
        en: "At clear midday",
        weights: { "mengding-shihua": 3, "wanchun-yinye": 2, "mengding-ganlu": 1 }
      },
      {
        id: "late-afternoon",
        zh: "午后光影变换时",
        en: "As afternoon light changes",
        weights: { "yuye-changchun": 3, "wanchun-yinye": 1, "mengding-huangya": 1 }
      },
      {
        id: "misty-morning",
        zh: "薄雾尚未散去的清晨",
        en: "On a misty morning",
        weights: { "mengding-ganlu": 3, "yuye-changchun": 2, "mengding-huangya": 1 }
      }
    ]
  },
  {
    id: "story-preference",
    promptZh: "哪类叙事线索最能吸引你继续走下去？",
    promptEn: "Which story cue would you prefer to follow?",
    options: [
      {
        id: "craft-and-gesture",
        zh: "手作的动作与细节",
        en: "Craft gestures and fine details",
        weights: { "mengding-huangya": 2, "mengding-shihua": 2, "mengding-ganlu": 1 }
      },
      {
        id: "place-and-history",
        zh: "碑刻与历史片段",
        en: "Inscriptions and historical fragments",
        weights: { "mengding-ganlu": 3, "wanchun-yinye": 2, "yuye-changchun": 1 }
      },
      {
        id: "natural-forms",
        zh: "山色、叶形与自然线条",
        en: "Mountain colour, leaf forms, and natural lines",
        weights: { "yuye-changchun": 3, "mengding-shihua": 1, "mengding-huangya": 1 }
      },
      {
        id: "workshop-rhythm",
        zh: "工坊中的节奏与协作",
        en: "Workshop rhythm and collaboration",
        weights: { "wanchun-yinye": 3, "mengding-ganlu": 1, "mengding-shihua": 1 }
      }
    ]
  },
  {
    id: "memory-style",
    promptZh: "一段行程结束后，你希望留下怎样的记忆？",
    promptEn: "What kind of memory do you prefer to carry from a journey?",
    options: [
      {
        id: "subtle-aftertaste",
        zh: "安静、细微、可以慢慢回想",
        en: "Subtle, quiet, and slowly recalled",
        weights: { "mengding-huangya": 3, "mengding-ganlu": 2, "yuye-changchun": 1 }
      },
      {
        id: "clear-image",
        zh: "轮廓清晰、便于复述的画面",
        en: "A clear image that is easy to retell",
        weights: { "mengding-shihua": 3, "wanchun-yinye": 2, "mengding-ganlu": 1 }
      },
      {
        id: "colour-impression",
        zh: "由色泽与光线留下的印象",
        en: "An impression made by colour and light",
        weights: { "yuye-changchun": 3, "mengding-huangya": 1, "mengding-shihua": 1 }
      },
      {
        id: "shared-route",
        zh: "与同伴共同走过的路线片段",
        en: "Route fragments shared with company",
        weights: { "wanchun-yinye": 3, "mengding-ganlu": 2, "yuye-changchun": 1 }
      }
    ]
  }
]

function createScores(): Record<TeaProfileSlug, number> {
  return {
    "mengding-ganlu": 0,
    "mengding-huangya": 0,
    "mengding-shihua": 0,
    "wanchun-yinye": 0,
    "yuye-changchun": 0
  }
}

export function resolveTeaProfile(
  answers: readonly TeaProfileAnswer[]
): TeaProfileResult | null {
  if (answers.length !== teaProfileQuestions.length) {
    return null
  }

  const selectedOptions: TeaProfileOption[] = []
  const answeredQuestionIds = new Set<string>()

  for (const answer of answers) {
    if (answeredQuestionIds.has(answer.questionId)) {
      return null
    }

    const question = teaProfileQuestions.find(
      (candidate) => candidate.id === answer.questionId
    )
    const option = question?.options.find(
      (candidate) => candidate.id === answer.optionId
    )

    if (!question || !option) {
      return null
    }

    answeredQuestionIds.add(question.id)
    selectedOptions.push(option)
  }

  if (answeredQuestionIds.size !== teaProfileQuestions.length) {
    return null
  }

  const scores = createScores()

  for (const option of selectedOptions) {
    for (const [slug, weight] of Object.entries(option.weights) as [
      TeaProfileSlug,
      number
    ][]) {
      scores[slug] += weight
    }
  }

  const rankedProfiles = teaProfiles
    .map((profile, sourceIndex) => ({ profile, sourceIndex }))
    .sort(
      (left, right) =>
        scores[right.profile.slug] - scores[left.profile.slug] ||
        left.sourceIndex - right.sourceIndex
    )

  return {
    primary: rankedProfiles[0]!.profile,
    alternate: rankedProfiles[1]!.profile,
    scores,
    disclaimerZh,
    disclaimerEn
  }
}
