import { Result } from "@moj-bichard7-developers/bichard7-next-core/core/types/AnnotatedHearingOutcome"
import ExceptionCode from "@moj-bichard7-developers/bichard7-next-data/dist/types/ExceptionCode"
import Phase from "@moj-bichard7-developers/bichard7-next-core/core/types/Phase"
import ConditionalRender from "components/ConditionalRender"
import ErrorPromptMessage from "components/ErrorPromptMessage"
import ExceptionFieldTableRow from "components/ExceptionFieldTableRow"
import { useCourtCase } from "context/CourtCaseContext"
import { Heading, Table } from "govuk-react"
import { findExceptions } from "types/ErrorMessages"
import { ResolutionStatus } from "types/ResolutionStatus"
import { Exception } from "types/exceptions"
import { ExceptionBadgeType } from "utils/exceptions/exceptionBadgeType"
import { formatDisplayedDate } from "utils/date/formattedDate"
import {
  capitaliseExpression,
  formatDuration,
  getNumberOfHours,
  getUrgentYesOrNo,
  getYesOrNo
} from "utils/valueTransformers"
import { NextHearingDateField } from "../../EditableFields/NextHearingDateField"
import { NextHearingLocationField } from "../../EditableFields/NextHearingLocationField"
import { TableRow } from "../../TableRow"
import { StyledTableRow } from "./HearingResult.styles"

interface HearingResultProps {
  result: Result
  exceptions: Exception[]
  resultIndex: number
  selectedOffenceSequenceNumber: number
  errorStatus?: ResolutionStatus | null
}

export const HearingResult = ({
  result,
  errorStatus,
  exceptions,
  resultIndex,
  selectedOffenceSequenceNumber
}: HearingResultProps) => {
  const { courtCase } = useCourtCase()
  const cjsErrorMessage = findExceptions(courtCase, exceptions, ExceptionCode.HO100307)

  const offenceIndex = selectedOffenceSequenceNumber - 1

  const isCaseEditable =
    courtCase.canUserEditExceptions && courtCase.phase === Phase.HEARING_OUTCOME && errorStatus === "Unresolved"
  const text = result.ResultVariableText
  const formattedResult = text?.replace(/([^\d])\.([^\d\n])/g, "$1.\n\n$2")

  return (
    <>
      <Heading as="h4" size="MEDIUM">
        {"Hearing result"}
      </Heading>
      <Table>
        {cjsErrorMessage ? (
          <ExceptionFieldTableRow
            badgeText={ExceptionBadgeType.SystemError}
            value={result.CJSresultCode}
            label={"CJS Code"}
          >
            <ErrorPromptMessage message={cjsErrorMessage} />
          </ExceptionFieldTableRow>
        ) : (
          <TableRow label="CJS Code" value={result.CJSresultCode} />
        )}
        <TableRow
          label="Result hearing type"
          value={result.ResultHearingType && capitaliseExpression(result.ResultHearingType)}
        />
        <TableRow
          label="Result hearing date"
          value={result.ResultHearingDate && formatDisplayedDate(result.ResultHearingDate)}
        />
        <ConditionalRender isRendered={typeof result.Duration !== "undefined" && result.Duration?.length > 0}>
          <TableRow
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
        <TableRow label="Mode of trial reason" value={result.ModeOfTrialReason} />
        <StyledTableRow label="Hearing result text" value={formattedResult} className={`result-text`} />
        <TableRow label="PNC disposal type" value={result.PNCDisposalType} />
        <TableRow label="Result class" value={result.ResultClass} />
        <TableRow label="PNC adjudication exists" value={getYesOrNo(result.PNCAdjudicationExists)} />
        <ConditionalRender isRendered={typeof result.Urgent !== "undefined"}>
          <TableRow label="Urgent" value={getUrgentYesOrNo(result.Urgent?.urgent)} />
          <TableRow label="Urgency" value={getNumberOfHours(result.Urgent?.urgency)} />
        </ConditionalRender>
      </Table>
    </>
  )
}
