import type { CaseForBailsReportDto } from "@moj-bichard7/common/contracts/BailsReport"

import type { CaseRowForBailsReport } from "../../../../types/Reports"

import { caseToBailsReportDto } from "../../../dto/caseToBailsReportDto"

export const processCasesForBailsReport = (cases: CaseRowForBailsReport[]): CaseForBailsReportDto[] => {
  return cases.flatMap((caseRow) => [...caseToBailsReportDto(caseRow)])
}
