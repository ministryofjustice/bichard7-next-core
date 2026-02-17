import type {
  CaseForWarrantsReportDto,
  CaseRowForWarrantsReport
} from "@moj-bichard7/common/types/reports/WarrantsReport"

import { caseToWarrantsReportDto } from "../../../dto/reports/caseToWarrantsReportDto"

export const processCases = (rows: CaseRowForWarrantsReport[]): CaseForWarrantsReportDto[] => {
  return rows.map(caseToWarrantsReportDto)
}
