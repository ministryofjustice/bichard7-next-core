import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import getOffenceCode from "@moj-bichard7/core/lib/offences/getOffenceCode"
import type { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import ErrorMessages from "types/ErrorMessages"
import { Exception } from "types/exceptions"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import { capitaliseExpression, getPleaStatus, getVerdict, getYesOrNo } from "utils/valueTransformers"
import { TableRow } from "../../TableRow"
import { HearingResult } from "./HearingResult"
import { OffenceMatching } from "./Matcher/OffenceMatching"
import { OffenceDetailsContainer } from "./OffenceDetails.styles"
import { OffenceNavigation } from "./OffenceNavigation"
import { StartDate } from "./StartDate"

interface OffenceDetailsProps {
  offence: Offence
  offencesCount: number
  onBackToAllOffences: () => void
  onNextClick: () => void
  onPreviousClick: () => void
  selectedOffenceSequenceNumber: number
  exceptions: Exception[]
}

export const OffenceDetails = ({
  offence,
  offencesCount,
  onBackToAllOffences,
  onNextClick,
  onPreviousClick,
  selectedOffenceSequenceNumber,
  exceptions
}: OffenceDetailsProps) => {
  const { courtCase } = useCourtCase()
  const currentUser = useCurrentUser()

  const offenceCode = getOffenceCode(offence) || ""
  const qualifierCode =
    offence.CriminalProsecutionReference.OffenceReason?.__type === "NationalOffenceReason" &&
    offence.CriminalProsecutionReference.OffenceReason.OffenceCode.Qualifier

  const isCaseUnresolved = courtCase.errorStatus === "Unresolved"

  const isCaseLockedToCurrentUser = currentUser.username === courtCase.errorLockedByUsername

  const thisOffencePath = `AnnotatedHearingOutcome>HearingOutcome>Case>HearingDefendant>Offence>${
    selectedOffenceSequenceNumber - 1
  }`
  const thisResultPath = (resultIndex: number) => `${thisOffencePath}>Result>${resultIndex}`

  const unresolvedExceptionsOnThisOffence = !isCaseUnresolved
    ? []
    : exceptions.filter((exception) => exception.path.join(">").startsWith(thisOffencePath))

  const hasExceptionOnOffence = (exceptionCode: ExceptionCode) =>
    unresolvedExceptionsOnThisOffence.some((exception) => exception.code === exceptionCode)

  const offenceCodeErrorPrompt =
    (hasExceptionOnOffence("HO100251" as ExceptionCode) && ErrorMessages.HO100251ErrorPrompt) ||
    (hasExceptionOnOffence(ExceptionCode.HO100306) && ErrorMessages.HO100306ErrorPrompt)

  const qualifierErrorPrompt = hasExceptionOnOffence(ExceptionCode.HO100309) && ErrorMessages.QualifierCode

  let offenceCategoryWithDescription = offence.OffenceCategory
  offenceCategory.forEach((category) => {
    if (category.cjsCode === offence.OffenceCategory) {
      offenceCategoryWithDescription = `${offence.OffenceCategory} (${category.description.toLowerCase()})`
    }
  })

  const getCommittedOnBail = (bailCode: string) => {
    let committedOnBailWithDescription = bailCode
    yesNo.forEach((answer) => {
      if (answer.cjsCode === bailCode) {
        committedOnBailWithDescription = `${bailCode} (${capitaliseExpression(answer.description)})`
      }
    })
    return committedOnBailWithDescription
  }

  return (
    <OffenceDetailsContainer className={"offence-details"} aria-live="polite" aria-label="Offences tab active">
      <OffenceNavigation
        onBackToAllOffences={() => onBackToAllOffences()}
        selectedOffenceSequenceNumber={selectedOffenceSequenceNumber}
        onPreviousClick={() => onPreviousClick()}
        onNextClick={() => onNextClick()}
        offencesCount={offencesCount}
      />
      <h3
        className="govuk-heading-m"
        aria-live="polite"
        aria-label={`Offence ${selectedOffenceSequenceNumber} of ${offencesCount}`}
      >{`Offence ${selectedOffenceSequenceNumber} of ${offencesCount}`}</h3>
      <div className="offences-table">
        <table className="govuk-table">
          <tbody className="govuk-table__body">
            {offenceCodeErrorPrompt ? (
              <ExceptionFieldTableRow
                badgeText={ExceptionBadgeType.SystemError}
                value={offenceCode}
                label={"Offence code"}
              >
                <ErrorPromptMessage message={offenceCodeErrorPrompt} />
              </ExceptionFieldTableRow>
            ) : (
              <TableRow label="Offence code" value={offenceCode} />
            )}
            <TableRow label="Offence title" value={offence.OffenceTitle} />
            <TableRow label="Offence start date" value={<StartDate offence={offence} />} />
            <TableRow label="Arrest date" value={offence.ArrestDate && formatDisplayedDate(offence.ArrestDate)} />
            <TableRow label="Charge date" value={offence.ChargeDate && formatDisplayedDate(offence.ChargeDate)} />
            <TableRow
              label="Conviction date"
              value={offence.ConvictionDate && formatDisplayedDate(offence.ConvictionDate)}
            />
            <TableRow label="Offence description" value={offence.ActualOffenceWording} />
            <TableRow label="Offence location" value={offence.LocationOfOffence} />
            <OffenceMatching
              offenceIndex={selectedOffenceSequenceNumber - 1}
              offence={offence}
              isCaseUnresolved={isCaseUnresolved}
              exceptions={exceptions}
              isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
            ></OffenceMatching>
            <TableRow label="Court offence sequence number" value={offence.CourtOffenceSequenceNumber} />
            <ConditionalRender isRendered={offence.Result.length > 0 && offence.Result[0].PleaStatus !== undefined}>
              <TableRow label="Plea" value={getPleaStatus(offence.Result[0].PleaStatus)} />
            </ConditionalRender>
            <ConditionalRender isRendered={offence.Result.length > 0 && offence.Result[0].Verdict !== undefined}>
              <TableRow label="Verdict" value={getVerdict(offence.Result[0].Verdict)} />
            </ConditionalRender>
            <TableRow label="Offence category" value={offenceCategoryWithDescription} />
            <TableRow label="Recordable on PNC" value={getYesOrNo(offence.RecordableOnPNCindicator)} />
            <TableRow label="Committed on bail" value={getCommittedOnBail(offence.CommittedOnBail)} />
            <TableRow label="Notifiable to Home Office" value={getYesOrNo(offence.NotifiableToHOindicator)} />
            <TableRow label="Home Office classification" value={offence.HomeOfficeClassification} />
          </tbody>
        </table>
      </div>

      <div className="offence-results-table">
        {offence.Result.map((result, index) => {
          const resultKey = `hearing-result-${index + 1}`
          return (
            <div className={resultKey} key={resultKey}>
              <HearingResult
                result={result}
                exceptions={unresolvedExceptionsOnThisOffence.filter((resultException) =>
                  resultException.path.join(">").startsWith(thisResultPath(index))
                )}
                selectedOffenceSequenceNumber={selectedOffenceSequenceNumber}
                resultIndex={index}
                errorStatus={courtCase.errorStatus}
              />
            </div>
          )
        })}
      </div>
      {qualifierCode && (
        <div className="qualifier-code-table">
          <h4 className="govuk-heading-m">{"Qualifier"}</h4>
          <table className="govuk-table">
            <tbody className="govuk-table__body">
              {qualifierErrorPrompt ? (
                <ExceptionFieldTableRow badgeText={ExceptionBadgeType.SystemError} value={qualifierCode} label={"Code"}>
                  <ErrorPromptMessage message={qualifierErrorPrompt} />
                </ExceptionFieldTableRow>
              ) : (
                <TableRow label={"Code"} value={qualifierCode} />
              )}
            </tbody>
          </table>
        </div>
      )}
      <OffenceNavigation
        onBackToAllOffences={() => onBackToAllOffences()}
        selectedOffenceSequenceNumber={selectedOffenceSequenceNumber}
        onPreviousClick={() => onPreviousClick()}
        onNextClick={() => onNextClick()}
        offencesCount={offencesCount}
      />
    </OffenceDetailsContainer>
  )
}
