import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/types/reports/DomesticViolence"

import type { CaseRowForDomesticViolenceReport } from "../../../../types/reports/DomesticViolence"

import { caseToDomesticViolenceReportDto } from "../../../dto/reports/caseToDomesticViolenceReportDto"

export const processCasesForDomesticViolenceReport = (
  cases: CaseRowForDomesticViolenceReport[]
): CaseForDomesticViolenceReportDto[] => {
  return cases.flatMap((caseRow) => [...caseToDomesticViolenceReportDto(caseRow)])
}
