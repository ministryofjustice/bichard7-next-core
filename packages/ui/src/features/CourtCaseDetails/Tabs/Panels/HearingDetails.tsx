import { Hearing } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import { Table } from "govuk-react"
import courtTypes from "@moj-bichard7-developers/bichard7-next-data/dist/data/court-type.json"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { TableRow } from "./TableRow"

interface HearingDetailsProps {
  hearing: Hearing
}

export const HearingDetails = ({ hearing }: HearingDetailsProps) => {
  const getLanguage = (language: string) => {
    switch (language) {
      case "E":
        return `English (${language})`
      case "W":
        return `Welsh (${language})`
      case "D":
        return `Don't know (${language})`
      default:
        return language
    }
  }

  const getCourtType = (courtCode: string | null | undefined) => {
    let courtTypeWithDescription = courtCode
    courtTypes.forEach((type) => {
      if (type.cjsCode === courtCode) {
        courtTypeWithDescription = `${courtCode} (${type.description})`
      }
    })
    return courtTypeWithDescription
  }

  return (
    <Table>
      <TableRow label="Court location" value={hearing.CourtHearingLocation.OrganisationUnitCode} />
      <TableRow label="Date of hearing" value={formatDisplayedDate(hearing.DateOfHearing)} />
      <TableRow label="Time of hearing" value={hearing.TimeOfHearing} />
      <TableRow label="Defendant present" value={hearing.DefendantPresentAtHearing} />
      <TableRow label="Source reference document name" value={hearing.SourceReference.DocumentName} />
      <TableRow label="Source reference identification" value={hearing.SourceReference.UniqueID} />
      <TableRow label="Source reference document type" value={hearing.SourceReference.DocumentType} />
      <TableRow label="Court type" value={getCourtType(hearing.CourtType)} />
      <TableRow label="LJA code" value={hearing.CourtHouseCode.toString()} />
      <TableRow label="Court name" value={hearing.CourtHouseName} />
      <TableRow label="Hearing language" value={getLanguage(hearing.HearingLanguage)} />
      <TableRow label="Documentation language" value={getLanguage(hearing.HearingDocumentationLanguage)} />
    </Table>
  )
}
