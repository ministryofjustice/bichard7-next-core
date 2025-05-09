import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import { Result } from "@moj-bichard7/core/types/AnnotatedHearingOutcome"
import Phase from "@moj-bichard7/core/types/Phase"
import { Card } from "components/Card"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldRow from "components/ExceptionFieldRow"
import { useCourtCase } from "context/CourtCaseContext"
import { findExceptions } from "types/ErrorMessages"
import { ResolutionStatus } from "types/ResolutionStatus"
import { Exception } from "types/exceptions"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import {
  capitaliseExpression,
  formatDuration,
  getNumberOfHours,
  getUrgentYesOrNo,
  getYesOrNo
} from "utils/valueTransformers"
import { NextHearingDateField } from "../../EditableFields/NextHearingDateField"
import { NextHearingLocationField } from "../../EditableFields/NextHearingLocationField"
import { InfoRow } from "../../InfoRow"
import { StyledInfoRow } from "./HearingResult.styles"
import ResultQualifier from "./ResultQualifier"

interface HearingResultProps {
  result: Result
  exceptions: Exception[]
  resultIndex: number
  selectedOffenceSequenceNumber: number
  errorStatus?: ResolutionStatus | null
  isContentVisible: boolean
  onToggleContent: () => void
}

export const HearingResult = ({
  result,
  errorStatus,
  exceptions,
  resultIndex,
  selectedOffenceSequenceNumber,
  isContentVisible,
  onToggleContent
}: HearingResultProps) => {
  const { courtCase } = useCourtCase()
  const cjsErrorMessage = findExceptions(courtCase, exceptions, ExceptionCode.HO100307)

  const offenceIndex = selectedOffenceSequenceNumber - 1

  const isCaseEditable =
    courtCase.canUserEditExceptions && courtCase.phase === Phase.HEARING_OUTCOME && errorStatus === "Unresolved"
  const text = result.ResultVariableText
  const formattedResult = text?.replace(/([^\d])\.([^\d\n])/g, "$1.\n\n$2")

  return (
    <Card
      heading={"Hearing result"}
      isContentVisible={isContentVisible}
      contentInstanceKey={`hearing-result-${resultIndex + 1}`}
      toggleContentVisibility={() => onToggleContent()}
    >
      {cjsErrorMessage ? (
        <ExceptionFieldRow badgeText={ExceptionBadgeType.SystemError} value={result.CJSresultCode} label={"CJS Code"}>
          <ErrorPromptMessage message={cjsErrorMessage} />
        </ExceptionFieldRow>
      ) : (
        <InfoRow label="CJS Code" value={result.CJSresultCode} />
      )}
      <InfoRow label="PNC disposal type" value={result.PNCDisposalType} />
      <InfoRow
        label="Result hearing type"
        value={result.ResultHearingType && capitaliseExpression(result.ResultHearingType)}
      />
      <ResultQualifier result={result} />
      <InfoRow
        label="Result hearing date"
        value={result.ResultHearingDate && formatDisplayedDate(result.ResultHearingDate)}
      />
      <StyledInfoRow label="Hearing result description" value={formattedResult} className={`result-text`} />
      <InfoRow label="Type of trial" value={result.ModeOfTrialReason} />
      <InfoRow label="Type of result" value={result.ResultClass} />
      <ConditionalRender isRendered={typeof result.Duration !== "undefined" && result.Duration?.length > 0}>
        <InfoRow
          label="Duration"
          value={
            <>
              {result.Duration?.map((duration) => (
                <div key={`duration-${duration.DurationLength}-${duration.DurationUnit}`}>
                  {formatDuration(duration.DurationLength, duration.DurationUnit)}
                </div>
              ))}
            </>
          }
        />
      </ConditionalRender>
      <NextHearingLocationField
        result={result}
        exceptions={exceptions}
        offenceIndex={offenceIndex}
        resultIndex={resultIndex}
        isCaseEditable={isCaseEditable}
      />
      <NextHearingDateField
        result={result}
        exceptions={exceptions}
        offenceIndex={offenceIndex}
        resultIndex={resultIndex}
        isCaseEditable={isCaseEditable}
      />
      <InfoRow label="PNC adjudication exists" value={getYesOrNo(result.PNCAdjudicationExists)} />
      <ConditionalRender isRendered={typeof result.Urgent !== "undefined"}>
        <InfoRow label="Urgent" value={getUrgentYesOrNo(result.Urgent?.urgent)} />
        <InfoRow label="Urgency" value={getNumberOfHours(result.Urgent?.urgency)} />
      </ConditionalRender>
    </Card>
  )
}
