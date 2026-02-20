import type { CaseForDomesticViolenceReportDto } from "@moj-bichard7/common/contracts/DomesticViolenceReport"

import type { CaseRowForDomesticViolenceReport } from "../../../../types/Reports"

import { caseToDomesticViolenceReportDto } from "../../../dto/caseToDomesticViolenceReportDto"

export const processCasesForDomesticViolenceReport = (
  cases: CaseRowForDomesticViolenceReport[]
): CaseForDomesticViolenceReportDto[] => {
  return cases.flatMap((caseRow) => [...caseToDomesticViolenceReportDto(caseRow)])
}
