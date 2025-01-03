import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import WarningIcon from "components/WarningIcon"
import { useCourtCase } from "context/CourtCaseContext"
import { Table } from "govuk-react"
import Image from "next/image"
import { formatDisplayedDate } from "utils/date/formattedDate"
import getOffenceAlertsDetails from "utils/getOffenceAlertsDetails"
import { CHECKMARK_ICON_URL } from "utils/icons"
import { IconContainer } from "./OffencesListRow.styles"
import getOffenceCode from "@moj-bichard7/core/lib/getOffenceCode"

interface OffencesListRowProps {
  offence: Offence
  offenceIndex: number
  onClick: (offence: Offence) => void
}

export const OffencesListRow = ({ offence, offenceIndex, onClick }: OffencesListRowProps) => {
  const { courtCase, amendments } = useCourtCase()
  const exceptions = courtCase.aho.Exceptions

  const offenceAlerts = getOffenceAlertsDetails(exceptions, amendments)

  const checkmarkIcon = (
    <IconContainer className={`icon checkmark-icon`} key={offence.CourtOffenceSequenceNumber}>
      <Image src={CHECKMARK_ICON_URL} width={30} height={30} alt="Checkmark icon" />
    </IconContainer>
  )
  const warningIcon = (
    <IconContainer className={`icon warning-icon`} key={offence.CourtOffenceSequenceNumber}>
      <WarningIcon />
    </IconContainer>
  )

  const offenceAlertIcon = offenceAlerts.map((offenceAlert) => {
    const isMatchingOffenceException = offenceAlert.offenceIndex === offenceIndex
    if (!isMatchingOffenceException) {
      return undefined
    }
    return offenceAlert.isResolved ? checkmarkIcon : warningIcon
  })

  return (
    <Table.Row>
      <Table.Cell>{courtCase.errorStatus !== "Resolved" && offenceAlertIcon}</Table.Cell>
      <Table.Cell>{offence.CourtOffenceSequenceNumber}</Table.Cell>
      <Table.Cell>{formatDisplayedDate(offence.ActualOffenceStartDate.StartDate).toString()}</Table.Cell>
      <Table.Cell>{getOffenceCode(offence) || ""}</Table.Cell>
      <Table.Cell>
        <a
          id={`offence-${offence.CourtOffenceSequenceNumber}`}
          className={`govuk-link`}
          href="/"
          onClick={(e) => {
            e.preventDefault()
            onClick(offence)
          }}
        >
          {offence.OffenceTitle ?? "Offence code not found"}
        </a>
      </Table.Cell>
    </Table.Row>
  )
}
