import getOffenceCode from "@moj-bichard7/core/lib/offences/getOffenceCode"
import { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import WarningIcon from "components/WarningIcon"
import { useCourtCase } from "context/CourtCaseContext"
import Image from "next/image"
import { useRouter } from "next/router"
import { formatDisplayedDate } from "utils/date/formattedDate"
import getOffenceAlertsDetails from "utils/getOffenceAlertsDetails"
import { CHECKMARK_ICON_URL } from "utils/icons"
import { IconContainer } from "./OffencesListRow.styles"

interface OffencesListRowProps {
  offence: Offence
  offenceIndex: number
  onClick: (offence: Offence) => void
}

export const OffencesListRow = ({ offence, offenceIndex, onClick }: OffencesListRowProps) => {
  const { courtCase, amendments } = useCourtCase()
  const exceptions = courtCase.aho.Exceptions
  const router = useRouter()

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
    <tr className="govuk-table__row">
      <td className="govuk-table__cell">{courtCase.errorStatus !== "Resolved" && offenceAlertIcon}</td>
      <td className="govuk-table__cell">{offence.CourtOffenceSequenceNumber}</td>
      <td className="govuk-table__cell">{formatDisplayedDate(offence.ActualOffenceStartDate.StartDate).toString()}</td>
      <td className="govuk-table__cell">{getOffenceCode(offence) || ""}</td>
      <td className="govuk-table__cell">
        <a
          id={`offence-${offence.CourtOffenceSequenceNumber}`}
          className={`govuk-link`}
          href={router.basePath + router.asPath}
          onClick={(e) => {
            e.preventDefault()
            onClick(offence)
          }}
        >
          {offence.OffenceTitle ?? "Offence code not found"}
        </a>
      </td>
    </tr>
  )
}
