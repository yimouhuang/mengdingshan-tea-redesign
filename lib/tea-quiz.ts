export type TeaQuizExternalSource = {
  type: "external"
  titleZh: string
  publisherZh: string
  url: string
  checkedAt: "2026-07-15"
}

export type TeaQuizArchiveSource = {
  type: "archive"
  mediaSlug: string
  titleZh: string
  titleEn: string
}

export type TeaQuizSource = TeaQuizExternalSource | TeaQuizArchiveSource

export type TeaQuizOption = {
  zh: string
  en: string
}

export type TeaQuizOptions = readonly [TeaQuizOption, TeaQuizOption, TeaQuizOption, TeaQuizOption]

export type TeaQuizQuestion = {
  id: string
  promptZh: string
  promptEn: string
  options: TeaQuizOptions
  correctIndex: 0 | 1 | 2 | 3
  explanationZh: string
  explanationEn: string
  source: TeaQuizSource
  mediaSlug: string
}

const mengdingCraftSource: TeaQuizExternalSource = {
  type: "external",
  titleZh: "绿茶制作技艺（蒙山茶传统制作技艺）",
  publisherZh: "中国非物质文化遗产网",
  url: "https://www.ihchina.cn/project_details/23781.html",
  checkedAt: "2026-07-15"
}

const regulationSource: TeaQuizExternalSource = {
  type: "external",
  titleZh: "雅安市蒙顶山茶文化保护条例相关说明",
  publisherZh: "雅安市人大常委会",
  url: "https://www.yasrdw.gov.cn/html/2025/yardw_15_1216/25427.html",
  checkedAt: "2026-07-15"
}

const yaanGovernmentSource: TeaQuizExternalSource = {
  type: "external",
  titleZh: "四川名山蒙顶山茶文化系统",
  publisherZh: "雅安市人民政府",
  url: "https://www.yaan.gov.cn/zhangzhe/show/40750101-a7f1-4962-9c24-b81acde6f9a2.html",
  checkedAt: "2026-07-15"
}

const agriculturalHeritageSource: TeaQuizExternalSource = {
  type: "external",
  titleZh: "四川名山蒙顶山茶文化系统",
  publisherZh: "全国农业展览馆（中国农业博物馆）",
  url: "https://jgs.agri.gov.cn/detail/zh/16405.html",
  checkedAt: "2026-07-15"
}

const unescoSource: TeaQuizExternalSource = {
  type: "external",
  titleZh: "中国传统制茶技艺及其相关习俗",
  publisherZh: "联合国教科文组织",
  url: "https://ich.unesco.org/en/RL/traditional-tea-processing-techniques-and-associated-social-practices-in-china-01884",
  checkedAt: "2026-07-15"
}

const yaanUnescoInscriptionSource: TeaQuizExternalSource = {
  type: "external",
  titleZh: "“中国传统制茶技艺及其相关习俗”申遗成功，雅安蒙山茶传统制作技艺关联的官方文章",
  publisherZh: "雅安市人民政府",
  url: "https://www.yaan.gov.cn/mob/article.html?id=84b02cd8-5706-41f6-a776-6907eadfb2c7",
  checkedAt: "2026-07-15"
}

export const teaQuizSources = [
  mengdingCraftSource,
  regulationSource,
  yaanGovernmentSource,
  agriculturalHeritageSource,
  unescoSource,
  yaanUnescoInscriptionSource
] as const satisfies readonly TeaQuizExternalSource[]

const archiveNewTeaShootsSource: TeaQuizArchiveSource = {
  type: "archive",
  mediaSlug: "new-tea-shoots",
  titleZh: "茶芽初展",
  titleEn: "New Tea Shoots"
}

const archiveSortingFreshLeavesSource: TeaQuizArchiveSource = {
  type: "archive",
  mediaSlug: "sorting-fresh-leaves",
  titleZh: "鲜叶分拣",
  titleEn: "Sorting Fresh Leaves"
}

const archiveTeaAncestorReliefSource: TeaQuizArchiveSource = {
  type: "archive",
  mediaSlug: "tea-ancestor-relief",
  titleZh: "茶祖浮雕",
  titleEn: "Tea Ancestor Relief"
}

