import type { CommunitySentenceReportDto } from "@moj-bichard7/common/types/reports/CommunitySentence"

import type { CommunitySentenceRowReport } from "../../../../types/reports/CommunitySentence"

import { caseToCommunitySentenceDto } from "../../../dto/reports/caseToCommunitySentenceReportDto"

export const processCommunitySentenceReport = (row: CommunitySentenceRowReport[]): CommunitySentenceReportDto[] => {
  return row.flatMap((caseRow) => caseToCommunitySentenceDto(caseRow))
}
