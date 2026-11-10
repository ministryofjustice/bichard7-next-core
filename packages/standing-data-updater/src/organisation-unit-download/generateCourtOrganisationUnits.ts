import * as XLSX from "xlsx"
import type { OrganisationUnit } from "../types/OrganisationUnit"
import { isActiveOrganisationUnit } from "./isActiveOrganisationUnit"

export type OrganisationUnitData = {
  A: string
  B: string
  C: string
  D: string
  E: string
  F: string
  G: string
  H: string
  I: string
  J: string
}

const emptyRow = (row: OrganisationUnit | undefined): boolean => {
  return (
    row === undefined ||
    (row.topLevelCode === undefined &&
      row.bottomLevelCode === undefined &&
      row.secondLevelCode === undefined &&
      row.thirdLevelCode === undefined &&
      row.topLevelName === undefined &&
      row.bottomLevelName === undefined &&
      row.secondLevelName === undefined &&
      row.thirdLevelName === undefined)
  )
}

export const generateCourtOrganisationUnits = (fileContents: Buffer): OrganisationUnit[] => {
  const workbook = XLSX.read(fileContents)
  const worksheet = workbook.Sheets[workbook.SheetNames[1]]
  const jsonWorksheet: OrganisationUnitData[] = XLSX.utils.sheet_to_json(worksheet, {
    blankrows: false,
    header: "A"
  })
  jsonWorksheet.shift()

  return jsonWorksheet
    .map((record) => {
      if (isActiveOrganisationUnit(record.I, record.J)) {
        return {
          topLevelCode: String(record.A).trim(),
          secondLevelCode: String(record.B).trim(),
          thirdLevelCode: String(record.C).trim(),
          bottomLevelCode: String(record.D).trim(),
          topLevelName: record.E?.trim() ?? "",
          secondLevelName: record.F?.trim() ?? "",
          thirdLevelName: record.G?.trim() ?? "",
          bottomLevelName: record.H?.trim() ?? "",
          thirdLevelPsaCode: ""
        }
      }

      return undefined
    })
    .filter((record) => !emptyRow(record)) as OrganisationUnit[]
}
