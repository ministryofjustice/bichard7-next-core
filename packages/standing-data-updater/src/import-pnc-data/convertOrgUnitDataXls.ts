import * as XLSX from "xlsx"
import { forces } from "@moj-bichard7/standing-data"
import type { OrganisationUnit } from "../types/OrganisationUnit"

export type SheetData = {
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

const forceLookup = forces.reduce((acc: Record<string, string>, f) => {
  acc[f.code] = f.name
  return acc
}, {})

const emptyOrInvalidRow = (row: OrganisationUnit | undefined): boolean => {
  return row === undefined || row.thirdLevelName === undefined || row.thirdLevelName === ""
}

const convertOrgUnitDataXls = (fileContents: Buffer): OrganisationUnit[] => {
  const workbook = XLSX.read(fileContents)
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const jsonWorksheet: SheetData[] = XLSX.utils.sheet_to_json(worksheet, {
    blankrows: false,
    header: "A"
  })

  // Remove the first 4 header rows before map
  return jsonWorksheet
    .slice(4)
    .map((record) => {
      const thirdLevelCodeFromFile = record.A?.trim().substring(2, 4)
      const thirdLevelCode = thirdLevelCodeFromFile === "" ? "00" : thirdLevelCodeFromFile
      const secondLevelCode = record.A?.trim().substring(0, 2)

      return {
        topLevelName: "Police Service",
        secondLevelName: forceLookup[secondLevelCode] ?? "",
        thirdLevelName: record.C?.trim().replace(/\s+/g, " "),
        secondLevelCode,
        thirdLevelCode,
        topLevelCode: "",
        bottomLevelCode: "00",
        bottomLevelName: "",
        thirdLevelPsaCode: ""
      }
    })
    .filter((record) => !emptyOrInvalidRow(record)) as OrganisationUnit[]
}

export default convertOrgUnitDataXls
