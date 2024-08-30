import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { BadgeColours } from "components/Badge"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { Table } from "govuk-react"
import { findExceptions } from "types/ErrorMessages"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import { capitalizeString } from "utils/valueTransformers"
import { useCourtCase } from "../../../../context/CourtCaseContext"
import { AddressCell } from "./AddressCell"
import { BailConditions } from "./BailConditions"
import { DefendantDetailTable } from "./DefendantDetails.styles"
import { AsnField as AsnEditableField } from "./EditableFields/AsnField"
import { TableRow } from "./TableRow"

export const DefendantDetails = () => {
  const { courtCase } = useCourtCase()
  const defendant = courtCase.aho.AnnotatedHearingOutcome.HearingOutcome.Case.HearingDefendant
  const asnSystemErrorExceptionPrompt = findExceptions(
    courtCase,
    courtCase.aho.Exceptions,
    ExceptionCode.HO200113,
    ExceptionCode.HO200114
  )

  return (
    <DefendantDetailTable className={`defendant-details-table`}>
      <Table>
        {asnSystemErrorExceptionPrompt ? (
          <ExceptionFieldTableRow
            badgeText={ExceptionBadgeType.SystemError}
            value={defendant.ArrestSummonsNumber}
            badgeColour={BadgeColours.Purple}
            label={"ASN"}
            displayError={!!asnSystemErrorExceptionPrompt}
          >
            <ErrorPromptMessage message={asnSystemErrorExceptionPrompt} />
          </ExceptionFieldTableRow>
        ) : (
          <AsnEditableField />
        )}

        <TableRow label="PNC Check name" value={defendant.PNCCheckname} />
        <TableRow label="Given name" value={defendant.DefendantDetail?.PersonName.GivenName?.join(", ")} />
        <TableRow label="Family name" value={defendant.DefendantDetail?.PersonName.FamilyName} />
        <TableRow label="Title" value={defendant.DefendantDetail?.PersonName.Title} />
        <TableRow label="Date of birth" value={formatDisplayedDate(defendant.DefendantDetail?.BirthDate || "")} />
        <TableRow
          label="Gender"
          value={`${defendant.DefendantDetail?.Gender} (${
            GenderCodes[defendant.DefendantDetail?.Gender as GenderCode]
          })`}
        />
        <TableRow label="Address" value={<AddressCell address={defendant.Address} />} />
        <TableRow label="PNC file name" value={defendant.DefendantDetail?.GeneratedPNCFilename} />
        <TableRow
          label="Remand status"
          value={capitalizeString(RemandStatuses[defendant.RemandStatus as RemandStatusCode])}
        />
      </Table>
      <BailConditions
        bailConditions={defendant.BailConditions}
        bailReason={defendant.ReasonForBailConditions}
        offences={defendant.Offence}
      />
    </DefendantDetailTable>
  )
}
