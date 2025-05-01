import offenceCategory from "@moj-bichard7-developers/bichard7-next-data/dist/data/offence-category.json"
import yesNo from "@moj-bichard7-developers/bichard7-next-data/dist/data/yes-no.json"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import getOffenceCode from "@moj-bichard7/core/lib/offences/getOffenceCode"
import type { Offence } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldRow from "components/ExceptionFieldRow"
import { useCourtCase } from "context/CourtCaseContext"
import { useCurrentUser } from "context/CurrentUserContext"
import { useState } from "react"
import ErrorMessages from "types/ErrorMessages"
import { Exception } from "types/exceptions"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import { capitaliseExpression, getPleaStatus, getVerdict, getYesOrNo } from "utils/valueTransformers"
import { InfoRow } from "../../InfoRow"
import { HearingResult } from "./HearingResult"
import { OffenceMatching } from "./Matcher/OffenceMatching"
import { AccordionToggle, HeaderWrapper, OffenceDetailsContainer } from "./OffenceDetails.styles"
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

type VisibilityMap = {
  [key: number]: boolean
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
  const [offenceVisibility, setOffenceVisibility] = useState<VisibilityMap>(() => {
    const initialState: VisibilityMap = {}
    for (let i = 1; i <= offencesCount; i++) {
      initialState[i] = true
    }
    return initialState
  })

  const toggleContentVisibility = () => {
    setOffenceVisibility((prev) => ({
      ...prev,
      [selectedOffenceSequenceNumber]: !prev[selectedOffenceSequenceNumber]
    }))
  }

  const isContentVisible = offenceVisibility[selectedOffenceSequenceNumber]

  const accordion = isContentVisible
    ? { chevron: "govuk-accordion-nav__chevron--up", text: "Hide" }
    : { chevron: "govuk-accordion-nav__chevron--down", text: "Show" }

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

      <div className="govuk-summary-card offence-details">
        <HeaderWrapper className="govuk-summary-card__title-wrapper" onClick={toggleContentVisibility}>
          <h2
            className="govuk-summary-card__title offence-details__title"
            aria-live="polite"
            aria-label={`Offence ${selectedOffenceSequenceNumber} of ${offencesCount}`}
          >
            {`Offence ${selectedOffenceSequenceNumber} of ${offencesCount}`}
          </h2>
          <AccordionToggle>
            <span className={`govuk-accordion-nav__chevron ${accordion.chevron} chevron`}></span>
            <span>{accordion.text}</span>
          </AccordionToggle>
        </HeaderWrapper>
        {isContentVisible && (
          <div className="govuk-summary-card__content">
            <dl className="govuk-summary-list">
              {offenceCodeErrorPrompt ? (
                <ExceptionFieldRow
                  badgeText={ExceptionBadgeType.SystemError}
                  value={offenceCode}
                  label={"Offence code"}
                >
                  <ErrorPromptMessage message={offenceCodeErrorPrompt} />
                </ExceptionFieldRow>
              ) : (
                <InfoRow label="Offence code" value={offenceCode} />
              )}
              <InfoRow label="Offence title" value={offence.OffenceTitle} />
              <InfoRow label="Offence start date" value={<StartDate offence={offence} />} />
              <InfoRow label="Arrest date" value={offence.ArrestDate && formatDisplayedDate(offence.ArrestDate)} />
              <InfoRow label="Charge date" value={offence.ChargeDate && formatDisplayedDate(offence.ChargeDate)} />
              <InfoRow
                label="Conviction date"
                value={offence.ConvictionDate && formatDisplayedDate(offence.ConvictionDate)}
              />
              <InfoRow label="Offence description" value={offence.ActualOffenceWording} />
              <InfoRow label="Offence location" value={offence.LocationOfOffence} />
              <OffenceMatching
                offenceIndex={selectedOffenceSequenceNumber - 1}
                offence={offence}
                isCaseUnresolved={isCaseUnresolved}
                exceptions={exceptions}
                isCaseLockedToCurrentUser={isCaseLockedToCurrentUser}
              ></OffenceMatching>
              <InfoRow label="Court offence sequence number" value={offence.CourtOffenceSequenceNumber} />
              <ConditionalRender isRendered={offence.Result.length > 0 && offence.Result[0].PleaStatus !== undefined}>
                <InfoRow label="Plea" value={getPleaStatus(offence.Result[0].PleaStatus)} />
              </ConditionalRender>
              <ConditionalRender isRendered={offence.Result.length > 0 && offence.Result[0].Verdict !== undefined}>
                <InfoRow label="Verdict" value={getVerdict(offence.Result[0].Verdict)} />
              </ConditionalRender>
              <InfoRow label="Offence category" value={offenceCategoryWithDescription} />
              <InfoRow label="Recordable on PNC" value={getYesOrNo(offence.RecordableOnPNCindicator)} />
              <InfoRow label="Committed on bail" value={getCommittedOnBail(offence.CommittedOnBail)} />
              <InfoRow label="Notifiable to Home Office" value={getYesOrNo(offence.NotifiableToHOindicator)} />
              <InfoRow label="Home Office classification" value={offence.HomeOfficeClassification} />
            </dl>
          </div>
        )}
      </div>

      <div className="offence-results">
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
        <div className="govuk-summary-card qualifier-code">
          <HeaderWrapper className="govuk-summary-card__title-wrapper">
            <h2 className="govuk-summary-card__title">{"Qualifier"}</h2>
          </HeaderWrapper>
          <div className="govuk-summary-card__content">
            <dl className="govuk-summary-list">
              {qualifierErrorPrompt ? (
                <ExceptionFieldRow badgeText={ExceptionBadgeType.SystemError} value={qualifierCode} label={"Code"}>
                  <ErrorPromptMessage message={qualifierErrorPrompt} />
                </ExceptionFieldRow>
              ) : (
                <InfoRow label={"Code"} value={qualifierCode} />
              )}
            </dl>
          </div>
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
