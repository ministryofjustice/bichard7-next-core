import courtTypes from "@moj-bichard7-developers/bichard7-next-data/dist/data/court-type.json"
import { Hearing } from "@moj-bichard7/common/types/AnnotatedHearingOutcome"
import { Card } from "components/Card"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { InfoRow } from "./InfoRow"

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
    <Card heading={"Hearing details"}>
      <InfoRow label="Court location" value={hearing.CourtHearingLocation.OrganisationUnitCode} />
      <InfoRow label="Date of hearing" value={formatDisplayedDate(hearing.DateOfHearing)} />
      <InfoRow label="Time of hearing" value={hearing.TimeOfHearing} />
      <InfoRow label="Defendant present" value={hearing.DefendantPresentAtHearing} />
      <InfoRow label="Source reference document name" value={hearing.SourceReference.DocumentName} />
      <InfoRow label="Source reference identification" value={hearing.SourceReference.UniqueID} />
      <InfoRow label="Source reference document type" value={hearing.SourceReference.DocumentType} />
      <InfoRow label="Court type" value={getCourtType(hearing.CourtType)} />
      <InfoRow label="LJA code" value={hearing.CourtHouseCode.toString()} />
      <InfoRow label="Court name" value={hearing.CourtHouseName} />
      <InfoRow label="Hearing language" value={getLanguage(hearing.HearingLanguage)} />
      <InfoRow label="Documentation language" value={getLanguage(hearing.HearingDocumentationLanguage)} />
    </Card>
  )
}
