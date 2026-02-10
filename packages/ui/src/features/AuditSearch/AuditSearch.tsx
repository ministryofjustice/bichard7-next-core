import { useState } from "react"
import { FormGroup } from "components/FormGroup"
import { IncludeRow, FormButtonRow } from "./AuditSearch.styles"
import { formatUserFullName } from "utils/formatUserFullName"
import { subDays, format, parse } from "date-fns"
import { RadioGroups } from "../../components/Radios/RadioGroup"
import RadioButton from "../../components/Radios/RadioButton"

interface Resolver {
  username: string
  forenames: string
  surname: string
}

interface Props {
  resolvers: Resolver[]
  triggerTypes: string[]
}

function parseDate(dateStr: string, format: string, defaultDate: Date): Date {
  const parsedDate = parse(dateStr, format, new Date())
  if (isNaN(parsedDate.getTime())) {
    return new Date(defaultDate.getTime())
  }
  return parsedDate
}

const AuditSearch: React.FC<Props> = (props) => {
  const { resolvers, triggerTypes } = props

  const DATE_FORMAT = "yyyy-MM-dd"

  const defaultVolume = "20"
  const volumes = ["10", "20", "50", "100"]

  const today = new Date()

  const [volume, setVolume] = useState(defaultVolume)

  const [fromDate, setFromDate] = useState(subDays(new Date(), 7))
  const [toDate, setToDate] = useState(new Date())

  const [resolvedBy, setResolvedBy] = useState<string[]>([])

  const [includeTriggers, setIncludeTriggers] = useState(false)
  const [includeExceptions, setIncludeExceptions] = useState(false)

  const formValid =
    fromDate <= toDate && toDate <= today && (includeTriggers || includeExceptions) && resolvedBy.length > 0
  const allResolversSelected = resolvers.every((rb) => resolvedBy.includes(rb.username))

  return (
    <div className="moj-filter">
      <div className="moj-filter__header">
        <div className="moj-filter__header-title">
          <h2 className="govuk-heading-m">{"Audit search"}</h2>
        </div>
      </div>
      <div className="moj-filter__content">
        <div className="moj-filter__options">
          <div className="govuk-grid-row">
            <div className="govuk-grid-column-one-quarter">
              <FormGroup>
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Dates"}</legend>
                  <FormGroup>
                    <label className="govuk-body" htmlFor="audit-date-from">
                      {"From date"}
                    </label>
                    <input
                      name="audit-date-from"
                      className="govuk-input"
                      type="date"
                      max={format(today, DATE_FORMAT)}
                      value={format(fromDate, DATE_FORMAT)}
                      onChange={(e) => setFromDate(parseDate(e.target.value, DATE_FORMAT, today))}
                    />
                  </FormGroup>
                  <FormGroup>
                    <label className="govuk-body" htmlFor="audit-date-to">
                      {"To date"}
                    </label>
                    <input
                      name="audit-date-to"
                      className="govuk-input"
                      type="date"
                      max={format(today, DATE_FORMAT)}
                      value={format(toDate, DATE_FORMAT)}
                      onChange={(e) => setToDate(parseDate(e.target.value, DATE_FORMAT, today))}
                    />
                  </FormGroup>
                </fieldset>
              </FormGroup>
              <FormGroup>
                <fieldset className="govuk-fieldset">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s govuk-!-margin-bottom-1">
                    {"Include"}
                  </legend>
                  <p className="govuk-body govuk-body-s govuk-!-margin-0">{"Select an option"}</p>
                  <IncludeRow className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        name="audit-include-triggers"
                        type="checkbox"
                        checked={includeTriggers}
                        onChange={(e) => setIncludeTriggers(e.target.checked)}
                      />
                      <label className="govuk-label govuk-checkboxes__label" htmlFor="audit-include-triggers">
                        {"Triggers"}
                      </label>
                    </div>
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        name="audit-include-exceptions"
                        type="checkbox"
                        checked={includeExceptions}
                        onChange={(e) => setIncludeExceptions(e.target.checked)}
                      />
                      <label className="govuk-label govuk-checkboxes__label" htmlFor="audit-include-exceptions">
                        {"Exceptions"}
                      </label>
                    </div>
                  </IncludeRow>
                </fieldset>
              </FormGroup>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <FormGroup>
                <fieldset className="govuk-fieldset" id="audit-search-resolved-by">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Resolved by"}</legend>
                  <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                    <div className="govuk-checkboxes__item">
                      <input
                        className="govuk-checkboxes__input"
                        id="audit-resolved-by-all"
                        type="checkbox"
                        checked={allResolversSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setResolvedBy(resolvers.map((rb) => rb.username))
                          } else {
                            if (allResolversSelected) {
                              setResolvedBy([])
                            }
                          }
                        }}
                      />
                      <label className="govuk-label govuk-checkboxes__label" htmlFor="audit-resolved-by-all">
                        {"All"}
                      </label>
                    </div>
                    {resolvers.map((resolver, index) => {
                      return (
                        <div key={resolver.username} className="govuk-checkboxes__item">
                          <input
                            className="govuk-checkboxes__input"
                            data-testid={`audit-resolved-by-${index}`}
                            type="checkbox"
                            data-resolver-name={resolver.username}
                            checked={resolvedBy.includes(resolver.username)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                if (!resolvedBy.includes(resolver.username)) {
                                  setResolvedBy([...resolvedBy, resolver.username])
                                }
                              } else {
                                setResolvedBy([
                                  ...resolvedBy.filter(
                                    (r) => r != e.target.attributes.getNamedItem("data-resolver-name")?.value
                                  )
                                ])
                              }
                            }}
                          />
                          <label className="govuk-label govuk-checkboxes__label" htmlFor={`audit-resolved-by-${index}`}>
                            {formatUserFullName(resolver.forenames, resolver.surname)}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </fieldset>
              </FormGroup>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <FormGroup>
                <fieldset className="govuk-fieldset" id="audit-search-triggers">
                  <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">{"Trigger type"}</legend>
                  <div className="govuk-checkboxes govuk-checkboxes--small" data-module="govuk-checkboxes">
                    {triggerTypes.map((triggerType, index) => {
                      return (
                        <div key={triggerType} className="govuk-checkboxes__item">
                          <input
                            className="govuk-checkboxes__input"
                            name="triggers"
                            data-testid={`audit-trigger-type-${index}`}
                            type="checkbox"
                          />
                          <label
                            className="govuk-label govuk-checkboxes__label"
                            htmlFor={`audit-trigger-type-${index}`}
                          >
                            {triggerType}
                          </label>
                        </div>
                      )
                    })}
                  </div>
                </fieldset>
              </FormGroup>
            </div>
            <div className="govuk-grid-column-one-quarter">
              <RadioGroups legendText={"Volume of cases"} id="audit-search-volume">
                <div className="govuk-radios govuk-radios--small" data-module="govuk-radios">
                  {volumes.map((v) => {
                    return (
                      <RadioButton
                        name={"volume"}
                        id={`audit-volume-${v}`}
                        onChange={(e) => setVolume(e.target.value)}
                        label={`${v}% of cases`}
                        checked={v == volume}
                        value={v}
                        key={v}
                      />
                    )
                  })}
                </div>
              </RadioGroups>
            </div>
          </div>
          <FormButtonRow>
            <button name="audit-search-button" className="govuk-button" disabled={!formValid}>
              {"Search cases"}
            </button>
            <p className="govuk-body">
              <a href="/bichard/audit/search" className="govuk-link govuk-link--no-visited-state">
                {"Clear search"}
              </a>
            </p>
          </FormButtonRow>
        </div>
      </div>
    </div>
  )
}

export default AuditSearch