export const teaQuizQuestions: readonly TeaQuizQuestion[] = [
  {
    id: "national-ich-year",
    promptZh: "蒙山茶传统制作技艺列入国家级非物质文化遗产代表性项目名录的年份是？",
    promptEn: "In which year was the traditional Mengshan tea-making craft included in the national representative ICH list?",
    options: [
      { zh: "2017 年", en: "2017" },
      { zh: "2021 年", en: "2021" },
      { zh: "2022 年", en: "2022" },
      { zh: "2025 年", en: "2025" }
    ],
    correctIndex: 1,
    explanationZh: "中国非物质文化遗产网将该项目列为第五批国家级非遗代表性项目，公布于 2021 年。",
    explanationEn: "The China ICH record identifies it as a fifth-batch national representative project announced in 2021.",
    source: mengdingCraftSource,
    mediaSlug: "new-tea-shoots"
  },
  {
    id: "declaration-region",
    promptZh: "该国家级非遗项目申报地区是？",
    promptEn: "Which place is named as the declaring region for this national ICH project?",
    options: [
      { zh: "四川雅安", en: "Ya'an, Sichuan" },
      { zh: "浙江杭州", en: "Hangzhou, Zhejiang" },
      { zh: "福建安溪", en: "Anxi, Fujian" },
      { zh: "云南普洱", en: "Pu'er, Yunnan" }
    ],
    correctIndex: 0,
    explanationZh: "项目页面标注的申报地区为四川省雅安市。",
    explanationEn: "The project page names Ya'an in Sichuan Province as the declaring region.",
    source: mengdingCraftSource,
    mediaSlug: "sorting-fresh-leaves"
  },
  {
    id: "representative-products",
    promptZh: "资料以哪一种茶为代表，并列出蒙顶石花等品类？",
    promptEn: "Which tea is presented as the representative, alongside varieties such as Mengding Shihua?",
    options: [
      { zh: "蒙顶甘露", en: "Mengding Ganlu" },
      { zh: "龙井", en: "Longjing" },
      { zh: "铁观音", en: "Tieguanyin" },
      { zh: "普洱熟茶", en: "Ripe Pu'er" }
    ],
    correctIndex: 0,
    explanationZh: "页面以蒙顶甘露为代表，并列有蒙顶石花、万春银叶、玉叶长春和蒙顶黄芽。",
    explanationEn: "The record centers Mengding Ganlu and also names Mengding Shihua, Wanchun Yinye, Yuye Changchun, and Mengding Huangya.",
    source: mengdingCraftSource,
    mediaSlug: "tea-ancestor-relief"
  },
  {
    id: "tea-by-leaf",
    promptZh: "“看茶制茶”强调的是什么？",
    promptEn: "What does the principle of adapting the making to the tea emphasize?",
    options: [
      { zh: "依据鲜叶状态调整制作", en: "Adjusting the craft to the fresh leaves" },
      { zh: "只按固定时钟操作", en: "Following one fixed clock" },
      { zh: "以包装颜色决定工序", en: "Choosing steps by package color" },
      { zh: "以产量决定手法", en: "Choosing methods by output" }
    ],
    correctIndex: 0,
    explanationZh: "资料将“看茶制茶”列为蒙山茶传统制作技艺的重要特点，指向对茶叶状态的判断与应对。",
    explanationEn: "The record names this as a key feature of the craft: judging the tea and responding to its condition.",
    source: mengdingCraftSource,
    mediaSlug: "new-tea-shoots"
  },
  {
    id: "fire-master",
    promptZh: "蒙山茶传统制作技艺特别提到哪一种配合？",
    promptEn: "Which collaboration is specifically noted in the traditional Mengshan tea-making craft?",
    options: [
      { zh: "手工制法与火丹师配合", en: "Handwork coordinated with a fire master" },
      { zh: "机器分装与直播配合", en: "Machine packing coordinated with livestreaming" },
      { zh: "无人机采摘与喷灌配合", en: "Drone picking coordinated with irrigation" },
      { zh: "竞赛评分与销售配合", en: "Competition scoring coordinated with sales" }
    ],
    correctIndex: 0,
    explanationZh: "页面强调手工制法，以及制茶者与火丹师之间的配合。",
    explanationEn: "The page emphasizes manual methods and coordination between the tea maker and the fire master.",
    source: mengdingCraftSource,
    mediaSlug: "sorting-fresh-leaves"
  },
  {
    id: "regulation-resources",
    promptZh: "下列哪一项属于保护条例列举的蒙顶山茶文化资源？",
    promptEn: "Which item is among the Mengding tea-culture resources listed by the protection regulation?",
    options: [
      { zh: "茶园、茶碑与茶马古道", en: "Tea gardens, tea steles, and tea-horse routes" },
      { zh: "邮轮码头与灯塔", en: "Cruise piers and lighthouses" },
      { zh: "冰川洞穴与珊瑚礁", en: "Glacier caves and coral reefs" },
      { zh: "赛马场与滑雪道", en: "Racecourses and ski runs" }
    ],
    correctIndex: 0,
    explanationZh: "条例说明列举茶园、茶碑、茶马古道、茶器具、茶谱茶礼及种植、采摘、制作技术等资源。",
    explanationEn: "The regulation material lists tea gardens, tea steles, tea-horse routes, utensils, tea texts and rites, and cultivation, picking, and making techniques.",
    source: regulationSource,
    mediaSlug: "tea-ancestor-relief"
  },
  {
    id: "regulation-effective-date",
    promptZh: "雅安市蒙顶山茶文化保护条例何时施行？",
    promptEn: "When did the Ya'an Mengding Mountain Tea Culture Protection Regulation take effect?",
    options: [
      { zh: "2025 年 3 月 1 日", en: "1 March 2025" },
      { zh: "2021 年 1 月 1 日", en: "1 January 2021" },
      { zh: "2022 年 11 月 29 日", en: "29 November 2022" },
      { zh: "2017 年 12 月 1 日", en: "1 December 2017" }
    ],
    correctIndex: 0,
    explanationZh: "雅安市政府资料说明，该条例于 2025 年 3 月 1 日施行。",
    explanationEn: "Ya'an government material states that the regulation took effect on 1 March 2025.",
    source: yaanGovernmentSource,
    mediaSlug: "sorting-fresh-leaves"
  },
  {
    id: "agricultural-heritage-year",
    promptZh: "四川名山蒙顶山茶文化系统何时入选中国重要农业文化遗产？",
    promptEn: "When was the Sichuan Mingshan Mengding Mountain Tea Culture System selected as an Important Agricultural Heritage System in China?",
    options: [
      { zh: "2017 年，第四批", en: "2017, fourth batch" },
      { zh: "2021 年，第五批", en: "2021, fifth batch" },
      { zh: "2022 年，首批", en: "2022, first batch" },
      { zh: "2025 年，第六批", en: "2025, sixth batch" }
    ],
    correctIndex: 0,
    explanationZh: "雅安市政府资料称，该系统于 2017 年入选第四批中国重要农业文化遗产。",
    explanationEn: "Ya'an government material states that the system entered the fourth batch of China Important Agricultural Heritage in 2017.",
    source: yaanGovernmentSource,
    mediaSlug: "new-tea-shoots"
  },
  {
    id: "agricultural-heritage-category",
    promptZh: "全国农业展览馆将该系统归入中国重要农业文化遗产的哪一类？",
    promptEn: "Which category does the National Agricultural Exhibition Center place this system in?",
    options: [
      { zh: "茶叶类", en: "Tea category" },
      { zh: "渔业类", en: "Fisheries category" },
      { zh: "畜牧业类", en: "Livestock category" },
      { zh: "果园类", en: "Orchard category" }
    ],
    correctIndex: 0,
    explanationZh: "全国农业展览馆（中国农业博物馆）页面将其列为茶叶类中国重要农业文化遗产。",
    explanationEn: "The National Agricultural Exhibition Center (China Agricultural Museum) lists it in the tea category of China Important Agricultural Heritage.",
    source: agriculturalHeritageSource,
    mediaSlug: "tea-ancestor-relief"
  },
  {
    id: "unesco-inscription-year",
    promptZh: "中国传统制茶技艺及其相关习俗列入联合国教科文组织名录的年份是？",
    promptEn: "In which year were China's traditional tea-processing techniques and associated social practices inscribed by UNESCO?",
    options: [
      { zh: "2022 年", en: "2022" },
      { zh: "2017 年", en: "2017" },
      { zh: "2021 年", en: "2021" },
      { zh: "2025 年", en: "2025" }
    ],
    correctIndex: 0,
    explanationZh: "联合国教科文组织名录页显示，该项目于 2022 年列入。",
    explanationEn: "UNESCO's list page records the inscription in 2022.",
    source: unescoSource,
    mediaSlug: "sorting-fresh-leaves"
  },
  {
    id: "unesco-practice-scope",
    promptZh: "联合国教科文组织资料中的传统制茶相关实践包含哪一组？",
    promptEn: "Which set of practices is included in UNESCO's description of traditional tea processing and related social practices?",
    options: [
      { zh: "茶园管理、采摘、手工加工、饮用与分享", en: "Tea-garden management, picking, hand processing, drinking, and sharing" },
      { zh: "开采、冶炼、铸造与航运", en: "Mining, smelting, casting, and shipping" },
      { zh: "编程、建模、渲染与发布", en: "Programming, modeling, rendering, and publishing" },
      { zh: "捕捞、冷藏、拍卖与出口", en: "Fishing, cold storage, auctioning, and export" }
    ],
    correctIndex: 0,
    explanationZh: "UNESCO 将茶园管理、采摘、手工加工，以及饮用和分享等环节纳入相关实践。",
    explanationEn: "UNESCO includes tea-garden management, picking, manual processing, and the practices of drinking and sharing tea.",
    source: unescoSource,
    mediaSlug: "new-tea-shoots"
  },
  {
    id: "unesco-six-tea-types",
    promptZh: "联合国教科文组织资料提到的六大茶类包括哪一组？",
    promptEn: "Which set matches the six tea categories named by UNESCO?",
    options: [
      { zh: "绿、黄、黑、白、乌龙、红", en: "Green, yellow, dark, white, oolong, and black" },
      { zh: "绿、紫、蓝、银、橙、金", en: "Green, purple, blue, silver, orange, and gold" },
      { zh: "春、夏、秋、冬、晨、暮", en: "Spring, summer, autumn, winter, dawn, and dusk" },
      { zh: "山、河、湖、海、林、田", en: "Mountains, rivers, lakes, seas, forests, and fields" }
    ],
    correctIndex: 0,
    explanationZh: "UNESCO 页面列出绿茶、黄茶、黑茶、白茶、乌龙茶和红茶六大类。",
    explanationEn: "UNESCO lists green, yellow, dark, white, oolong, and black tea among the six categories.",
    source: unescoSource,
    mediaSlug: "sorting-fresh-leaves"
  },
  {
    id: "observe-new-tea-shoots",
    promptZh: "只根据已核验影像条目《茶芽初展》，画面主要呈现的是？",
    promptEn: "Based only on the verified archive item 'New Tea Shoots,' what does the image primarily show?",
    options: [
      { zh: "初展的茶芽", en: "Newly unfurled tea shoots" },
      { zh: "工作台上的鲜叶", en: "Fresh leaves on a worktable" },
      { zh: "石壁上的浮雕", en: "A relief on a stone wall" },
      { zh: "林间的石阶", en: "Stone steps in the forest" }
    ],
    correctIndex: 0,
    explanationZh: "该题只读取档案条目的标题和说明：画面呈现的是初展的茶芽，不对地点或年代作推断。",
    explanationEn: "This answer uses only the item's title and description: the image shows newly unfurled tea shoots and makes no claim about place or date.",
    source: archiveNewTeaShootsSource,
    mediaSlug: "new-tea-shoots"
  },
  {
    id: "observe-sorting-fresh-leaves",
    promptZh: "只根据已核验影像条目《鲜叶分拣》，鲜叶在哪里被分拣？",
    promptEn: "Based only on the verified archive item 'Sorting Fresh Leaves,' where are the leaves sorted?",
    options: [
      { zh: "工作台上", en: "On a worktable" },
      { zh: "山顶石阶上", en: "On mountain steps" },
      { zh: "茶园水渠中", en: "In a tea-garden channel" },
      { zh: "博物馆展柜内", en: "Inside a museum case" }
    ],
    correctIndex: 0,
    explanationZh: "条目说明写明鲜叶在工作台上被分拣；题目不延伸到拍摄地点或时间。",
    explanationEn: "The item's description says fresh leaves are sorted on a worktable; the question does not infer a filming location or time.",
    source: archiveSortingFreshLeavesSource,
    mediaSlug: "sorting-fresh-leaves"
  },
  {
    id: "observe-tea-ancestor-relief",
    promptZh: "只根据已核验影像条目《茶祖浮雕》，镜头聚焦的是什么？",
    promptEn: "Based only on the verified archive item 'Tea Ancestor Relief,' what does the view focus on?",
    options: [
      { zh: "以茶祖为主题的浮雕细节", en: "Relief details centered on the tea ancestor" },
      { zh: "七株茶树的树龄", en: "The age of seven tea trees" },
      { zh: "最早人工植茶的遗址", en: "A site of the earliest planted tea" },
      { zh: "茶叶产量的统计数据", en: "Production statistics for tea leaves" }
    ],
    correctIndex: 0,
    explanationZh: "条目说明仅写镜头聚焦以茶祖为主题的浮雕细节；本题不引申树木、起源或产量说法。",
    explanationEn: "The item description only identifies relief details centered on the tea ancestor; it does not extend to claims about trees, origins, or production.",
    source: archiveTeaAncestorReliefSource,
    mediaSlug: "tea-ancestor-relief"
  }
]

export function createQuizSession(random: () => number = Math.random): TeaQuizQuestion[] {
  const shuffled = [...teaQuizQuestions]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const value = Math.min(Math.max(random(), 0), 0.9999999999999999)
    const swapIndex = Math.floor(value * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[swapIndex]!
    shuffled[swapIndex] = current!
  }

  return shuffled.slice(0, 10)
}
