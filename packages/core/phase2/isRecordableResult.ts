import type { Result } from "../types/AnnotatedHearingOutcome"

const resultStopList = [
  1000, 1505, 1509, 1510, 1511, 1513, 1514, 2069, 2501, 2505, 2507, 2508, 2509, 2511, 2514, 3501, 3502, 3503, 3504,
  3508, 3509, 3510, 3512, 3514, 4049, 4505, 4507, 4509, 4510, 4532, 4534, 4544, 4584, 4585, 4586, 3118, 4592, 4593,
  4594, 4595, 4596, 4597
]

const isRecordableResult = (result: Result): boolean =>
  !!result.PNCDisposalType && !resultStopList.includes(result.PNCDisposalType)

export default isRecordableResult
