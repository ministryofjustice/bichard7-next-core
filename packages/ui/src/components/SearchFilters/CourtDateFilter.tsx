import type { Dispatch } from "react"
import type { FilterAction } from "types/CourtCaseFilter"

import DateInput from "components/CustomDateInput/DateInput"
import RadioButton from "components/RadioButton/RadioButton"
import ExpandingFilters from "features/CourtCaseFilters/ExpandingFilters"
import { FormGroup } from "govuk-react"
import { SerializedDateRange } from "types/CaseListQueryParams"
import { CaseAgeOptions } from "utils/caseAgeOptions"
import { formatDisplayedDate } from "utils/date/formattedDate"
import { mapCaseAges } from "utils/validators/validateCaseAges"

import { CaseAgeContainer, ScrollableCaseAgesContainer } from "./DateFilter.styles"

interface Props {
  caseAgeCounts: Record<string, number>
  caseAges?: string[]
  dateRange: SerializedDateRange | undefined
  dispatch: Dispatch<FilterAction>
}

const getCaseAgeWithFormattedDate = (namedCaseAge: string): string => {
  const caseAge = mapCaseAges(namedCaseAge)
  if (!caseAge) {
    return namedCaseAge
  }

  const dateRange = caseAge[0]

  return namedCaseAge === "15 days ago and older"
    ? `15 days ago and older (up to ${formatDisplayedDate(dateRange.to)})`
    : `${namedCaseAge} (${formatDisplayedDate(dateRange.from)})`
}

const labelForCaseAge = (namedCaseAge: string, caseAgeCounts: Record<string, number>): string => {
  const caseCount = `(${caseAgeCounts[namedCaseAge as string]})`

  return ["Today", "Yesterday"].includes(namedCaseAge)
    ? `${namedCaseAge} ${caseCount}`
    : `${getCaseAgeWithFormattedDate(namedCaseAge)} ${caseCount}`
}

const caseAgeId = (caseAge: string): string => `case-age-${caseAge.toLowerCase().replace(/ /g, "-")}`

const CourtDateFilter: React.FC<Props> = ({ caseAgeCounts, caseAges, dateRange, dispatch }: Props) => (
  <FormGroup className={"govuk-form-group"}>
    <ExpandingFilters classNames="filters-court-date" filterName={"Court date"}>
      <fieldset className="govuk-fieldset">
        <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
          <RadioButton
            dataAriaControls={"conditional-date-range"}
            defaultChecked={!!dateRange?.from && !!dateRange.to}
            id={"date-range"}
            label={"Date range"}
            name={"courtDate"}
            onChange={(event) => dispatch({ method: "remove", type: "caseAge", value: event.target.value as string })}
          />
          <div className="govuk-radios__conditional" id="conditional-date-range">
            <div className="govuk-radios govuk-radios--small">
              <DateInput dateRange={dateRange} dateType="from" dispatch={dispatch} value={dateRange?.from ?? ""} />
              <DateInput dateRange={dateRange} dateType="to" dispatch={dispatch} value={dateRange?.to ?? ""} />
            </div>
          </div>
          <RadioButton
            dataAriaControls={"conditional-case-age"}
            defaultChecked={caseAges && caseAges.length > 0 ? true : false}
            id={"case-age"}
            label={"Case Received"}
            name={"courtDate"}
          />
          <div className="govuk-radios__conditional" id="conditional-case-age">
            <ScrollableCaseAgesContainer className={"scrollable-case-ages"}>
              <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                {Object.keys(CaseAgeOptions).map((namedCaseAge) => (
                  <CaseAgeContainer className={"case-age-option"} key={namedCaseAge}>
                    <div className="govuk-checkboxes__item">
                      <input
                        checked={caseAges?.includes(namedCaseAge as string)}
                        className="govuk-checkboxes__input"
                        id={caseAgeId(namedCaseAge)}
                        name="caseAge"
                        onChange={(event) => {
                          dispatch({
                            method: "remove",
                            type: "dateRange",
                            value: `${dateRange?.from} - ${dateRange?.to}`
                          })

                          const value = event.currentTarget.value as string
                          dispatch({ method: event.currentTarget.checked ? "add" : "remove", type: "caseAge", value })
                        }}
                        type="checkbox"
                        value={namedCaseAge}
                      ></input>
                      <label className="govuk-label govuk-checkboxes__label" htmlFor={caseAgeId(namedCaseAge)}>
                        {labelForCaseAge(namedCaseAge, caseAgeCounts)}
                      </label>
                    </div>
                  </CaseAgeContainer>
                ))}
              </div>
            </ScrollableCaseAgesContainer>
          </div>
        </div>
      </fieldset>
    </ExpandingFilters>
  </FormGroup>
)
export default CourtDateFilter
