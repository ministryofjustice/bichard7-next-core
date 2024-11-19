import { Dispatch } from "react"
import { SerializedDateRange } from "types/CaseListQueryParams"
import { FilterAction } from "types/CourtCaseFilter"

import { SmallButton } from "./DateInput.styles"

type DateType = "from" | "resolvedFrom" | "resolvedTo" | "to"
type ActionType = "caseResolvedFrom" | "caseResolvedTo" | "dateFrom" | "dateTo"
interface Props {
  dateRange: SerializedDateRange | undefined
  dateType: DateType
  dispatch: Dispatch<FilterAction>
  value: string
}

const dateActions = {
  from: "dateFrom",
  resolvedFrom: "caseResolvedFrom",
  resolvedTo: "caseResolvedTo",
  to: "dateTo"
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

const DateInput: React.FC<Props> = ({ dateRange, dateType, dispatch, value }: Props) => {
  const actionType = dateActions[dateType] as ActionType
  const renderSameDateButton = (dateType === "to" || dateType === "resolvedTo") && dateRange?.from
  const setSameDateValue = () => {
    if (dateRange?.from) {
      dispatch({ method: "add", type: actionType, value: dateRange.from })
    }
  }

  const SameDateButton = (
    <SmallButton
      className={`small-button--tag`}
      id={"apply-same-date-button"}
      onClick={setSameDateValue}
      style={{ marginLeft: "160px" }}
      type="button"
    >
      {"Same date"}
    </SmallButton>
  )

  return (
    <div className="govuk-form-group">
      <>
        <label className="govuk-body" htmlFor={`date-${dateType}`}>
          {formatLabelText(dateType)}
          {renderSameDateButton && SameDateButton}
        </label>
      </>
      <input
        className="govuk-input"
        id={`date-${dateType}`}
        name={dateType}
        onChange={(event) => {
          dispatch({ method: "add", type: actionType, value: event.target.value })
        }}
        type="date"
        value={value}
      />
    </div>
  )
}

export default DateInput
