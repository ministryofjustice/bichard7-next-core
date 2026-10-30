const SUSPENDED_SENTENCE_ORDER_RESULTS = [
  { id: "1115", label: "Suspended sentence order - imprisonment" },
  { id: "1134", label: "Suspended sentence order - detention" },
  { id: "1508", label: "Suspended sentence order amended - imprisonment" },
  { id: "1507", label: "Suspended sentence of imprisonment implemented" }
]

const COMMUNITY_ORDER_RESULTS = [
  { id: "1030", label: "Community order varied" },
  { id: "1032", label: "Community order amended" },
  { id: "1116", label: "Community order" },
  { id: "4575", label: "Warrant for arrest for breach of community penalty with bail (dated)" },
  { id: "4576", label: "Warrant for arrest for community penalty breach without bail" },
  { id: "4577", label: "Warrant for arrest for community penalty breach with bail (undated)" }
]

export const TRPR0031_RESULTS = [...SUSPENDED_SENTENCE_ORDER_RESULTS, ...COMMUNITY_ORDER_RESULTS]

export const SUSPENDED_SENTENCE_ORDER_RESULT_CODES = SUSPENDED_SENTENCE_ORDER_RESULTS.map((r) => Number(r.id))
export const COMMUNITY_ORDER_RESULT_CODES = COMMUNITY_ORDER_RESULTS.map((r) => Number(r.id))
export const TRPR0031_RESULT_CODES = TRPR0031_RESULTS.map((r) => Number(r.id))
