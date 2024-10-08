import { Offence } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import Badge, { BadgeColours } from "components/Badge"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { findExceptions } from "types/ErrorMessages"
import { DisplayFullUser } from "types/display/Users"
import { Exception } from "types/exceptions"
import getExceptionDefinition from "utils/getExceptionDefinition"
import findCandidates from "../../../../../../utils/offenceMatcher/findCandidates"
import { TableRow } from "../../TableRow"
import getOffenceMatchingException from "utils/offenceMatcher/getOffenceMatchingException"
import OffenceMatcher from "./OffenceMatcher"

const enabled = (user: DisplayFullUser) => {
  const enabledInProduction = true // change this if we need to disable in production for everyone
  const { exceptionsEnabled, offenceMatchingEnabled } = user.featureFlags
  const featureFlagsEnabled = exceptionsEnabled && offenceMatchingEnabled

  const isProduction = process.env.WORKSPACE === "production"
  if (!isProduction) {
    return featureFlagsEnabled
  }
  return enabledInProduction && featureFlagsEnabled
}

type Props = {
  offenceIndex: number
  offence: Offence
  isCaseUnresolved: boolean
  exceptions: Exception[]
  isCaseLockedToCurrentUser: boolean
}

export const OffenceMatching = ({
  offenceIndex,
  offence,
  isCaseUnresolved,
  exceptions,
  isCaseLockedToCurrentUser
}: Props) => {
  const { courtCase, savedAmendments } = useCourtCase()
  const currentUser = useCurrentUser()

  const offenceMatchingExceptions = [ExceptionCode.HO100310, ExceptionCode.HO100332]
  const noneOffenceMatchingExceptions = [
    ExceptionCode.HO100203,
    ExceptionCode.HO100228,
    ExceptionCode.HO100304,
    ExceptionCode.HO100311,
    ExceptionCode.HO100312,
    ExceptionCode.HO100320,
    ExceptionCode.HO100328,
    ExceptionCode.HO100333,
    ExceptionCode.HO100507
  ]

  const offenceMatchingException = isCaseUnresolved && getOffenceMatchingException(exceptions, offenceIndex)

  const findExceptionByOffenceNumber = courtCase.aho.Exceptions.filter((exception) =>
    exception.path.includes(offenceIndex)
  )
  const offenceMatchingExceptionMessage =
    findExceptions(
      courtCase,
      findExceptionByOffenceNumber.length > 0 ? findExceptionByOffenceNumber : courtCase.aho.Exceptions,
      ...noneOffenceMatchingExceptions
    ) || getExceptionDefinition(findExceptionByOffenceNumber[0]?.code)?.shortDescription

  const displayOffenceMatcher =
    enabled(currentUser) && exceptions.some((e) => offenceMatchingExceptions.includes(e.code))
  const userCanMatchOffence =
    courtCase.errorLockedByUsername === currentUser?.username && courtCase.errorStatus === "Unresolved"

  const updatedOffence = savedAmendments.offenceReasonSequence?.find((o) => o.offenceIndex === offenceIndex)

  return (
    <>
      {/* If we don't display the exception matcher,
      we should display the PNC sequence number input box below. */}
      <ConditionalRender isRendered={displayOffenceMatcher}>
        {offenceMatchingException && userCanMatchOffence ? (
          <ExceptionFieldTableRow
            label={"Matched PNC offence"}
            value={
              <OffenceMatcher
                offenceIndex={offenceIndex}
                candidates={findCandidates(courtCase, offenceIndex)}
                isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
              />
            }
          >
            <ErrorPromptMessage message={offenceMatchingExceptionMessage} />
          </ExceptionFieldTableRow>
        ) : (
          <TableRow
            label="Matched PNC offence"
            value={
              <>
                <div>{offence.CriminalProsecutionReference.OffenceReasonSequence}</div>
                <Badge
                  isRendered={true}
                  colour={BadgeColours.Purple}
                  label={!updatedOffence ? "UNMATCHED" : updatedOffence.value === 0 ? "ADDED IN COURT" : "MATCHED"}
                  className="moj-badge--large"
                />
              </>
            }
          />
        )}
      </ConditionalRender>

      {/* PNC sequence number */}
      <ConditionalRender isRendered={!displayOffenceMatcher}>
        {offenceMatchingException ? (
          <ExceptionFieldTableRow
            badgeText={offenceMatchingException.badge}
            label={"PNC sequence number"}
            message={offenceMatchingExceptionMessage}
          >
            {" "}
            <>
              {"Court Case Reference:"}
              <br />
              {courtCase.courtReference}
            </>
          </ExceptionFieldTableRow>
        ) : (
          <TableRow
            label="PNC sequence number"
            value={
              <>
                <div>{offence.CriminalProsecutionReference.OffenceReasonSequence}</div>
                <Badge isRendered={true} colour={BadgeColours.Purple} label="Matched" className="moj-badge--large" />
              </>
            }
          />
        )}
      </ConditionalRender>
    </>
  )
}
