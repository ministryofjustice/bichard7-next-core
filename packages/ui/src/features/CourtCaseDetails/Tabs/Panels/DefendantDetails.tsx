import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { GenderCodes } from "@moj-bichard7-developers/bichard7-next-data/dist/types/GenderCode"
import { RemandStatuses } from "@moj-bichard7-developers/bichard7-next-data/dist/types/RemandStatusCode"
import { GenderCode, RemandStatusCode } from "@moj-bichard7-developers/bichard7-next-data/dist/types/types"
import { BadgeColours } from "components/Badge"
import { Card } from "components/Card"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldRow from "components/ExceptionFieldRow"
import { findExceptions } from "types/ErrorMessages"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import { capitalizeString } from "utils/valueTransformers"
import { useCourtCase } from "../../../../context/CourtCaseContext"
import { AddressCell } from "./AddressCell"
import { BailConditions } from "./BailConditions"
import { AsnField as AsnEditableField } from "./EditableFields/AsnField"
import { InfoRow } from "./InfoRow"

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
    <>
      <Card heading={"Defendant details"}>
        {asnSystemErrorExceptionPrompt ? (
          <ExceptionFieldRow
            badgeText={ExceptionBadgeType.SystemError}
            value={defendant.ArrestSummonsNumber}
            badgeColour={BadgeColours.Purple}
            label={"ASN"}
            displayError={!!asnSystemErrorExceptionPrompt}
          >
            <ErrorPromptMessage message={asnSystemErrorExceptionPrompt} />
          </ExceptionFieldRow>
        ) : (
          <AsnEditableField />
        )}
        <InfoRow label="PNC Check name" value={defendant.PNCCheckname} />
        <InfoRow label="Court PNCID" value={defendant.CourtPNCIdentifier} />
        <InfoRow label="Given name" value={defendant.DefendantDetail?.PersonName.GivenName?.join(", ")} />
        <InfoRow label="Family name" value={defendant.DefendantDetail?.PersonName.FamilyName} />
        <InfoRow label="Title" value={defendant.DefendantDetail?.PersonName.Title} />
        <InfoRow label="Date of birth" value={formatDisplayedDate(defendant.DefendantDetail?.BirthDate || "")} />
        <InfoRow
          label="Gender"
          value={`${defendant.DefendantDetail?.Gender} (${
            GenderCodes[defendant.DefendantDetail?.Gender as GenderCode]
          })`}
        />
        <InfoRow label="Address" value={<AddressCell address={defendant.Address} />} />
        <InfoRow label="PNC file name" value={defendant.DefendantDetail?.GeneratedPNCFilename} />
        <InfoRow
          label="Remand status"
          value={capitalizeString(RemandStatuses[defendant.RemandStatus as RemandStatusCode])}
        />
      </Card>

      <BailConditions
        bailConditions={defendant.BailConditions}
        bailReason={defendant.ReasonForBailConditions}
        offences={defendant.Offence}
      />
    </>
  )
}
