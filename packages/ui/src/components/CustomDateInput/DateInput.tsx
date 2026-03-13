import { FormGroup } from "components/FormGroup"
import { format } from "date-fns"
import type { Dispatch } from "react"
import type { SerializedDateRange } from "types/CaseListQueryParams"
import type { FilterAction } from "types/CourtCaseFilter"
import { mergeClassNames } from "../../helpers/mergeClassNames"
import { SmallButton } from "./DateInput.styles"

type DateType = "from" | "to" | "resolvedFrom" | "resolvedTo"
type ActionType = "dateFrom" | "dateTo" | "caseResolvedFrom" | "caseResolvedTo"

interface Props {
  dateType: DateType
  dispatch: Dispatch<FilterAction>
  value: string
  dateRange: SerializedDateRange | undefined
  showError?: boolean
  errorMessage?: string
  minValue?: Date
  maxValue?: Date
}

const dateActions = {
  from: "dateFrom",
  to: "dateTo",
  resolvedFrom: "caseResolvedFrom",
  resolvedTo: "caseResolvedTo"
}

const formatLabelText = (dateType: DateType): string => {
  if (dateType.toLowerCase().includes("from")) {
    return "Date from"
  }

  if (dateType.toLowerCase().includes("to")) {
    return "Date to"
  }

  return "Date"
}

const DateInput: React.FC<Props> = ({
  dateType,
  dispatch,
  value,
  dateRange,
  showError,
  errorMessage,
  minValue,
  maxValue
}: Props) => {
  const actionType = dateActions[dateType] as ActionType
  const renderSameDateButton = (dateType === "to" || dateType === "resolvedTo") && dateRange?.from
  const setSameDateValue = () => {
    if (dateRange?.from) {
      dispatch({ method: "add", type: actionType, value: dateRange.from })
    }
  }

  const SameDateButton = (
    <SmallButton
      style={{ marginLeft: "160px" }}
      type="button"
      className={`small-button--tag`}
      id={"apply-same-date-button"}
      onClick={setSameDateValue}
    >
      {"Same date"}
    </SmallButton>
  )

  return (
    <FormGroup showError={showError}>
      <label className="govuk-body" htmlFor={`date-${dateType}`}>
        {formatLabelText(dateType)}
        {renderSameDateButton && SameDateButton}
      </label>
      {showError ? (
        <p className="govuk-error-message">
          <span className="govuk-visually-hidden">{"Error:"}</span> {errorMessage}
        </p>
      ) : null}
      <input
        className={mergeClassNames("govuk-input", showError ? "govuk-input--error" : "")}
        type="date"
        id={`date-${dateType}`}
        name={dateType}
        value={value}
        onChange={(event) => {
          dispatch({ method: "add", type: actionType, value: event.target.value })
        }}
        min={minValue ? format(minValue, "yyyy-MM-dd") : undefined}
        max={maxValue ? format(maxValue, "yyyy-MM-dd") : undefined}
      />
    </FormGroup>
  )
}

export default DateInput
