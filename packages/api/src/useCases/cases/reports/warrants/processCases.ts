import type { CaseForWarrantsReportDto } from "@moj-bichard7/common/types/reports/Warrants"

import type { CaseRowForWarrantsReport } from "../../../../types/reports/Warrants"

import { caseToWarrantsReportDto } from "../../../dto/reports/caseToWarrantsReportDto"

export const processCases = (rows: CaseRowForWarrantsReport[]): CaseForWarrantsReportDto[] => {
  return rows.map(caseToWarrantsReportDto)
}
